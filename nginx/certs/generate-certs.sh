#!/bin/bash
# ==============================================================================
# Generador de certificado SSL autofirmado para desarrollo local
# ==============================================================================
# Uso: bash nginx/certs/generate-certs.sh
#      (o: make ssl-certs)
#
# Genera cert.pem y key.pem en el mismo directorio que este script.
# Los certificados son válidos 365 días para localhost.
# NOTA: Estos archivos están en .gitignore — no se commitean.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"

echo "Generando certificado SSL autofirmado para localhost..."

openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout "$SCRIPT_DIR/key.pem" \
  -out "$SCRIPT_DIR/cert.pem" \
  -subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" \
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

echo "Certificados generados en nginx/certs/"
echo "  - nginx/certs/cert.pem (certificado público)"
echo "  - nginx/certs/key.pem  (clave privada)"
echo ""
echo "NOTA: El navegador mostrará una advertencia de seguridad al acceder"
echo "      a https://localhost porque el certificado es autofirmado."
echo "      Esto es normal en desarrollo. En producción se usaría Let's Encrypt."
