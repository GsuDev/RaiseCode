import { GeneratedUserCredentials } from '../service/adminUsers.service';

/**
 * Exporta las credenciales de usuario generadas a un archivo CSV
 * @param credentials Array de credenciales generadas
 * @param prefix El prefijo usado para generar los usuarios (usado en el nombre del archivo)
 */
export const exportCredentialsCSV = (
  credentials: GeneratedUserCredentials[],
  prefix: string
): void => {
  // Crear contenido CSV
  const headers = ['Email,Password'];
  const rows = credentials.map((c) => `${c.email},${c.password}`);
  const csvContent = [headers, ...rows].join('\n');

  // Crear blob y descarga
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);

  const timestamp = new Date()
    .toISOString()
    .replace(/[:.]/g, '-')
    .slice(0, -5);
  const filename = `${prefix}-usuarios-${timestamp}.csv`;

  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';

  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
