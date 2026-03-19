"""
RaiseCode Worker Service
========================

Estructura de módulos:
  main.py       — Flask app, endpoints REST y arranque
  config.py     — variables de entorno y constantes
  executor.py   — lógica de ejecución (agnóstica al lenguaje)
  queue.py      — consumidor Redis + notificador API
  runners/
    __init__.py — registro de runners
    base.py     — clase base Runner
    javascript.py
    python.py
    java.py

Para añadir un lenguaje nuevo: crear runners/<lenguaje>.py y
registrarlo en runners/__init__.py. No hay que tocar nada más.

IMPORTANTE: Esta versión NO soporta inputs interactivos (input(), Scanner, etc.)
Todo el código debe ser autocontenido.
"""

import sys
import logging
import threading
from datetime import datetime

import docker
import docker.errors
import redis as redis_lib
from flask import Flask, request, jsonify

from config import PORT, REDIS_URL
from executor import execute_code, docker_client
from job_queue import process_queue
from runners import all_runners

# ============================================================================
# LOGGING
# ============================================================================
logging.basicConfig(
    level=logging.INFO,
    format="%(asctime)s - %(name)s - %(levelname)s - %(message)s",
)
logger = logging.getLogger(__name__)

# ============================================================================
# FLASK APP
# ============================================================================
app = Flask(__name__)

redis_client_check = redis_lib.from_url(REDIS_URL, decode_responses=True)


# ============================================================================
# HEALTH CHECK
# ============================================================================
@app.route("/health", methods=["GET"])
def health():
    return jsonify({
        "status":    "ok",
        "docker":    _check_docker(),
        "redis":     _check_redis(),
        "timestamp": datetime.utcnow().isoformat(),
    })


# ============================================================================
# EJECUCIÓN DIRECTA (sin cola, útil para testing)
# ============================================================================
@app.route("/execute", methods=["POST"])
def execute():
    """
    POST /execute
    Body: { "language": "javascript", "code": "...", "test_cases": [...] }
    Ejecuta de forma síncrona y devuelve el resultado directamente.
    """
    data = request.json or {}

    language   = data.get("language")
    code       = data.get("code")
    test_cases = data.get("test_cases", [])

    if not language or not code:
        return jsonify({"error": "Missing required fields: language, code"}), 400

    result = execute_code(language, code, test_cases)
    return jsonify(result)


# ============================================================================
# ENCOLAR JOB
# ============================================================================
@app.route("/queue", methods=["POST"])
def add_to_queue():
    """
    POST /queue
    Body: { "submission_id", "language", "code", "test_cases", "user_id", "challenge_id" }
    Encola el job en Redis para procesamiento asíncrono.
    """
    import json
    from config import REDIS_QUEUE_NAME

    data = request.json or {}

    required = ["submission_id", "language", "code"]
    missing  = [f for f in required if not data.get(f)]
    if missing:
        return jsonify({"error": f"Missing required fields: {', '.join(missing)}"}), 400

    redis_client_check.rpush(REDIS_QUEUE_NAME, json.dumps(data))
    logger.info(f"Job encolado: {data['submission_id']}")

    return jsonify({"success": True, "message": "Job added to queue"})


# ============================================================================
# HELPERS
# ============================================================================
def _check_docker() -> bool:
    try:
        docker_client.ping()
        return True
    except Exception:
        return False


def _check_redis() -> bool:
    try:
        redis_client_check.ping()
        return True
    except Exception:
        return False


def _warmup_images() -> None:
    """Descarga las imágenes Docker de todos los runners si no están en caché."""
    logger.info("Verificando imágenes Docker...")
    for name, runner in all_runners().items():
        image = runner.warmup()
        try:
            docker_client.images.get(image)
            logger.info(f"  ✓ {name}: {image}")
        except docker.errors.ImageNotFound:
            logger.warning(f"  ⚠ Descargando {image}...")
            try:
                docker_client.images.pull(image)
                logger.info(f"  ✓ {name}: {image} descargada")
            except Exception as e:
                logger.error(f"  ✗ {name}: error descargando {image} — {e}")


# ============================================================================
# ARRANQUE
# ============================================================================
if __name__ == "__main__":
    logger.info("=" * 60)
    logger.info("RAISECODE WORKER")
    logger.info("=" * 60)

    # Verificar Docker
    if not _check_docker():
        logger.error("No se puede conectar con Docker Engine")
        sys.exit(1)
    logger.info("✓ Docker Engine conectado")

    # Verificar Redis
    if not _check_redis():
        logger.warning("⚠ Redis no disponible")
    else:
        logger.info("✓ Redis conectado")

    # Precalentar imágenes
    _warmup_images()

    logger.info("=" * 60)
    logger.info(f"Escuchando en puerto {PORT}")
    logger.info("=" * 60)

    # Arrancar consumidor de cola en hilo daemon
    queue_thread = threading.Thread(target=process_queue, daemon=True)
    queue_thread.start()

    app.run(host="0.0.0.0", port=PORT, debug=False)
