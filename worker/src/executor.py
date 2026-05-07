"""
executor.py
===========
Núcleo de ejecución. No conoce ningún lenguaje concreto — delega en el runner
correspondiente para construir el comando Docker y se encarga del resto:
lanzar el contenedor, capturar output y validar los test cases.
"""

import time
import logging
from typing import Dict, List

import docker
import docker.errors

from config import RUNNER_MEMORY_LIMIT, RUNNER_CPU_LIMIT, RUNNER_TIMEOUT
from runners import get_runner

logger = logging.getLogger(__name__)

# Cliente Docker compartido (creado una sola vez al importar el módulo)
docker_client = docker.from_env()


# ============================================================================
# CONFIG BASE DEL CONTENEDOR
# Límites de seguridad comunes a todos los runners.
# ============================================================================
def _base_container_config(image: str, cpu_limit: float | None = None) -> Dict:
    cpu = cpu_limit if cpu_limit is not None else RUNNER_CPU_LIMIT
    return {
        "image":        image,
        "network_mode": "none",          # sin acceso a red
        "mem_limit":    RUNNER_MEMORY_LIMIT,
        "nano_cpus":    int(cpu * 1e9),
        "pids_limit":   50,              # evita fork bombs
        "remove":       True,
        "detach":       False,
        "stdout":       True,
        "stderr":       True,
    }


# ============================================================================
# EJECUCIÓN EN DOCKER
# ============================================================================
def _run_container(config: Dict, timeout: int = RUNNER_TIMEOUT) -> tuple[str, str, int]:
    """
    Lanza el contenedor con la config dada.
    Devuelve (stdout, stderr, exit_code).
    El exit_code 124 indica timeout.
    """
    cfg = config.copy()
    cfg["detach"] = True
    cfg["remove"] = False  # lo eliminamos manualmente tras leer los logs

    container = None
    try:
        container = docker_client.containers.run(**cfg)

        try:
            result = container.wait(timeout=timeout)
            exit_code = result.get("StatusCode", 1)
        except Exception:
            # Timeout: matar el contenedor y devolver exit_code especial
            try:
                container.kill()
            except Exception:
                pass
            return "", "Execution timed out", 124

        stdout = container.logs(stdout=True, stderr=False).decode("utf-8", errors="replace")
        stderr = container.logs(stdout=False, stderr=True).decode("utf-8", errors="replace")
        return stdout, stderr, exit_code

    except docker.errors.ContainerError as e:
        stderr = str(e)
        exit_code = e.exit_status if hasattr(e, "exit_status") else 1
        return "", stderr, exit_code

    except Exception as e:
        return "", str(e), 1

    finally:
        if container:
            try:
                container.remove(force=True)
            except Exception:
                pass


# ============================================================================
# VALIDACIÓN DE TEST CASES
# ============================================================================
def _validate_tests(stdout: str, exit_code: int, test_cases: List[Dict]) -> tuple[List[Dict], int, int]:
    """
    Modo libre: compara el output completo del programa con el expected_output
    de cada test (todos esperan el mismo output).
    Devuelve (test_results, passed_tests, total_tests).
    """
    actual = stdout.strip()
    results = []
    passed = 0

    for i, tc in enumerate(test_cases):
        expected = tc.get("expected_output", "").strip()
        ok = (actual == expected) and (exit_code == 0)
        if ok:
            passed += 1
        results.append({
            "test_number": i + 1,
            "passed":      ok,
            "expected":    expected,
            "actual":      actual,
        })

    return results, passed, len(test_cases)


