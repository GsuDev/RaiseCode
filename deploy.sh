#!/bin/bash

# ==============================================================================
# RaiseCode - Script de Despliegue Automático para Ubuntu
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
# PASO 1 — Instalar Docker y dependencias
# ==============================================================================
print_step "Instalando dependencias del sistema..."

sudo apt-get update -qq

# Instalar dependencias base
sudo apt-get install -y -qq \
    git make curl ca-certificates gnupg lsb-release openssl

print_success "Dependencias base instaladas"

# Instalar Docker si no está presente
if ! command -v docker &> /dev/null; then
    print_step "Instalando Docker Engine..."

    # Añadir clave GPG oficial de Docker
    sudo install -m 0755 -d /etc/apt/keyrings
    curl -fsSL https://download.docker.com/linux/ubuntu/gpg \
        | sudo gpg --dearmor -o /etc/apt/keyrings/docker.gpg
    sudo chmod a+r /etc/apt/keyrings/docker.gpg

    # Añadir repositorio de Docker
    echo \
        "deb [arch=$(dpkg --print-architecture) signed-by=/etc/apt/keyrings/docker.gpg] \
        https://download.docker.com/linux/ubuntu \
        $(lsb_release -cs) stable" \
        | sudo tee /etc/apt/sources.list.d/docker.list > /dev/null

    sudo apt-get update -qq
    sudo apt-get install -y -qq \
        docker-ce docker-ce-cli containerd.io docker-buildx-plugin docker-compose-plugin

    print_success "Docker instalado: $(docker --version)"
else
    print_success "Docker ya instalado: $(docker --version)"
fi

# Asegurar que Docker está arrancado (solo si systemd gestiona el servicio)
if systemctl list-unit-files docker.service &>/dev/null 2>&1; then
    sudo systemctl enable docker --quiet
    sudo systemctl start docker
fi

# Añadir usuario actual al grupo docker
if ! groups "$USER" | grep -q docker; then
    sudo usermod -aG docker "$USER"
    print_warning "Usuario añadido al grupo 'docker'."
    print_warning "Para esta sesión se usará 'sg docker' para ejecutar comandos sin sudo."
    DOCKER_CMD="sg docker -c"
else
    DOCKER_CMD="bash -c"
    print_success "Usuario ya en grupo 'docker'"
fi

# ==============================================================================
# PASO 2 — Clonar o actualizar el repositorio
# ==============================================================================
print_step "Obteniendo el repositorio..."

# Si el script se ejecutó con pipe desde curl, el directorio no existe todavía
# Si se ejecutó desde dentro del repo clonado, usar el directorio actual
if [ -f "Makefile" ] && [ -f "docker-compose.prod.yml" ]; then
    # Ya estamos dentro del repo
    REPO_DIR="."
    print_success "Repositorio ya disponible en directorio actual"
    git pull --ff-only 2>/dev/null && print_success "Repositorio actualizado" || print_warning "No se pudo actualizar (puede haber cambios locales)"
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

    # Detectar IP de la VDI (primera IP no-loopback)
    VDI_IP=$(hostname -I | awk '{print $1}')

    # Generar secretos seguros
    JWT_SECRET_VAL=$(openssl rand -hex 32)
    WORKER_SECRET_VAL=$(openssl rand -hex 32)

    # Sustituir valores en .env
    sed -i "s|JWT_SECRET=.*|JWT_SECRET=${JWT_SECRET_VAL}|" .env
    sed -i "s|WORKER_SECRET=.*|WORKER_SECRET=${WORKER_SECRET_VAL}|" .env
    sed -i "s|FRONTEND_API_URL=.*|FRONTEND_API_URL=https://${VDI_IP}/api|" .env

    print_success "Archivo .env creado con secretos generados automáticamente"
    print_success "IP de la VDI detectada: ${VDI_IP}"
else
    VDI_IP=$(grep FRONTEND_API_URL .env | grep -oP '(?<=https://)[\d.]+' | head -1)
    [ -z "$VDI_IP" ] && VDI_IP=$(hostname -I | awk '{print $1}')
    print_success "Archivo .env ya existe"
