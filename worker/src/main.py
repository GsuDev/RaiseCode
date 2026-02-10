"""
Code Judge Platform - Worker Service (Python)
==============================================

Este servicio orquesta la ejecución de código de usuario en contenedores Docker aislados.

FLUJO COMPLETO DE EJECUCIÓN:
============================

1. API recibe código del usuario → Crea job en Redis
2. Worker escucha la cola de Redis → Procesa job
3. Worker crea contenedor Docker efímero con el runner apropiado
4. Worker ENVÍA el código al contenedor mediante STDIN
5. Runner lee el código desde STDIN y lo ejecuta en sandbox
6. Runner imprime resultado a STDOUT/STDERR
7. Worker CAPTURA la salida del contenedor
8. Contenedor se autodestruye (AutoRemove)
9. Worker devuelve resultado a la API

¿CÓMO LLEGA EL CÓDIGO A LOS RUNNERS?
====================================

Método usado: STDIN (Standard Input)
------------------------------------
- El código NO se guarda en archivos del host
- El código NO se monta como volumen
- El código se envía directamente al contenedor por la entrada estándar

Ejemplo práctico:
```
código_usuario = "print('Hola')"
contenedor.exec_run("python", stdin=True, input=código_usuario.encode())
```

Es equivalente a hacer en terminal:
```bash
echo "print('Hola')" | docker run -i python:3.11-alpine python
```

VENTAJAS de este método:
- No hay archivos temporales que limpiar
- Más seguro: el código nunca toca el filesystem del host
- Más rápido: no hay I/O de disco
- Más simple: no hay gestión de paths

¿Y LOS TEST CASES?
==================

Los test cases NO se pasan al runner directamente.
El runner solo ejecuta el código y devuelve stdout/stderr.

Proceso:
1. Runner ejecuta código → devuelve stdout
2. Worker compara stdout con expected_output de cada test case
3. Worker calcula score basado en coincidencias

Por tanto:
- Los test cases están en PostgreSQL (tabla test_cases)
- La API los carga cuando recibe un submission
- Los pasa al Worker en el job
- El Worker los usa DESPUÉS de la ejecución para validar
"""

import os
import sys
import json
import time
import logging
from typing import Dict, Optional, Tuple
from datetime import datetime

import docker
import redis
import requests
from flask import Flask, request, jsonify
from dotenv import load_dotenv

# Cargar variables de entorno
load_dotenv()

# Configuración
PORT = int(os.getenv('PORT', 4000))
REDIS_URL = os.getenv('REDIS_URL', 'redis://redis:6379')
API_URL = os.getenv('API_URL', 'http://api:3000')
RUNNER_TIMEOUT = int(os.getenv('RUNNER_TIMEOUT', 10))  # segundos
RUNNER_MEMORY_LIMIT = os.getenv('RUNNER_MEMORY_LIMIT', '256m')
RUNNER_CPU_LIMIT = float(os.getenv('RUNNER_CPU_LIMIT', 0.5))

# Logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Cliente Docker (USA DOCKER SDK EN LUGAR DE SOCKETS)
docker_client = docker.from_env()

# Cliente Redis
redis_client = redis.from_url(REDIS_URL, decode_responses=True)

# Flask app para API REST (opcional, para testing directo)
app = Flask(__name__)

# ============================================================================
# CONFIGURACIÓN DE RUNNERS
# ============================================================================
LANGUAGE_RUNNERS = {
    'javascript': {
        'image': 'code_judge_runner_js:latest',
        'stdin_enabled': True,
        'extension': 'js'
    },
    'python': {
        'image': 'code_judge_runner_python:latest',
        'stdin_enabled': True,
        'extension': 'py'
    },
    'java': {
        'image': 'code_judge_runner_java:latest',
        'stdin_enabled': False,  # Java necesita archivo (compilación)
        'extension': 'java',
        'main_class': 'Main'
    }
}


