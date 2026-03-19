"""
queue.py
========
Consumidor de la cola Redis y notificador de resultados a la API.
Corre en un hilo daemon separado al arrancar el worker.
"""

import json
import time
import logging
from typing import Dict

import redis as redis_lib
import requests

from config import REDIS_URL, REDIS_QUEUE_NAME, API_URL, WORKER_SECRET
from executor import execute_code

logger = logging.getLogger(__name__)

redis_client = redis_lib.from_url(REDIS_URL, decode_responses=True)


# ============================================================================
# NOTIFICACIÓN A LA API
# ============================================================================
def notify_api(submission_id: str, result: Dict, user_id: int, challenge_id: int) -> None:
    """
    Envía el resultado de la ejecución a POST /api/execution/result.
    Incluye el header X-Worker-Secret para autenticación interna.
    """
    payload = {
        "jobId":       submission_id,
        "challengeId": challenge_id,
        "userId":      user_id,
        **result,
    }
    headers = {"X-Worker-Secret": WORKER_SECRET}

    try:
        url      = f"{API_URL}/api/execution/result"
        response = requests.post(url, json=payload, headers=headers, timeout=5)

        if response.status_code == 200:
            logger.info(f"Resultado notificado para job {submission_id}")
        else:
            logger.warning(
                f"API respondió {response.status_code} para job {submission_id}"
            )

    except requests.exceptions.RequestException as e:
        logger.error(f"Error notificando API para job {submission_id}: {e}")


# ============================================================================
# CONSUMIDOR DE COLA
# ============================================================================
def process_queue() -> None:
    """
    Bucle principal del consumidor. Hace BLPOP bloqueante sobre la cola Redis,
    procesa cada job y notifica el resultado a la API.

    Campos esperados en el job:
        submission_id  (str)  — jobId generado por la API
        language       (str)  — 'javascript' | 'python' | 'java'
        code           (str)  — código del usuario
        test_cases     (list) — lista de { expected_output: str }
        user_id        (int)  — id del usuario que envió el código
        challenge_id   (int)  — id del reto
    """
    logger.info("Consumidor de cola iniciado, escuchando en Redis...")

    while True:
        try:
            raw = redis_client.blpop(REDIS_QUEUE_NAME, timeout=1)

            if not raw:
                continue

            _, job_data = raw
            job = json.loads(job_data)

            submission_id = job.get("submission_id")
            language      = job.get("language")
            code          = job.get("code")
            test_cases    = job.get("test_cases", [])
            user_id       = job.get("user_id")
            challenge_id  = job.get("challenge_id")

            logger.info(f"Procesando job {submission_id} ({language})")

            result = execute_code(language, code, test_cases)
            notify_api(submission_id, result, user_id, challenge_id)

        except json.JSONDecodeError as e:
            logger.error(f"Job con JSON inválido, descartado: {e}")

        except KeyboardInterrupt:
            logger.info("Consumidor detenido")
            break

        except Exception as e:
            logger.error(f"Error procesando job: {e}")
            time.sleep(1)
