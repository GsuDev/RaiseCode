"""
runners/__init__.py
===================
Registro central de runners por nombre de lenguaje.
Para añadir un lenguaje nuevo: crear su fichero y registrarlo aquí. Nada más.
"""

from .javascript import JavaScriptRunner
from .python import PythonRunner
from .java import JavaRunner
from .base import BaseRunner
from typing import Optional

# Mapa lenguaje (en minúsculas) → instancia de su runner
_REGISTRY: dict[str, BaseRunner] = {
    "javascript": JavaScriptRunner(),
    "python":     PythonRunner(),
    "java":       JavaRunner(),
}


def get_runner(language: str) -> Optional[BaseRunner]:
    """Devuelve el runner para el lenguaje dado, o None si no está soportado."""
    return _REGISTRY.get(language.lower())


def all_runners() -> dict[str, BaseRunner]:
    """Devuelve una copia del registro completo (usado en el arranque para warmup)."""
    return dict(_REGISTRY)