# ============================================================================
# FUNCIÓN PRINCIPAL: EJECUTAR CÓDIGO EN CONTENEDOR
# ============================================================================
def execute_code(language: str, code: str, test_cases: list) -> Dict:
    """
    Ejecuta código de usuario en un contenedor Docker aislado.
    
    EXPLICACIÓN DETALLADA DEL PROCESO:
    ==================================
    
    1. SELECCIÓN DE RUNNER
       - Según el lenguaje, elegimos la imagen Docker apropiada
       - Cada imagen tiene su propio Dockerfile y script execute.*
    
    2. CREACIÓN DEL CONTENEDOR
       - docker_client.containers.run() crea Y ejecuta el contenedor
       - Parámetros de seguridad:
         * network_mode='none' → Sin acceso a red
         * mem_limit → Límite de memoria
         * nano_cpus → Límite de CPU
         * pids_limit → Máximo de procesos (previene fork bombs)
         * remove=True → Auto-destrucción al terminar
         * detach=False → Esperamos a que termine
         * stdin_open=True → Permite enviar datos por stdin
    
    3. ENVÍO DEL CÓDIGO
       - Para JS y Python: enviamos código por STDIN
         código.encode('utf-8') → convertimos string a bytes
       - Para Java: necesitamos montar archivo (compilación requiere archivo)
    
    4. CAPTURA DE SALIDA
       - stdout captura print(), console.log(), System.out.println()
       - stderr captura errores de sintaxis o runtime
       - exit_code indica éxito (0) o fallo (≠0)
    
    5. VALIDACIÓN CON TEST CASES
       - Comparamos stdout con expected_output de cada test
       - Calculamos score basado en tests pasados
    
    Args:
        language: 'javascript', 'python', o 'java'
        code: Código fuente del usuario
        test_cases: Lista de dicts con 'input' y 'expected_output'
    
    Returns:
        Dict con resultado de la ejecución y validación
    """
    runner = LANGUAGE_RUNNERS.get(language)
    
    if not runner:
        return {
            'success': False,
            'error': 'UNSUPPORTED_LANGUAGE',
            'message': f'Lenguaje no soportado: {language}'
        }
    
    logger.info(f"Ejecutando código en {language}")
    
    try:
        # ====================================================================
        # CONFIGURACIÓN DEL CONTENEDOR
        # ====================================================================
        container_config = {
            'image': runner['image'],
            'network_mode': 'none',  # CRÍTICO: Sin acceso a red
            'mem_limit': RUNNER_MEMORY_LIMIT,
            'nano_cpus': int(RUNNER_CPU_LIMIT * 1e9),
            'pids_limit': 50,  # Previene fork bombs
            'remove': True,  # Auto-destruir al terminar
            'detach': False,  # Esperar a que termine
            'stdin_open': True,  # Habilitar stdin
            'stdout': True,
            'stderr': True,
        }
        
        # Timeout a nivel de contenedor
        container_config['environment'] = {
            'TIMEOUT': str(RUNNER_TIMEOUT)
        }
        
        start_time = time.time()
        
        # ====================================================================
        # CASO ESPECIAL: JAVA (Necesita archivo para compilar)
        # ====================================================================
        if language == 'java':
            # Para Java, creamos archivo temporal y lo montamos
            import tempfile
            import os
            
            with tempfile.TemporaryDirectory() as tmpdir:
                # Escribir código en Main.java
                java_file = os.path.join(tmpdir, f"{runner['main_class']}.java")
                with open(java_file, 'w') as f:
                    f.write(code)
                
                # Montar directorio como volumen read-only
                container_config['volumes'] = {
                    tmpdir: {'bind': '/code', 'mode': 'ro'}
                }
                
                # Ejecutar
                try:
                    output = docker_client.containers.run(
                        **container_config,
                        timeout=RUNNER_TIMEOUT
                    )
                    stdout = output.decode('utf-8') if output else ''
                    stderr = ''
                    exit_code = 0
                except docker.errors.ContainerError as e:
                    stdout = e.output.decode('utf-8') if e.output else ''
                    stderr = str(e)
                    exit_code = e.exit_status
        
        # ====================================================================
        # CASO NORMAL: JavaScript y Python (STDIN)
        # ====================================================================
        else:
            # AQUÍ ES DONDE ENVIAMOS EL CÓDIGO AL RUNNER
            # ============================================
            # El código se pasa como 'stdin' en bytes
            # El runner lo lee desde su entrada estándar
            # Es como hacer: echo "código" | docker run -i imagen
            
            try:
                output = docker_client.containers.run(
                    **container_config,
                    stdin=code.encode('utf-8'),  # ← AQUÍ SE ENVÍA EL CÓDIGO
                    timeout=RUNNER_TIMEOUT
                )
                stdout = output.decode('utf-8') if output else ''
                stderr = ''
                exit_code = 0
                
            except docker.errors.ContainerError as e:
                # Error en la ejecución (exit code != 0)
                stdout = e.output.decode('utf-8') if e.output else ''
                stderr = str(e)
                exit_code = e.exit_status
        
        execution_time = int((time.time() - start_time) * 1000)  # ms
        
        # ====================================================================
        # VALIDACIÓN CON TEST CASES
        # ====================================================================
        test_results = []
        passed_tests = 0
        
        for i, test_case in enumerate(test_cases):
            expected = test_case.get('expected_output', '').strip()
            actual = stdout.strip()
            
            # Comparación simple (puede mejorarse con diff, normalización, etc.)
            passed = (actual == expected)
            
            test_results.append({
                'test_number': i + 1,
                'passed': passed,
                'expected': expected,
                'actual': actual,
                'hidden': test_case.get('is_hidden', False)
            })
            
            if passed:
                passed_tests += 1
        
        # Calcular score (porcentaje de tests pasados)
        total_tests = len(test_cases)
        score = int((passed_tests / total_tests * 100)) if total_tests > 0 else 0
        
        # ====================================================================
        # RESULTADO FINAL
        # ====================================================================
        success = (exit_code == 0) and (passed_tests == total_tests)
        
        result = {
            'success': success,
            'exit_code': exit_code,
            'execution_time': execution_time,
            'stdout': stdout,
            'stderr': stderr,
            'score': score,
            'tests_passed': passed_tests,
            'tests_total': total_tests,
            'test_results': test_results,
            'status': 'accepted' if success else (
                'timeout' if exit_code == 124 else
                'wrong_answer' if exit_code == 0 else
                'runtime_error'
            )
        }
        
        logger.info(f"Ejecución completada: {score}% ({passed_tests}/{total_tests} tests)")
        return result
        
    except docker.errors.ImageNotFound:
        logger.error(f"Imagen no encontrada: {runner['image']}")
        return {
            'success': False,
            'error': 'IMAGE_NOT_FOUND',
            'message': f"Runner no encontrado: {runner['image']}"
        }
    
    except docker.errors.APIError as e:
        logger.error(f"Error de Docker API: {e}")
        return {
            'success': False,
            'error': 'DOCKER_ERROR',
            'message': str(e)
        }
    
    except Exception as e:
        logger.error(f"Error inesperado: {e}")
        return {
            'success': False,
            'error': 'UNEXPECTED_ERROR',
            'message': str(e)
        }


