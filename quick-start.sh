#!/bin/bash

# ==============================================================================
# Code Judge Platform - Script de Inicio Rápido
# ==============================================================================

set -e

# Colores
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Funciones auxiliares
print_step() {
    echo -e "${BLUE}[$(date +'%H:%M:%S')]${NC} $1"
}

print_success() {
    echo -e "${GREEN}✓${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}⚠${NC} $1"
}

print_error() {
    echo -e "${RED}✗${NC} $1"
}

# Banner
echo -e "${GREEN}"
cat << "EOF"
╔═══════════════════════════════════════════════════════╗
║                                                       ║
║     CODE JUDGE PLATFORM - QUICK START                ║
║                                                       ║
║     Plataforma de corrección automática de código    ║
║                                                       ║
╚═══════════════════════════════════════════════════════╝
EOF
echo -e "${NC}"

# ==============================================================================
# 1. Verificar prerrequisitos
# ==============================================================================
print_step "Verificando prerrequisitos..."

# Docker
if ! command -v docker &> /dev/null; then
    print_error "Docker no está instalado"
    echo "Instalar desde: https://docs.docker.com/get-docker/"
    exit 1
fi
print_success "Docker encontrado: $(docker --version)"

# Docker Compose
if ! command -v docker-compose &> /dev/null; then
    print_error "Docker Compose no está instalado"
    echo "Instalar desde: https://docs.docker.com/compose/install/"
    exit 1
fi
print_success "Docker Compose encontrado: $(docker-compose --version)"

# Python 3 (para testing local opcional)
if command -v python3 &> /dev/null; then
    print_success "Python 3 encontrado: $(python3 --version)"
else
    print_warning "Python 3 no encontrado (opcional, solo para testing local)"
fi

# Docker daemon
if ! docker info &> /dev/null; then
    print_error "Docker daemon no está corriendo"
    echo "Iniciar Docker daemon y volver a ejecutar este script"
    exit 1
fi
print_success "Docker daemon está corriendo"

echo ""

# ==============================================================================
# 2. Configurar variables de entorno
# ==============================================================================
print_step "Configurando variables de entorno..."

if [ ! -f .env ]; then
    print_warning "Archivo .env no encontrado, creando desde .env.example..."
    cp .env.example .env
    print_success "Archivo .env creado"
    print_warning "Revisa y ajusta las variables en .env según tu entorno"
else
    print_success "Archivo .env ya existe"
fi

echo ""

# ==============================================================================
# 3. Construir imágenes de runners
# ==============================================================================
print_step "Construyendo imágenes de runners..."

echo "  → Construyendo runner de JavaScript..."
docker build -t code_judge_runner_js:latest ./runners/javascript -q
print_success "Runner de JavaScript construido"

echo "  → Construyendo runner de Python..."
docker build -t code_judge_runner_python:latest ./runners/python -q
print_success "Runner de Python construido"

echo "  → Construyendo runner de Java..."
docker build -t code_judge_runner_java:latest ./runners/java -q
print_success "Runner de Java construido"

echo ""

# ==============================================================================
# 4. Construir servicios principales
# ==============================================================================
print_step "Construyendo servicios principales..."

docker-compose build --parallel
print_success "Servicios construidos"

echo ""

# ==============================================================================
# 5. Levantar servicios
# ==============================================================================
print_step "Levantando servicios..."

docker-compose up -d

# Esperar a que los servicios estén listos
print_step "Esperando a que los servicios estén listos..."
sleep 5

echo ""

# ==============================================================================
# 6. Verificar estado de servicios
# ==============================================================================
print_step "Verificando estado de servicios..."

services=("nginx" "frontend" "api" "worker" "redis" "mariadb" "mongodb")
all_healthy=true

for service in "${services[@]}"; do
    if docker-compose ps | grep -q "$service.*Up"; then
        print_success "$service está corriendo"
    else
        print_error "$service NO está corriendo"
        all_healthy=false
    fi
done

echo ""

# Verificar Worker específicamente (Python)
print_step "Verificando Worker Python..."
sleep 3  # Dar tiempo al Worker para iniciar

if curl -sf http://localhost:4000/health &> /dev/null; then
    print_success "Worker Python responde en puerto 4000"
    
    # Mostrar versión de Python y Docker SDK
    worker_info=$(docker-compose exec -T worker python3 --version 2>&1)
    print_success "Worker usando: $worker_info"
    
    docker_sdk_version=$(docker-compose exec -T worker pip show docker 2>/dev/null | grep Version || echo "Docker SDK instalado")
    print_success "Docker SDK: $docker_sdk_version"
