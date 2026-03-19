"""
config.py
=========
Variables de entorno y constantes globales del worker.
Un único lugar para cambiar configuración.
"""

import os
from dotenv import load_dotenv

load_dotenv()

PORT                = int(os.getenv("PORT", 4000))
REDIS_HOST          = os.getenv("REDIS_HOST", "redis")
REDIS_PORT          = int(os.getenv("REDIS_PORT", 6379))
REDIS_URL           = os.getenv("REDIS_URL", f"redis://{REDIS_HOST}:{REDIS_PORT}")
API_URL             = os.getenv("API_URL", "http://api:3000")
WORKER_SECRET       = os.getenv("WORKER_SECRET", "")
RUNNER_TIMEOUT      = int(os.getenv("RUNNER_TIMEOUT", 10))
RUNNER_MEMORY_LIMIT = os.getenv("RUNNER_MEMORY_LIMIT", "256m")
RUNNER_CPU_LIMIT    = float(os.getenv("RUNNER_CPU_LIMIT", 0.5))

REDIS_QUEUE_NAME    = "raisecode_execution_queue"