fi

# ==============================================================================
# PASO 4 — Generar certificados SSL
# ==============================================================================
print_step "Generando certificados SSL..."

VDI_IP_CERT=$(hostname -I | awk '{print $1}')

if [ ! -f nginx/certs/cert.pem ] || [ ! -f nginx/certs/key.pem ]; then
    mkdir -p nginx/certs
    $DOCKER_CMD "docker run --rm \
        -v \"$(pwd)/nginx/certs:/certs\" \
        alpine/openssl \
        req -x509 -nodes -days 365 -newkey rsa:2048 \
        -keyout /certs/key.pem \
        -out /certs/cert.pem \
        -subj \"/C=ES/ST=Local/L=Local/O=RaiseCode/CN=${VDI_IP_CERT}\" \
        -addext \"subjectAltName=DNS:localhost,IP:127.0.0.1,IP:${VDI_IP_CERT}\""
    print_success "Certificados SSL generados para IP ${VDI_IP_CERT}"
else
    print_success "Certificados SSL ya existen"
fi

# ==============================================================================
# PASO 5 — Construir imágenes de runners
# ==============================================================================
print_step "Construyendo runners de ejecución de código..."

$DOCKER_CMD "
    docker build -t raisecode_runner_js:latest ./runners/javascript -q && echo '  ✓ Runner JavaScript'
    docker build -t raisecode_runner_python:latest ./runners/python -q && echo '  ✓ Runner Python'
    docker build -t raisecode_runner_java:latest ./runners/java -q && echo '  ✓ Runner Java'
"

# ==============================================================================
# PASO 6 — Desplegar producción
# ==============================================================================
print_step "Desplegando stack de producción..."

$DOCKER_CMD "docker compose -f docker-compose.prod.yml up --build -d"

print_success "Stack de producción iniciado"

# ==============================================================================
# PASO 7 — Esperar y verificar
# ==============================================================================
print_step "Esperando a que los servicios estén listos..."

TIMEOUT=120
ELAPSED=0
INTERVAL=5

while [ $ELAPSED -lt $TIMEOUT ]; do
    HEALTHY=$($DOCKER_CMD "docker compose -f docker-compose.prod.yml ps --format json 2>/dev/null" \
        | grep -c '"Health":"healthy"' 2>/dev/null || echo 0)

    if [ "$HEALTHY" -ge 4 ] 2>/dev/null; then
        break
    fi

    printf "  Esperando healthchecks... %ds\r" "$ELAPSED"
    sleep $INTERVAL
    ELAPSED=$((ELAPSED + INTERVAL))
done

echo ""

# Verificar servicios activos
print_step "Estado de los servicios:"
$DOCKER_CMD "docker compose -f docker-compose.prod.yml ps"

# Verificación HTTP
echo ""
print_step "Verificando endpoints..."

FINAL_IP=$(hostname -I | awk '{print $1}')

sleep 5
if curl -sfk "https://${FINAL_IP}/health" -o /dev/null 2>/dev/null; then
    print_success "Nginx responde correctamente"
else
    print_warning "Nginx aún no responde (puede necesitar unos segundos más)"
fi

if curl -sfk "https://${FINAL_IP}/api/health" -o /dev/null 2>/dev/null; then
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
echo -e "  ${BLUE}→${NC} Web:     ${YELLOW}https://${FINAL_IP}${NC}"
echo -e "  ${BLUE}→${NC} API:     ${YELLOW}https://${FINAL_IP}/api${NC}"
echo -e "  ${BLUE}→${NC} Health:  ${YELLOW}http://${FINAL_IP}/health${NC}"
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

if groups "$USER" | grep -qv docker 2>/dev/null; then
    echo -e "${YELLOW}IMPORTANTE: Cierra la sesión SSH y vuelve a conectarte para que${NC}"
    echo -e "${YELLOW}los comandos 'docker' funcionen sin 'sudo'.${NC}"
    echo ""
fi
