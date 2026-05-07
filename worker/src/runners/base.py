"""
runners/base.py
===============
Clase base que define la interfaz que debe implementar cada runner de lenguaje.
"""

from abc import ABC, abstractmethod
from typing import Dict


class BaseRunner(ABC):
    """
    Contrato que debe cumplir cada runner de lenguaje.
    executor.py habla únicamente con esta interfaz — no conoce los lenguajes concretos.
    """

    # Imagen Docker que usa este runner
    image: str

    # Timeout en segundos (None = usar RUNNER_TIMEOUT global)
    timeout: int | None = None

    # Fracción de CPU (None = usar RUNNER_CPU_LIMIT global)
    cpu_limit: float | None = None

    @abstractmethod
    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        """
        Recibe el código del usuario y la config base del contenedor (límites de
        memoria, CPU, etc.) y devuelve la config completa lista para pasar a
        docker_client.containers.run(**config).
        """
        ...

    def wrap_with_inputs(self, code: str, inputs: list) -> str:
        """
        Envuelve el código del usuario para llamar a solution(input) por cada
        test case e imprimir el resultado. Cada lenguaje lo sobreescribe.
        Por defecto devuelve el código sin modificar.
        """
        return code

    def warmup(self) -> str:
        """Devuelve el nombre de la imagen para el precalentamiento al arrancar."""
        return self.image
