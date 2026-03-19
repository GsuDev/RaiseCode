"""
runners/python.py
=================
Runner para Python. Ejecuta el código directamente con `python -c`.
"""

from typing import Dict
from .base import BaseRunner


class PythonRunner(BaseRunner):
    image = "python:3.11-alpine"

    def wrap_with_inputs(self, code: str, inputs: list) -> str:
        calls = "\n".join(f"print(solution({inp}))" for inp in inputs)
        return f"{code}\n{calls}"

    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        config = base_config.copy()
        config["command"] = ["python", "-c", code]
        return config
