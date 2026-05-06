# HU-28 · Soporte de Kotlin como Lenguaje de Ejecución

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-05-06 |
| Sprint | Sprint 7 |
| Prioridad | Baja |
| Estimación | 5 puntos |

---

## 1. Descripción

**Como** alumno, **quiero** poder resolver retos escritos en Kotlin, **para** practicar el lenguaje orientado a JVM que se usa en desarrollo Android y backend moderno.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-16 — ejecución de código en tiempo real
- **Requiere:** HU-27 — conviene tener Java funcionando primero (comparten JVM)
- **Puede paralelizarse con:** HU-29, HU-30

---

## 3. 🐳 Worker — Nuevo runner de Kotlin

### Imagen Docker

Crear `runners/kotlin/Dockerfile`:

```dockerfile
FROM eclipse-temurin:17-jdk

RUN apt-get update && apt-get install -y wget unzip && \
    wget -q https://github.com/JetBrains/kotlin/releases/download/v2.0.0/kotlin-compiler-2.0.0.zip \
         -O /tmp/kotlin.zip && \
    unzip -q /tmp/kotlin.zip -d /opt && \
    rm /tmp/kotlin.zip && \
    apt-get clean

ENV PATH="/opt/kotlinc/bin:$PATH"
WORKDIR /app
```

### Runner Python

Crear `worker/src/runners/kotlin.py`:

```python
from typing import Dict
from .base import BaseRunner

MAIN_FILE = "Main.kt"

class KotlinRunner(BaseRunner):
    image = "code_judge_runner_kotlin:latest"

    def build_container_config(self, code: str, base_config: Dict) -> Dict:
        safe_code = code.replace("'", "'\"'\"'")
        shell_cmd = (
            f"mkdir -p /app && cd /app && "
            f"cat > {MAIN_FILE} << 'EOFCODE'\n"
            f"{safe_code}\n"
            f"EOFCODE\n"
            f"kotlinc {MAIN_FILE} -include-runtime -d main.jar 2>&1 && "
            f"java -jar main.jar"
        )
        config = base_config.copy()
        config["command"] = ["sh", "-c", shell_cmd]
        return config
```

### Registro

Añadir en `worker/src/runners/__init__.py`:

```python
from .kotlin import KotlinRunner

_REGISTRY = {
    ...
    "kotlin": KotlinRunner(),
}
```

### Makefile

Añadir en `build-runners` y `test-runner-kotlin`:

```makefile
build-runner-kotlin:
    docker build -t code_judge_runner_kotlin:latest ./runners/kotlin

test-runner-kotlin:
    @echo 'fun main() { println("Hola desde Kotlin") }' | \
    docker run --rm -i --network none --memory="256m" --cpus="0.5" \
    code_judge_runner_kotlin:latest
```

---

## 4. 🗃️ Backend (NestJS)

### Seed

Añadir `{ name: 'Kotlin' }` en `api/prisma/seeds/seedCatalogues.ts`:

```typescript
await prisma.language.createMany({
    data: [
        { name: 'JavaScript' },
        { name: 'Python' },
        { name: 'Java' },
        { name: 'Kotlin' },     // ← nuevo
        { name: 'TypeScript' },
    ],
});
```

No requiere cambios en el controller ni service de ejecución: ya reciben el lenguaje dinámicamente.

---

## 5. 🎨 Frontend (React)

### Template inicial del editor

En `frontend/src/challenges/solver/hooks/useChallengeSolver.tsx`, añadir case para Kotlin:

```typescript
if (lang === 'kotlin') {
    return `// Reto: ${title}\n\nfun solution(n: Any): Any {\n    // Tu código aquí\n    return Unit\n}\n\nfun main() {\n    println(solution(TODO()))\n}\n`;
}
```

### Monaco Editor

Monaco no incluye soporte nativo de Kotlin. Pasar `language="kotlin"` igualmente — Monaco lo tratará como texto plano sin resaltado. Para resaltado completo se puede integrar `monaco-editor-contrib` o simplemente dejarlo como texto plano (aceptable para esta versión).

---

## 6. Criterios de aceptación ✅

- [ ] `make build-runners` construye la imagen `code_judge_runner_kotlin:latest`.
- [ ] `make test-runner-kotlin` imprime `Hola desde Kotlin` sin errores.
- [ ] Al crear un reto se puede seleccionar Kotlin como lenguaje.
- [ ] Al resolver un reto Kotlin, el editor muestra el template inicial.
- [ ] La ejecución devuelve resultados correctos para tests básicos.
- [ ] Un error de compilación devuelve `runtime_error` con el mensaje del compilador.
- [ ] El tiempo de compilación de Kotlin no supera el timeout configurado (ajustar `RUNNER_TIMEOUT` si es necesario — `kotlinc` es lento en el primer arranque).
