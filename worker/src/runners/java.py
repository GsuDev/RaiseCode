"""
runners/java.py
===============
Runner para Java. Envuelve el código en una clase Main si es necesario,
lo escribe en el contenedor, lo compila con javac y lo ejecuta.
"""

from typing import Dict
from .base import BaseRunner


MAIN_CLASS = "Main"


def _wrap_in_class(code: str) -> str:
    """
    Si el código ya contiene una clase con main(), lo devuelve tal cual.
    Si no, lo envuelve en una clase Main automáticamente.
    """
    if "class " in code and "public static void main" in code:
        return code

    indented = "\n".join("        " + line for line in code.splitlines())
    return (
        f"public class {MAIN_CLASS} {{\n"
        f"    public static void main(String[] args) {{\n"
        f"{indented}\n"
        f"    }}\n"
        f"}}\n"
    )


class JavaRunner(BaseRunner):
    # Sin Alpine: la imagen alpine de temurin no soporta ARM64
    image = "eclipse-temurin:17-jdk"

    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        final_code = _wrap_in_class(code)
        # Escapar comillas simples en el código para el heredoc
        safe_code = final_code.replace("'", "'\"'\"'")

        shell_cmd = (
            f"mkdir -p /app && cd /app && "
            f"cat > {MAIN_CLASS}.java << 'EOFCODE'\n"
            f"{safe_code}\n"
            f"EOFCODE\n"
            f"javac {MAIN_CLASS}.java && java {MAIN_CLASS}"
        )

        config = base_config.copy()
        config["command"] = ["sh", "-c", shell_cmd]
        return config
