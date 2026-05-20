# RaiseCode

Plataforma educativa para la práctica de retos de programación con corrección automática en tiempo real.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- Git

---

## Entorno de desarrollo

### Mac / Linux

```bash
# 1. Clonar el repositorio
git clone https://github.com/GsuDev/RaiseCode.git
cd RaiseCode

# 2. Copiar variables de entorno
cp .env.example .env

# 3. Generar certificado SSL
make ssl-certs

# 4. (Recomendado) Hacer el certificado de confianza en el sistema
#    Sin este paso el WebSocket (wss://) no funciona en el navegador
make trust-cert        # macOS — pide contraseña de administrador

# En Linux:
sudo cp nginx/certs/cert.pem /usr/local/share/ca-certificates/raisecode.crt
sudo update-ca-certificates

# 5. Levantar los servicios
make up
```

La aplicación estará disponible en **https://localhost**

---

### Windows (PowerShell como administrador)

```powershell
# 1. Clonar el repositorio
git clone https://github.com/GsuDev/RaiseCode.git
cd RaiseCode

# 2. Copiar variables de entorno
Copy-Item .env.example .env

# 3. Generar certificado SSL
.\nginx\certs\generate-certs.ps1

# 4. Instalar el certificado como de confianza (necesario para WebSocket)
#    Opcion A — automatica (PowerShell como administrador):
Import-Certificate -FilePath "nginx\certs\cert.pem" -CertStoreLocation Cert:\LocalMachine\Root

#    Opcion B — manual:
#    Doble clic en nginx\certs\cert.pem > Instalar certificado >
#    Maquina local > Entidades de certificacion raiz de confianza > Finalizar
#    Reiniciar el navegador despues.

# 5. Levantar los servicios
docker compose up -d
```

La aplicación estará disponible en **https://localhost**

---

## Base de datos — Seed inicial

> El seed requiere que las migraciones ya estén aplicadas (las tablas deben existir).

```bash
# 1. Aplicar migraciones (crea las tablas):
docker exec code_judge_api yarn prisma migrate deploy

# 2. Poblar datos de ejemplo (opción recomendada — incluye Kotlin y logros):
docker exec code_judge_api yarn prisma db seed

# Alternativa con SQL directo:
docker exec -i code_judge_mariadb mysql -uroot -proot raisecode < seed.sql
```

---

### Comandos de desarrollo (Mac / Linux)

| Comando | Descripción |
|---------|-------------|
| `make up` | Levantar todos los servicios (genera certs si faltan) |
| `make down` | Detener y eliminar contenedores |
| `make logs` | Ver logs en tiempo real de todos los servicios |
| `make logs-api` | Logs solo del backend |
| `make logs-worker` | Logs solo del worker |
| `make health` | Verificar salud de todos los servicios |
| `make ssl-certs` | Generar certificado SSL (Linux/Mac con openssl) |
| `make ssl-certs-docker` | Generar certificado SSL vía Docker (cualquier SO) |
| `make trust-cert` | Añadir el cert al keychain de macOS |
| `make build-runners` | Construir imágenes de runners (JS, Python, Java) |
| `make clean` | Eliminar contenedores y volúmenes |

### Windows — comandos equivalentes

```powershell
docker compose up -d          # make up
docker compose down           # make down
docker compose logs -f        # make logs
docker compose logs -f api    # make logs-api
docker compose ps             # estado de los servicios
docker compose down -v        # make clean
```

---

## Entorno de producción

> El entorno de producción usa `docker-compose.prod.yml`. Las diferencias principales respecto a dev:
> - El frontend se sirve como build estático (no Vite dev server)
> - Solo nginx expone puertos al host (80 y 443); las BBDDs y servicios internos no son accesibles desde fuera
> - El backend arranca con `node dist/src/main` (sin nodemon)
> - No hay hot-reload ni bind mounts de código fuente

### Mac / Linux

```bash
# 1. Clonar y configurar
git clone https://github.com/GsuDev/RaiseCode.git
cd RaiseCode
cp .env.example .env
# Editar .env con credenciales reales (no usar los valores de dev)

# 2. Generar certificado SSL
#    En un servidor real: usar Let's Encrypt (certbot) y copiar los .pem a nginx/certs/
#    Para pruebas locales:
make ssl-certs

# 3. Construir y levantar
make prod

# 4. Aplicar migraciones y seed
docker exec raisecode_api yarn prisma migrate deploy
docker exec -i raisecode_mariadb mysql -uroot -p<DB_PASSWORD> raisecode < seed.sql
```

### Windows (PowerShell como administrador)

```powershell
# 1. Clonar y configurar
git clone https://github.com/GsuDev/RaiseCode.git
cd RaiseCode
Copy-Item .env.example .env
# Editar .env con credenciales reales

# 2. Generar certificado SSL
.\nginx\certs\generate-certs.ps1

# 3. Construir y levantar
docker compose -f docker-compose.prod.yml up --build -d

# 4. Aplicar migraciones y seed
docker exec raisecode_api yarn prisma migrate deploy
Get-Content seed.sql | docker exec -i raisecode_mariadb mysql -uroot -p<DB_PASSWORD> raisecode
```

### Comandos de producción (Mac / Linux)

| Comando | Descripción |
|---------|-------------|
| `make prod` | Construir y levantar el stack de producción |
| `make prod-down` | Parar y eliminar contenedores de producción |
| `make prod-logs` | Ver logs del stack de producción |
| `make prod-build` | Solo construir las imágenes sin levantar |

---

## URLs de los servicios

| Servicio | Dev | Prod |
|----------|-----|------|
| Aplicación web | https://localhost | https://localhost |
| API | https://localhost/api | https://localhost/api |
| API (directo, solo dev) | http://localhost:3000 | — |
| Worker (solo dev) | http://localhost:4000 | — |
| Health check | https://localhost/health | https://localhost/health |

---

## Solución de problemas

### El WebSocket no funciona (ejecución de retos se queda colgada)

**Síntoma:** Al pulsar "Ejecutar" no aparecen resultados. En la consola del navegador:
```
WebSocket connection to 'wss://localhost/socket.io/...' failed
```

**Causa:** El certificado autofirmado no está instalado como de confianza en el sistema. Aceptar la advertencia en el navegador no es suficiente para WebSocket.

**Fix en macOS:**
```bash
make trust-cert
# Reiniciar el navegador completamente
```

**Fix en Linux:**
```bash
sudo cp nginx/certs/cert.pem /usr/local/share/ca-certificates/raisecode.crt
sudo update-ca-certificates
# Reiniciar el navegador completamente
```

**Fix en Windows (PowerShell como administrador):**
```powershell
Import-Certificate -FilePath "nginx\certs\cert.pem" -CertStoreLocation Cert:\LocalMachine\Root
# Reiniciar el navegador completamente
```

---

### Los certificados SSL no existen

```bash
# Mac / Linux
make ssl-certs          # requiere openssl instalado
# o con Docker (cualquier SO):
make ssl-certs-docker

# Windows
.\nginx\certs\generate-certs.ps1
```

---

### La base de datos está vacía después de levantar

Hay que aplicar el seed manualmente (ver sección [Base de datos — Seed inicial](#base-de-datos--seed-inicial)).
