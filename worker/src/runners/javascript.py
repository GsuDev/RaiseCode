"""
runners/javascript.py
=====================
Runner para JavaScript. Ejecuta el código directamente con `node -e`.
"""

from typing import Dict
from .base import BaseRunner


class JavaScriptRunner(BaseRunner):
    image = "node:18-alpine"

    def wrap_with_inputs(self, code: str, inputs: list) -> str:
        calls = "\n".join(
            f"console.log(JSON.stringify(solution({inp})));"
            for inp in inputs
        )
        return f"{code}\n{calls}"

    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        config = base_config.copy()
        config["command"] = ["node", "-e", code]
        return config
