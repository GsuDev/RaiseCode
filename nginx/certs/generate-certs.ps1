# ==============================================================================
# RaiseCode - Generador de certificado SSL autofirmado (Windows / PowerShell)
# ==============================================================================
# Uso: Abre PowerShell como administrador en la raiz del proyecto y ejecuta:
#   .\nginx\certs\generate-certs.ps1
#
# Genera cert.pem y key.pem usando Docker (no requiere instalar openssl).
# Los certificados son validos 365 dias para localhost.
# NOTA: Estos archivos estan en .gitignore - no se suben al repositorio.
# ==============================================================================

$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$CertsDir = $ScriptDir -replace '\\', '/'

Write-Host "Generando certificado SSL autofirmado para localhost..." -ForegroundColor Green

docker run --rm `
  -v "${CertsDir}:/certs" `
  alpine/openssl `
  req -x509 -nodes -days 365 -newkey rsa:2048 `
  -keyout /certs/key.pem `
  -out /certs/cert.pem `
  -subj "/C=ES/ST=Local/L=Local/O=RaiseCode/CN=localhost" `
  -addext "subjectAltName=DNS:localhost,IP:127.0.0.1"

if ($LASTEXITCODE -ne 0) {
    Write-Host "ERROR: Fallo al generar certificados. Asegurate de que Docker Desktop esta corriendo." -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "Certificados generados en nginx/certs/" -ForegroundColor Green
Write-Host "  - nginx/certs/cert.pem"
Write-Host "  - nginx/certs/key.pem"
Write-Host ""
Write-Host "SIGUIENTE PASO - instalar el certificado como de confianza (necesario para WebSocket wss://):" -ForegroundColor Yellow
Write-Host ""
Write-Host "  Opcion A (automatica, requiere PowerShell como administrador):"
Write-Host '    Import-Certificate -FilePath "nginx\certs\cert.pem" -CertStoreLocation Cert:\LocalMachine\Root'
Write-Host ""
Write-Host "  Opcion B (manual):"
Write-Host "    1. Doble clic en nginx\certs\cert.pem"
Write-Host "    2. 'Instalar certificado' > 'Maquina local' > Siguiente"
Write-Host "    3. 'Colocar en el siguiente almacen' > 'Entidades de certificacion raiz de confianza'"
Write-Host "    4. Finalizar y reiniciar el navegador"
Write-Host ""