else
    print_warning "Worker no responde aún (puede tardar unos segundos más)"
fi

# Verificar MariaDB
print_step "Verificando MariaDB..."
if docker-compose exec -T mariadb mysqladmin ping -h localhost &> /dev/null; then
    print_success "MariaDB está listo"
    mariadb_version=$(docker-compose exec -T mariadb mysql --version 2>&1 | head -1)
    print_success "$mariadb_version"
else
    print_warning "MariaDB no responde aún"
fi

# Verificar MongoDB
print_step "Verificando MongoDB..."
if docker-compose exec -T mongodb mongosh --quiet --eval "db.adminCommand('ping')" &> /dev/null; then
    print_success "MongoDB está listo"
else
    print_warning "MongoDB no responde aún"
fi

echo ""

# ==============================================================================
# 7. Test de runners
# ==============================================================================
print_step "Probando runners..."

# Test JavaScript
echo "  → Probando runner de JavaScript..."
if echo 'console.log("Hello from JS");' | docker run --rm -i --network none --memory="128m" --cpus="0.5" code_judge_runner_js:latest 2>/dev/null | grep -q "Hello from JS"; then
    print_success "Runner de JavaScript funciona correctamente"
else
    print_warning "Runner de JavaScript puede tener problemas"
fi

# Test Python
echo "  → Probando runner de Python..."
if echo 'print("Hello from Python")' | docker run --rm -i --network none --memory="128m" --cpus="0.5" code_judge_runner_python:latest 2>/dev/null | grep -q "Hello from Python"; then
    print_success "Runner de Python funciona correctamente"
else
    print_warning "Runner de Python puede tener problemas"
fi

# Test Java
echo "  → Probando runner de Java..."
mkdir -p /tmp/java-quickstart-test
echo 'public class Main { public static void main(String[] args) { System.out.println("Hello from Java"); } }' > /tmp/java-quickstart-test/Main.java
if docker run --rm -v /tmp/java-quickstart-test:/code:ro --network none --memory="256m" --cpus="0.5" code_judge_runner_java:latest 2>/dev/null | grep -q "Hello from Java"; then
    print_success "Runner de Java funciona correctamente"
else
    print_warning "Runner de Java puede tener problemas"
fi
rm -rf /tmp/java-quickstart-test

echo ""

# Test Worker Python (ejecución completa)
print_step "Probando Worker Python con ejecución real..."
sleep 2  # Asegurar que Worker está listo

test_response=$(curl -sf -X POST http://localhost:4000/execute \
    -H "Content-Type: application/json" \
    -d '{"language":"python","code":"print(\"Test from Worker\")","test_cases":[{"expected_output":"Test from Worker"}]}' 2>/dev/null)

if [ $? -eq 0 ]; then
    print_success "Worker Python ejecutó código correctamente"
    # Verificar que el test pasó
    if echo "$test_response" | grep -q '"success": true'; then
        print_success "Test case validado exitosamente"
    fi
else
    print_warning "Worker no pudo ejecutar el test (puede estar iniciando)"
fi

echo ""

# ==============================================================================
# 8. Test de aislamiento de red
# ==============================================================================
print_step "Verificando aislamiento de red..."

if docker run --rm --network none alpine ping -c 1 google.com 2>&1 | grep -q "Network is unreachable"; then
    print_success "Aislamiento de red funciona correctamente"
else
    print_warning "Aislamiento de red puede tener problemas"
fi

echo ""