# ============================================================================
# PROCESADOR DE COLA REDIS
# ============================================================================
def process_queue():
    """
    Escucha la cola de Redis y procesa jobs de ejecución.
    
    FLUJO:
    1. Bloquea esperando por jobs (BLPOP)
    2. Deserializa el job JSON
    3. Ejecuta el código
    4. Notifica resultado a la API
    """
    logger.info("Iniciando procesador de cola...")
    
    while True:
        try:
            # BLPOP bloquea hasta que hay un elemento en la cola
            # Timeout de 1 segundo para poder manejar signals
            result = redis_client.blpop('code_execution_queue', timeout=1)
            
            if result:
                queue_name, job_data = result
                job = json.loads(job_data)
                
                submission_id = job.get('submission_id')
                language = job.get('language')
                code = job.get('code')
                test_cases = job.get('test_cases', [])
                
                logger.info(f"Procesando job: {submission_id}")
                
                # Ejecutar código
                execution_result = execute_code(language, code, test_cases)
                
                # Notificar a la API
                notify_api(submission_id, execution_result)
                
        except json.JSONDecodeError as e:
            logger.error(f"Error decodificando job: {e}")
        
        except KeyboardInterrupt:
            logger.info("Deteniendo worker...")
            break
        
        except Exception as e:
            logger.error(f"Error procesando cola: {e}")
            time.sleep(1)  # Esperar antes de reintentar


