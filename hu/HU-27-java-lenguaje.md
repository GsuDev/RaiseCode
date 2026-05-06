# HU-27 · Soporte de Java como Lenguaje de Ejecución

> 🖼️ **Prototipo UI:** _pendiente_

| Campo | Valor |
|---|---|
| Versión | 1.0 |
| Fecha | 2026-05-06 |
| Sprint | Sprint 7 |
| Prioridad | Media |
| Estimación | 3 puntos |

---

## 1. Descripción

**Como** alumno, **quiero** poder resolver retos escritos en Java, **para** practicar el lenguaje que uso en módulos como Programación o Acceso a Datos.

---

## 2. Dependencias y paralelización

- **Requiere:** HU-16 — ejecución de código en tiempo real
- **Puede paralelizarse con:** HU-28 (Kotlin)
- **Nota:** El runner del worker (`worker/src/runners/java.py`) y el template inicial en el editor ya están implementados. Esta HU completa la integración extremo a extremo.

---

## 3. 🐳 Worker (Python / Docker)

El runner `JavaRunner` ya existe en `worker/src/runners/java.py` y está registrado en `runners/__init__.py`. Lo que falta:

### Imagen Docker del runner

Verificar que la imagen `code_judge_runner_java:latest` se construye correctamente:

```bash
make build-runners
make test-runner-java
```

Si la imagen no arranca o falla el test, revisar `runners/java/Dockerfile` (usa `eclipse-temurin:17-jdk`).

---

## 4. 🗃️ Backend (NestJS)

### Seed de lenguajes

`Java` ya está en el seed (`api/prisma/seeds/seedCatalogues.ts`). Verificar que al levantar el proyecto existe el registro en la tabla `Language`.

### Endpoint de ejecución

El endpoint `POST /api/execution/submit` ya recibe `language` como campo. Verificar que cuando `language = "java"` el payload llega correctamente al worker y el worker lo despacha al `JavaRunner`.

---

## 5. 🎨 Frontend (React)

### Formulario de creación de reto

En `src/challenges/create/components/steps/StepBasicInfo.tsx`, verificar que el selector de lenguaje incluye `Java` (viene de la API, debería aparecer automáticamente si está en la BD).

### Editor de solución

Ya implementado en `useChallengeSolver.tsx`:
- Template inicial Java generado automáticamente
- Monaco Editor recibe `language="java"` para syntax highlighting

Verificar que el Monaco resalta Java correctamente y que el código del template compila sin errores en el runner.

---

## 6. Criterios de aceptación ✅

- [ ] La imagen Docker `code_judge_runner_java:latest` se construye con `make build-runners`.
- [ ] `make test-runner-java` ejecuta `Hello from Java` sin errores.
- [ ] Al crear un reto se puede seleccionar Java como lenguaje.
- [ ] Al resolver un reto Java, el editor muestra el template inicial con sintaxis resaltada.
- [ ] La ejecución devuelve resultados correctos para tests básicos de entrada/salida.
- [ ] Un error de compilación (ej. sintaxis incorrecta) devuelve `runtime_error` con el mensaje de `javac`.
