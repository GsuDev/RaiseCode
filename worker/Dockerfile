FROM python:3.11-slim

# Instalar Docker CLI (para verificaciones, aunque usamos SDK)
RUN apt-get update && \
    apt-get install -y --no-install-recommends \
    docker.io \
    && rm -rf /var/lib/apt/lists/*

# Directorio de trabajo
WORKDIR /app

# Copiar requirements
COPY requirements.txt .

# Instalar dependencias Python
RUN pip install --no-cache-dir -r requirements.txt

# Copiar código fuente
COPY . .

# Puerto del worker
EXPOSE 4000

# Variables de entorno
ENV PYTHONUNBUFFERED=1

# Comando de inicio
CMD ["python", "src/main.py"]