# ==============================================================================
# 9. Información final
# ==============================================================================
print_step "¡Todo listo! 🎉"
echo ""
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"
echo -e "${GREEN}  Servicios disponibles:${NC}"
echo -e "  ${BLUE}→${NC} Frontend:  ${YELLOW}http://localhost${NC} (dev: :3001)"
echo -e "  ${BLUE}→${NC} API:       ${YELLOW}http://localhost/api${NC} (dev: :3000)"
echo -e "  ${BLUE}→${NC} Worker:    ${YELLOW}http://localhost:4000${NC}"
echo -e "  ${BLUE}→${NC} Health:    ${YELLOW}http://localhost/health${NC}"
echo ""
echo -e "${GREEN}  Bases de datos:${NC}"
echo -e "  ${BLUE}→${NC} MariaDB:   ${YELLOW}localhost:3306${NC}"
echo -e "  ${BLUE}→${NC} MongoDB:   ${YELLOW}localhost:27017${NC}"
echo -e "  ${BLUE}→${NC} Redis:     ${YELLOW}localhost:6379${NC}"
echo ""
echo -e "${GREEN}  Tecnologías:${NC}"
echo -e "  ${BLUE}→${NC} Worker:    ${YELLOW}Python 3.11 con Docker SDK (hot-reload)${NC}"
echo -e "  ${BLUE}→${NC} API:       ${YELLOW}NestJS con Yarn (hot-reload)${NC}"
echo -e "  ${BLUE}→${NC} Frontend:  ${YELLOW}React/Vue/Angular (hot-reload)${NC}"
echo -e "  ${BLUE}→${NC} Runners:   ${YELLOW}JS (Node 20), Python (3.11), Java (17)${NC}"
echo ""
echo -e "${GREEN}  Comandos útiles:${NC}"
echo -e "  ${BLUE}→${NC} Ver logs:           ${YELLOW}make logs${NC}"
echo -e "  ${BLUE}→${NC} Logs del Worker:    ${YELLOW}make logs-worker${NC}"
echo -e "  ${BLUE}→${NC} Logs de la API:     ${YELLOW}make logs-api${NC}"
echo -e "  ${BLUE}→${NC} Probar Worker:      ${YELLOW}make test-worker${NC}"
echo -e "  ${BLUE}→${NC} Shell MariaDB:      ${YELLOW}make shell-db${NC}"
echo -e "  ${BLUE}→${NC} Shell MongoDB:      ${YELLOW}make shell-mongo${NC}"
echo -e "  ${BLUE}→${NC} Instalar deps:      ${YELLOW}make install-all${NC}"
echo -e "  ${BLUE}→${NC} Detener servicios:  ${YELLOW}make down${NC}"
echo -e "  ${BLUE}→${NC} Reiniciar:          ${YELLOW}make restart${NC}"
echo -e "  ${BLUE}→${NC} Ayuda completa:     ${YELLOW}make help${NC}"
echo ""
echo -e "${GREEN}  Documentación:${NC}"
echo -e "  ${BLUE}→${NC} README:             ${YELLOW}README.md${NC}"
echo -e "  ${BLUE}→${NC} Flujo de datos:     ${YELLOW}FLOW_EXPLAINED.md${NC} ⭐ IMPORTANTE"
echo -e "  ${BLUE}→${NC} Worker Python:      ${YELLOW}WORKER_PYTHON_GUIDE.md${NC}"
echo -e "  ${BLUE}→${NC} Docs técnicas:      ${YELLOW}TECHNICAL_DOCS.md${NC}"
echo -e "  ${BLUE}→${NC} Comandos rápidos:   ${YELLOW}QUICKREF.md${NC}"
echo ""
echo -e "${GREEN}  Modo Desarrollo:${NC}"
echo -e "  ${BLUE}→${NC} Hot-reload activado en API, Frontend y Worker"
echo -e "  ${BLUE}→${NC} Logs visibles en tiempo real"
echo -e "  ${BLUE}→${NC} Puertos expuestos para debugging"
echo -e "${GREEN}═══════════════════════════════════════════════════════${NC}"

if [ "$all_healthy" = false ]; then
    echo ""
    print_warning "Algunos servicios tienen problemas. Revisa los logs con: make logs"
fi

echo ""
print_step "Para entender cómo funciona el sistema:"
echo -e "  ${YELLOW}1.${NC} Lee ${BLUE}FLOW_EXPLAINED.md${NC} - Explica cómo llega el código a los runners"
echo -e "  ${YELLOW}2.${NC} Revisa ${BLUE}worker/src/main.py${NC} - Worker en Python con comentarios"
echo -e "  ${YELLOW}3.${NC} Ejecuta ${BLUE}make test-worker${NC} - Prueba el Worker directamente"
echo ""
print_step "Para desarrollo:"
echo -e "  ${YELLOW}•${NC} Los cambios en código se reflejan automáticamente (hot-reload)"
echo -e "  ${YELLOW}•${NC} Usa ${BLUE}make logs-api${NC} o ${BLUE}make logs-worker${NC} para ver logs"
echo -e "  ${YELLOW}•${NC} Ejecuta ${BLUE}make install-all${NC} si añades dependencias"
echo ""
print_step "Para ver los logs en tiempo real: ${YELLOW}make logs${NC}"