def _validate_tests_by_line(stdout: str, exit_code: int, test_cases: List[Dict]) -> tuple[List[Dict], int, int]:
    """
    Modo parametrizado: cada línea del stdout corresponde a un test case.
    Devuelve (test_results, passed_tests, total_tests).
    """
    lines = stdout.strip().split("\n") if stdout.strip() else []
    results = []
    passed = 0

    for i, tc in enumerate(test_cases):
        expected = tc.get("expected_output", "").strip()
        actual = lines[i].strip() if i < len(lines) else ""
        ok = (actual == expected) and (exit_code == 0)
        if ok:
            passed += 1
        results.append({
            "test_number": i + 1,
            "passed":      ok,
            "expected":    expected,
            "actual":      actual,
        })

    return results, passed, len(test_cases)


# ============================================================================
# PUNTO DE ENTRADA PÚBLICO
# ============================================================================
def execute_code(language: str, code: str, test_cases: List[Dict]) -> Dict:
    """
    Ejecuta el código del usuario en un contenedor Docker aislado y valida
    los test cases.

    Args:
        language:   Nombre del lenguaje en minúsculas ('javascript', 'python', 'java').
        code:       Código fuente del usuario.
        test_cases: Lista de dicts con al menos 'expected_output'.

    Returns:
        Dict con los resultados listos para enviar a la API.
    """
    runner = get_runner(language)

    if not runner:
        return {
            "success": False,
            "error":   "UNSUPPORTED_LANGUAGE",
            "message": f"Lenguaje no soportado: {language}",
        }

    logger.info(f"Ejecutando código en {language}")

    try:
        timeout          = runner.timeout if runner.timeout is not None else RUNNER_TIMEOUT
        base_config      = _base_container_config(runner.image, runner.cpu_limit)
        container_config = runner.build_container_config(code, base_config)

        # Si todos los tests tienen input → modo parametrizado:
        # inyectar llamadas a solution(input) y validar línea a línea.
        inputs = [tc.get("input", "").strip() for tc in test_cases]
        use_inputs = bool(test_cases) and all(inputs)

        if use_inputs:
            wrapped_code = runner.wrap_with_inputs(code, inputs)
            run_config   = runner.build_container_config(wrapped_code, base_config)
        else:
            run_config   = container_config

        start_time                = time.time()
        stdout, stderr, exit_code = _run_container(run_config, timeout)
        execution_time            = time.time() - start_time

        # Validar tests o simplemente comprobar que no hay error
        if test_cases:
            if use_inputs:
                test_results, passed_tests, total_tests = _validate_tests_by_line(
                    stdout, exit_code, test_cases
                )
            else:
                test_results, passed_tests, total_tests = _validate_tests(
                    stdout, exit_code, test_cases
                )
        else:
            test_results  = []
            passed_tests  = 1 if exit_code == 0 else 0
            total_tests   = 1

        score   = int(passed_tests / total_tests * 100) if total_tests > 0 else 0
        success = exit_code == 0

        if exit_code == 124:
            status = "timeout"
        elif success and score == 100:
            status = "accepted"
        elif exit_code == 0:
            status = "wrong_answer"
        else:
            status = "runtime_error"

        logger.info(f"Ejecución completada: {score}% ({passed_tests}/{total_tests} tests)")

        return {
            "success":        success,
            "execution_time": execution_time,
            "stdout":         stdout,
            "stderr":         stderr,
            "score":          score,
            "tests_passed":   passed_tests,
            "tests_total":    total_tests,
            "test_results":   test_results,
            "status":         status,
        }

    except docker.errors.ImageNotFound:
        logger.error(f"Imagen no encontrada: {runner.image}")
        return {
            "success": False,
            "error":   "IMAGE_NOT_FOUND",
            "message": f"Imagen no encontrada: {runner.image}. Ejecuta: docker pull {runner.image}",
        }

    except docker.errors.APIError as e:
        logger.error(f"Error de Docker API: {e}")
        return {"success": False, "error": "DOCKER_ERROR", "message": str(e)}

    except Exception as e:
        import traceback
        logger.error(f"Error inesperado: {e}")
        traceback.print_exc()
        return {"success": False, "error": "UNEXPECTED_ERROR", "message": str(e)}
