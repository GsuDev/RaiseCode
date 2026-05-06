.PHONY: help build up down restart logs clean build-runners test-runner

# Colores para output
GREEN  := \033[0;32m
YELLOW := \033[0;33m
NC     := \033[0m

help: ## Muestra esta ayuda
	@echo "$(GREEN)Code Judge Platform - Comandos disponibles:$(NC)"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | sort | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(YELLOW)%-20s$(NC) %s\n", $$1, $$2}'

# ==============================================================================
# CONSTRUCCIÓN Y DESPLIEGUE
# ==============================================================================

build: ## Construir todas las imágenes (servicios + runners)
	@echo "$(GREEN)Construyendo servicios principales...$(NC)"
	docker-compose build
	@echo "$(GREEN)Construyendo runners...$(NC)"
	$(MAKE) build-runners

build-runners: ## Construir solo las imágenes de los runners
	@echo "$(GREEN)Construyendo runner de JavaScript...$(NC)"
	docker build -t code_judge_runner_js:latest ./runners/javascript
	@echo "$(GREEN)Construyendo runner de Python...$(NC)"
	docker build -t code_judge_runner_python:latest ./runners/python
	@echo "$(GREEN)Construyendo runner de Java...$(NC)"
	docker build -t code_judge_runner_java:latest ./runners/java
	@echo "$(GREEN)✓ Runners construidos exitosamente$(NC)"

up: ## Levantar todos los servicios
	@echo "$(GREEN)Iniciando servicios...$(NC)"
	@if [ ! -f nginx/certs/cert.pem ] || [ ! -f nginx/certs/key.pem ]; then \
		echo "$(YELLOW)⚠ Certificados SSL no encontrados. Generando...$(NC)"; \
		$(MAKE) ssl-certs-docker; \
	fi
	docker-compose up -d
	@echo "$(GREEN)✓ Servicios iniciados$(NC)"
	@echo "$(YELLOW)Frontend: https://localhost$(NC)"
	@echo "$(YELLOW)API: https://localhost/api$(NC)"

down: ## Detener todos los servicios
	@echo "$(YELLOW)Deteniendo servicios...$(NC)"
	docker-compose down

restart: ## Reiniciar todos los servicios
	@echo "$(YELLOW)Reiniciando servicios...$(NC)"
	docker-compose restart

stop: ## Detener servicios sin eliminar contenedores
	docker-compose stop

start: ## Iniciar servicios previamente detenidos
	docker-compose start

# ==============================================================================
# LOGS Y MONITOREO
# ==============================================================================

logs: ## Ver logs de todos los servicios
	docker-compose logs -f

logs-api: ## Ver logs del API
	docker-compose logs -f api

logs-worker: ## Ver logs del Worker
	docker-compose logs -f worker

logs-worker-tail: ## Ver últimas 100 líneas de logs del Worker
	docker-compose logs --tail=100 worker

logs-nginx: ## Ver logs de Nginx
	docker-compose logs -f nginx

# ==============================================================================
# TESTING DE RUNNERS
# ==============================================================================

test-runner-js: ## Probar el runner de JavaScript
	@echo "$(GREEN)Probando runner de JavaScript...$(NC)"
	@echo 'console.log("Hola desde JavaScript");' | docker run --rm -i --network none --memory="128m" --cpus="0.5" code_judge_runner_js:latest

test-runner-python: ## Probar el runner de Python
	@echo "$(GREEN)Probando runner de Python...$(NC)"
	@echo 'print("Hola desde Python")' | docker run --rm -i --network none --memory="128m" --cpus="0.5" code_judge_runner_python:latest

test-runner-java: ## Probar el runner de Java (requiere archivo Main.java)
	@echo "$(GREEN)Probando runner de Java...$(NC)"
	@echo "Creando archivo temporal..."
	@mkdir -p /tmp/java-test
	@echo 'public class Main { public static void main(String[] args) { System.out.println("Hola desde Java"); } }' > /tmp/java-test/Main.java
	@docker run --rm -v /tmp/java-test:/code:ro --network none --memory="256m" --cpus="0.5" code_judge_runner_java:latest
	@rm -rf /tmp/java-test

test-runners: test-runner-js test-runner-python test-runner-java ## Probar todos los runners

test-worker: ## Probar Worker directamente (requiere servicios levantados)
	@echo "$(GREEN)Probando endpoint de health del Worker...$(NC)"
	@curl -sf http://localhost:4000/health || echo "$(YELLOW)Worker no responde en :4000$(NC)"

test-worker-execute: ## Probar ejecución directa en el Worker
	@echo "$(GREEN)Probando ejecución directa en Worker (Python)...$(NC)"
	@curl -X POST http://localhost:4000/execute \
		-H "Content-Type: application/json" \
		-d '{"language":"python","code":"print(\"Hello from Worker\")","test_cases":[{"input":"","expected_output":"Hello from Worker"}]}' \
		2>/dev/null | python3 -m json.tool || echo "$(YELLOW)Worker no disponible$(NC)"

# ==============================================================================
# LIMPIEZA
# ==============================================================================

clean: ## Limpiar contenedores, volúmenes y redes
	@echo "$(YELLOW)Limpiando recursos...$(NC)"
	docker-compose down -v
	docker system prune -f

clean-all: ## Limpieza completa incluyendo imágenes
	@echo "$(YELLOW)Limpieza completa...$(NC)"
	docker-compose down -v --rmi all
	docker system prune -af --volumes

# ==============================================================================
# DESARROLLO
# ==============================================================================

dev: ## Levantar en modo desarrollo con logs
	docker-compose up --build

dev-detached: ## Levantar en modo desarrollo en background
	docker-compose up --build -d

dev-worker: ## Levantar solo el Worker en modo desarrollo
	docker-compose up --build worker

dev-api: ## Levantar solo la API en modo desarrollo
	docker-compose up --build api

dev-frontend: ## Levantar solo el Frontend en modo desarrollo
	docker-compose up --build frontend

# Comandos de instalación
install-api: ## Instalar dependencias de la API con Yarn
	docker-compose exec api yarn install

install-frontend: ## Instalar dependencias del Frontend
	docker-compose exec frontend npm install

install-worker: ## Instalar dependencias del Worker
	docker-compose exec worker pip install -r requirements.txt -r requirements-dev.txt

install-all: ## Instalar todas las dependencias
	$(MAKE) install-api
	$(MAKE) install-frontend
	$(MAKE) install-worker

shell-api: ## Abrir shell en el contenedor de API
	docker-compose exec api sh

shell-worker: ## Abrir shell en el contenedor de Worker
	docker-compose exec worker bash

shell-db: ## Abrir MySQL CLI en MariaDB
	docker-compose exec mariadb mysql -u ${DB_USER:-code_judge_user} -p${DB_PASSWORD:-change_this_password} ${DB_NAME:-code_judge}

shell-db-root: ## Abrir MySQL CLI como root
	docker-compose exec mariadb mysql -u root -p${DB_ROOT_PASSWORD:-root_password_change_me}

shell-mongo: ## Abrir MongoDB CLI
	docker-compose exec mongodb mongosh ${MONGO_DATABASE:-code_judge_logs}

# Comandos específicos de Python
worker-install: ## Instalar dependencias del Worker
	docker-compose exec worker pip install -r requirements.txt

worker-shell: ## Abrir Python REPL en el Worker
	docker-compose exec worker python3

worker-test: ## Ejecutar tests del Worker (si existen)
	docker-compose exec worker python3 -m pytest tests/ || echo "No hay tests configurados"

# Comandos de API
api-format: ## Formatear código de la API
	docker-compose exec api yarn format

api-lint: ## Linter de la API
	docker-compose exec api yarn lint

api-test: ## Tests de la API
	docker-compose exec api yarn test

# ==============================================================================
# UTILIDADES
# ==============================================================================

ps: ## Ver estado de los servicios
	docker-compose ps

stats: ## Ver estadísticas de recursos
	docker stats

health: ## Verificar salud de los servicios
	@echo "$(GREEN)Verificando salud de los servicios...$(NC)"
	@curl -sf http://localhost/health || echo "$(YELLOW)Nginx HTTP no responde$(NC)"
	@curl -sfk https://localhost/health || echo "$(YELLOW)Nginx HTTPS no responde$(NC)"
	@curl -sfk https://localhost/api/health || echo "$(YELLOW)API no responde$(NC)"
	@curl -sf http://localhost:4000/health || echo "$(YELLOW)Worker no responde$(NC)"

ssl-certs: ## Generar certificado SSL autofirmado para desarrollo local (Linux/Mac)
	@echo "$(GREEN)Generando certificados SSL autofirmados para localhost...$(NC)"
	@bash nginx/certs/generate-certs.sh
	@echo "$(GREEN)✓ Certificados listos en nginx/certs/$(NC)"
	@echo "$(YELLOW)→ Ejecuta 'make trust-cert' para que WebSocket (wss://) funcione en el navegador$(NC)"

trust-cert: ## Agregar el cert SSL al keychain de macOS (necesario para wss:// en Safari/Chrome)
	@if [ "$$(uname)" = "Darwin" ]; then \
		if [ ! -f nginx/certs/cert.pem ]; then \
			echo "$(YELLOW)⚠ Certificado no encontrado. Ejecuta 'make ssl-certs' primero.$(NC)"; \
			exit 1; \
		fi; \
		echo "$(GREEN)Agregando certificado al keychain de macOS (requiere contraseña)...$(NC)"; \
		sudo security add-trusted-cert -d -r trustRoot -k /Library/Keychains/System.keychain nginx/certs/cert.pem; \
		echo "$(GREEN)✓ Certificado de confianza. Reinicia el navegador y ya funcionará wss://$(NC)"; \
	else \
		echo "$(YELLOW)Este comando es solo para macOS.$(NC)"; \
		echo "En Linux: copia nginx/certs/cert.pem a /usr/local/share/ca-certificates/ y ejecuta update-ca-certificates"; \
	fi

ssl-certs-docker: ## Generar certificado SSL via Docker (Windows/Linux/Mac)
	@echo "$(GREEN)Generando certificados SSL autofirmados usando Docker...$(NC)"
	@docker run --rm -v "$(PWD)/nginx/certs:/certs" alpine/openssl \
		req -x509 -nodes -days 365 -newkey rsa:2048 \
		-keyout /certs/key.pem \
		-out /certs/cert.pem \
		-subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" \
		-addext "subjectAltName=DNS:localhost,IP:127.0.0.1"
	@echo "$(GREEN)✓ Certificados listos en nginx/certs/$(NC)"

images: ## Listar imágenes del proyecto
	@docker images | grep -E "code_judge|mariadb|mongo|redis|nginx|python"

network-test: ## Verificar que runners NO tienen acceso a red
	@echo "$(GREEN)Verificando aislamiento de red...$(NC)"
	@echo "Probando ping a google.com (debe fallar):"
	@docker run --rm --network none alpine ping -c 1 google.com 2>&1 | grep -q "Network is unreachable" && echo "$(GREEN)✓ Aislamiento correcto$(NC)" || echo "$(YELLOW)⚠ Aislamiento fallido$(NC)"

check-python: ## Verificar que Python está instalado en el Worker
	@echo "$(GREEN)Verificando instalación de Python en Worker...$(NC)"
	@docker-compose exec worker python3 --version || echo "$(RED)Python no encontrado$(NC)"
	@docker-compose exec worker pip list | grep docker || echo "$(RED)Docker SDK no instalado$(NC)"

# Backup y restore
backup-db: ## Crear backup de MariaDB
	@echo "$(GREEN)Creando backup de MariaDB...$(NC)"
	docker-compose exec mariadb mysqldump -u root -p${DB_ROOT_PASSWORD:-root_password_change_me} ${DB_NAME:-code_judge} > backup_$(shell date +%Y%m%d_%H%M%S).sql
	@echo "$(GREEN)✓ Backup creado$(NC)"

backup-mongo: ## Crear backup de MongoDB
	@echo "$(GREEN)Creando backup de MongoDB...$(NC)"
	docker-compose exec mongodb mongodump --db ${MONGO_DATABASE:-code_judge_logs} --out /backup
	@echo "$(GREEN)✓ Backup creado en contenedor$(NC)"

restore-db: ## Restaurar backup de MariaDB (requiere archivo backup.sql)
	@echo "$(YELLOW)Restaurando backup de MariaDB...$(NC)"
	docker-compose exec -T mariadb mysql -u root -p${DB_ROOT_PASSWORD:-root_password_change_me} ${DB_NAME:-code_judge} < backup.sql
	@echo "$(GREEN)✓ Backup restaurado$(NC)"
