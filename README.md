# RaiseCode
Una aplicación web educativa para la realización de retos de programación.

## Requisitos

- [Docker Desktop](https://www.docker.com/products/docker-desktop/) (incluye Docker Compose)
- Git

## Inicio rápido

```bash
# 1. Clonar el repositorio
git clone https://github.com/GsuDev/RaiseCode.git
cd RaiseCode

# 2. Copiar el archivo de variables de entorno
cp .env.example .env

# 3. Generar los certificados SSL (ver sección de abajo)

# 4. Levantar los servicios
make up        # Linux / Mac
# o en Windows (PowerShell): docker-compose up -d
```

La aplicación estará disponible en **https://localhost**

> El navegador mostrará una advertencia de certificado autofirmado al entrar por primera vez. Es normal en desarrollo — pulsa "Avanzado" → "Continuar".

---

## Certificados SSL

El proyecto usa HTTPS. Antes de levantar los servicios por primera vez hay que generar un certificado SSL autofirmado para `localhost`.

> **Importante:** Para que la ejecución de retos funcione (WebSocket `wss://`), el certificado tiene que ser de confianza en el sistema. En macOS ejecuta `make trust-cert` después de generarlo. Sin este paso el navegador bloqueará la conexión WebSocket.

### Linux / Mac

```bash
make ssl-certs
make trust-cert   # necesario para WebSocket (wss://)
```

### Windows (PowerShell)

```powershell
.\nginx\certs\generate-certs.ps1
```

### Cualquier sistema (vía Docker)

Si no tienes `openssl` instalado o prefieres no usar Make:

```bash
# Linux / Mac
make ssl-certs-docker

# Windows (PowerShell)
docker run --rm -v "${PWD}/nginx/certs:/certs" alpine/openssl `
  req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout /certs/key.pem -out /certs/cert.pem `
  -subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
```

> Los archivos `cert.pem` y `key.pem` se generan en `nginx/certs/` y están en `.gitignore` — no se suben al repositorio.

---

## Comandos útiles (Makefile)

> En Windows usa directamente los comandos `docker-compose` equivalentes.

| Comando | Descripción |
|---------|-------------|
| `make up` | Levantar todos los servicios (genera certs automáticamente si faltan) |
| `make down` | Detener y eliminar contenedores |
| `make logs` | Ver logs en tiempo real |
| `make logs-nginx` | Logs de Nginx |
| `make health` | Verificar salud de los servicios |
| `make ssl-certs` | Generar certificado SSL (Linux/Mac) |
| `make trust-cert` | Agregar el cert al keychain de macOS (necesario para WebSocket) |
| `make ssl-certs-docker` | Generar certificado SSL vía Docker (todos los SO) |
| `make clean` | Limpiar contenedores y volúmenes |

## Servicios

| Servicio | URL |
|----------|-----|
| Aplicación web | https://localhost |
| API | https://localhost/api |
| API (directo) | http://localhost:3000 |
| Worker | http://localhost:4000 |

---

## Solución de problemas

### La ejecución de retos no funciona (WebSocket bloqueado)

**Síntoma:** Al pulsar "Ejecutar" no aparecen resultados. En la consola del navegador se ve algo como:

```
WebSocket connection to 'wss://localhost/socket.io/...' failed: The certificate is invalid
```
o
```
[blocked] The page requested insecure content from ws://localhost...
```

**Causa:** El WebSocket usa `wss://` (WebSocket seguro) a través de nginx. Los navegadores, especialmente Safari, rechazan conexiones `wss://` con certificados autofirmados que no estén en el keychain del sistema. Aceptar la advertencia en el navegador solo sirve para la página HTTPS, no para WebSocket.

**Fix en macOS:**

```bash
make trust-cert
```

Pide contraseña de administrador. Después reinicia el navegador completamente. El certificado queda como confiable a nivel de sistema y `wss://` funciona sin advertencias.

**Fix en Linux:** Añadir el cert al almacén de confianza del sistema:

```bash
sudo cp nginx/certs/cert.pem /usr/local/share/ca-certificates/raisecode-dev.crt
sudo update-ca-certificates
```

**Fix en Windows:** Doble clic en `nginx/certs/cert.pem` → Instalar certificado → Almacén "Entidades de certificación raíz de confianza".