def notify_api(submission_id: str, result: Dict):
    """
    Notifica el resultado de la ejecución a la API.
    
    Args:
        submission_id: ID del submission
        result: Resultado de la ejecución
    """
    try:
        url = f"{API_URL}/submissions/{submission_id}/result"
        response = requests.post(url, json=result, timeout=5)
        
        if response.status_code == 200:
            logger.info(f"Resultado notificado para {submission_id}")
        else:
            logger.warning(f"Error notificando API: {response.status_code}")
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error en request a API: {e}")


# ============================================================================
# API REST (Para testing directo del worker)
# ============================================================================
@app.route('/health', methods=['GET'])
def health():
    """Health check endpoint"""
    return jsonify({
        'status': 'ok',
        'docker': check_docker(),
        'redis': check_redis(),
        'timestamp': datetime.utcnow().isoformat()
    })


@app.route('/execute', methods=['POST'])
def execute():
    """
    Endpoint para ejecutar código directamente (sin cola).
    Útil para testing.
    
    Body:
    {
        "language": "python",
        "code": "print('Hello')",
        "test_cases": [
            {"input": "", "expected_output": "Hello"}
        ]
    }
    """
    data = request.json
    
    language = data.get('language')
    code = data.get('code')
    test_cases = data.get('test_cases', [])
    
    if not language or not code:
        return jsonify({
            'error': 'Missing required fields: language, code'
        }), 400
    
    result = execute_code(language, code, test_cases)
    return jsonify(result)


@app.route('/queue', methods=['POST'])
def add_to_queue():
    """
    Endpoint para agregar job a la cola.
    
    Body:
    {
        "submission_id": "uuid",
        "language": "python",
        "code": "print('Hello')",
        "test_cases": [...]
    }
    """
    data = request.json
    
    # Validar campos requeridos
    required = ['submission_id', 'language', 'code']
    if not all(field in data for field in required):
        return jsonify({
            'error': f'Missing required fields: {", ".join(required)}'
        }), 400
    
    # Agregar a cola Redis
    redis_client.rpush('code_execution_queue', json.dumps(data))
    
    logger.info(f"Job agregado a cola: {data['submission_id']}")
    
    return jsonify({
        'success': True,
        'message': 'Job added to queue'
    })


def check_docker() -> bool:
    """Verifica conexión con Docker"""
    try:
        docker_client.ping()
        return True
    except:
        return False


def check_redis() -> bool:
    """Verifica conexión con Redis"""
    try:
        redis_client.ping()
        return True
    except:
        return False


# ============================================================================
# MAIN
# ============================================================================
if __name__ == '__main__':
    logger.info("=" * 70)
    logger.info("CODE JUDGE WORKER - Iniciando...")
    logger.info("=" * 70)
    
    # Verificar conexiones
    if not check_docker():
        logger.error("No se puede conectar con Docker Engine")
        sys.exit(1)
    logger.info("✓ Conexión con Docker Engine establecida")
    
    if not check_redis():
        logger.error("No se puede conectar con Redis")
        sys.exit(1)
    logger.info("✓ Conexión con Redis establecida")
    
    # Verificar imágenes de runners
    logger.info("Verificando imágenes de runners...")
    for lang, config in LANGUAGE_RUNNERS.items():
        try:
            docker_client.images.get(config['image'])
            logger.info(f"✓ Runner {lang}: {config['image']}")
        except docker.errors.ImageNotFound:
            logger.warning(f"⚠ Runner {lang} no encontrado: {config['image']}")
    
    logger.info("=" * 70)
    logger.info(f"Worker escuchando en puerto {PORT}")
    logger.info(f"Procesando cola: code_execution_queue")
    logger.info("=" * 70)
    
    # Iniciar procesador de cola en thread separado
    import threading
    queue_thread = threading.Thread(target=process_queue, daemon=True)
    queue_thread.start()
    
    # Iniciar API REST
    app.run(host='0.0.0.0', port=PORT, debug=False)