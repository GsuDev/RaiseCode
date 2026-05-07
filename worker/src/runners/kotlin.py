"""
runners/kotlin.py
=================
Runner para Kotlin. Compila el fichero .kt con kotlinc y lo ejecuta con java.
"""

from typing import Dict
from .base import BaseRunner


MAIN_CLASS = "Main"


class KotlinRunner(BaseRunner):
    image = "zenika/kotlin:latest"
    timeout = 60
    cpu_limit = 1.0
    mem_limit = "512m"

    def wrap_with_inputs(self, code: str, inputs: list) -> str:
        calls = "\n".join(
            f"    println(solution({inp}))"
            for inp in inputs
        )
        return (
            f"fun main() {{\n"
            f"{calls}\n"
            f"}}\n\n"
            f"{code}\n"
        )

    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        final_code = code if "fun main" in code else f"fun main() {{\n{code}\n}}\n"
        safe_code = final_code.replace("'", "'\"'\"'")

        shell_cmd = (
            f"mkdir -p /app && cd /app && "
            f"cat > {MAIN_CLASS}.kt << 'EOFCODE'\n"
            f"{safe_code}\n"
            f"EOFCODE\n"
            f"kotlinc {MAIN_CLASS}.kt -include-runtime -d {MAIN_CLASS}.jar 2>/dev/null && "
            f"java -jar {MAIN_CLASS}.jar"
        )

        config = base_config.copy()
        config["command"] = ["sh", "-c", shell_cmd]
        return config
