#!/bin/bash

# ==============================================================================
# RaiseCode - Script de Despliegue Automático para Ubuntu (Docker Desktop)
# Uso: bash deploy.sh
# ==============================================================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m'

REPO_URL="https://github.com/GsuDev/RaiseCode.git"
REPO_DIR="RaiseCode"

print_step()    { echo -e "\n${BLUE}▶ $1${NC}"; }
print_success() { echo -e "  ${GREEN}✓${NC} $1"; }
print_warning() { echo -e "  ${YELLOW}⚠${NC} $1"; }
print_error()   { echo -e "  ${RED}✗${NC} $1"; }

echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║        RAISECODE - DESPLIEGUE AUTOMÁTICO              ║
║        Plataforma de corrección de código             ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ==============================================================================
# PASO 1 — Verificar prerequisitos
# ==============================================================================
print_step "Verificando prerequisitos..."

# Instalar utilidades básicas si faltan
sudo apt-get update -qq
sudo apt-get install -y -qq git make curl openssl
print_success "Utilidades del sistema listas"

# Docker Desktop debe estar corriendo
if ! docker info &>/dev/null; then
    print_error "Docker Desktop no está corriendo."
    echo "  Ábrelo desde el menú de aplicaciones y vuelve a ejecutar este script."
    exit 1
fi
print_success "Docker Desktop activo: $(docker --version)"

# ==============================================================================
# PASO 2 — Clonar o actualizar el repositorio
# ==============================================================================
print_step "Obteniendo el repositorio..."

if [ -f "Makefile" ] && [ -f "docker-compose.prod.yml" ]; then
    REPO_DIR="."
    print_success "Repositorio disponible en directorio actual"
    git pull --ff-only 2>/dev/null && print_success "Repositorio actualizado" \
        || print_warning "No se pudo actualizar (puede haber cambios locales)"
elif [ -d "$REPO_DIR/.git" ]; then
    cd "$REPO_DIR"
    git pull --ff-only
    print_success "Repositorio actualizado en ./$REPO_DIR"
else
    git clone "$REPO_URL" "$REPO_DIR"
    cd "$REPO_DIR"
    print_success "Repositorio clonado en ./$REPO_DIR"
fi

# ==============================================================================
# PASO 3 — Configurar variables de entorno
# ==============================================================================
print_step "Configurando variables de entorno..."

if [ ! -f .env ]; then
    cp .env.example .env

    JWT_SECRET_VAL=$(openssl rand -hex 32)
    WORKER_SECRET_VAL=$(openssl rand -hex 32)

    sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET_VAL}|" .env
    sed -i "s|WORKER_SECRET=.*|WORKER_SECRET=${WORKER_SECRET_VAL}|" .env

    print_success "Archivo .env creado con secretos generados automáticamente"
else
    print_success "Archivo .env ya existe"
fi

# ==============================================================================
# PASO 4 — Generar certificados SSL
# ==============================================================================
print_step "Generando certificados SSL..."

if [ ! -f nginx/certs/cert.pem ] || [ ! -f nginx/certs/key.pem ]; then
    mkdir -p nginx/certs
    openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout nginx/certs/key.pem \
        -out nginx/certs/cert.pem \
        -subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" \
        -addext "subjectAltName=DNS:localhost,IP:127.0.0.1" \
        2>/dev/null
    print_success "Certificados SSL generados"
else
    print_success "Certificados SSL ya existen"
fi

# ==============================================================================
# PASO 5 — Construir imágenes de runners
# ==============================================================================
print_step "Construyendo runners de ejecución de código..."

docker build -t raisecode_runner_js:latest ./runners/javascript -q
print_success "Runner JavaScript"

docker build -t raisecode_runner_python:latest ./runners/python -q
print_success "Runner Python"

docker build -t raisecode_runner_java:latest ./runners/java -q
print_success "Runner Java"

# ==============================================================================
# PASO 6 — Desplegar producción
# ==============================================================================
print_step "Desplegando stack de producción..."

make prod

# ==============================================================================
# PASO 7 — Verificar
# ==============================================================================
print_step "Esperando a que los servicios estén listos..."

TIMEOUT=120
ELAPSED=0
INTERVAL=5

while [ $ELAPSED -lt $TIMEOUT ]; do
    HEALTHY=$(docker compose -f docker-compose.prod.yml ps --format json 2>/dev/null \
        | grep -c '"Health":"healthy"' 2>/dev/null || echo 0)
    [ "$HEALTHY" -ge 4 ] && break
    printf "  Esperando healthchecks... %ds\r" "$ELAPSED"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""
print_step "Estado de los servicios:"
docker compose -f docker-compose.prod.yml ps

echo ""
print_step "Verificando endpoints..."
sleep 5

if curl -sfk "https://localhost/health" -o /dev/null 2>/dev/null; then
    print_success "Nginx responde correctamente"
else
    print_warning "Nginx aún no responde (puede necesitar unos segundos más)"
fi

if curl -sfk "https://localhost/api/health" -o /dev/null 2>/dev/null; then
    print_success "API responde correctamente"
else
    print_warning "API aún no responde (puede estar migrando la base de datos)"
fi

# ==============================================================================
# INFORMACIÓN FINAL
# ==============================================================================
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  ¡Despliegue completado!${NC}"
echo ""
echo -e "  ${BLUE}→${NC} Web:     ${YELLOW}https://localhost${NC}"
echo -e "  ${BLUE}→${NC} API:     ${YELLOW}https://localhost/api${NC}"
echo -e "  ${BLUE}→${NC} Health:  ${YELLOW}http://localhost/health${NC}"
echo ""
echo -e "${YELLOW}  NOTA: El certificado SSL es autofirmado.${NC}"
echo -e "${YELLOW}  En el navegador, acepta la advertencia de seguridad${NC}"
echo -e "${YELLOW}  (Avanzado → Continuar de todas formas).${NC}"
echo ""
echo -e "${GREEN}  Comandos útiles (desde el directorio RaiseCode):${NC}"
echo -e "  ${BLUE}→${NC} Ver logs:          ${YELLOW}make prod-logs${NC}"
echo -e "  ${BLUE}→${NC} Parar todo:        ${YELLOW}make prod-down${NC}"
echo -e "  ${BLUE}→${NC} Estado servicios:  ${YELLOW}make health${NC}"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo ""
