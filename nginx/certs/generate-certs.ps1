# ==============================================================================
# Generador de certificado SSL autofirmado para desarrollo local (Windows)
# ==============================================================================
# Uso (PowerShell): .\nginx\certs\generate-certs.ps1
#
# Genera cert.pem y key.pem usando Docker (no requiere instalar openssl).
# Los certificados son válidos 365 días para localhost.
# NOTA: Estos archivos están en .gitignore — no se commitean.
#
# En Linux/Mac usar: bash nginx/certs/generate-certs.sh
# ==============================================================================

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CertsDir = $ScriptDir -replace '\\', '/'

Write-Host "Generando certificado SSL autofirmado para localhost..."

# Usar Docker para ejecutar openssl (no requiere tenerlo instalado en Windows)
docker run --rm `
  -v "${CertsDir}:/certs" `
  alpine/openssl `
  req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout /certs/key.pem `
  -out /certs/cert.pem `
  -subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "Certificados generados en nginx/certs/"
    Write-Host "  - nginx/certs/cert.pem (certificado publico)"
    Write-Host "  - nginx/certs/key.pem  (clave privada)"
    Write-Host ""
    Write-Host "NOTA: El navegador mostrara una advertencia de seguridad al acceder"
    Write-Host "      a https://localhost porque el certificado es autofirmado."
    Write-Host "      Esto es normal en desarrollo. En produccion se usaria Let's Encrypt."
} else {
    Write-Host "ERROR: Fallo al generar los certificados. Asegurate de que Docker esta corriendo."
    exit 1
}
