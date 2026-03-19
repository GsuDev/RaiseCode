const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface SubmitCodePayload {
  challengeId: number;
  code: string;
}

/**
 * Envía el código al backend para ejecutar.
 * Devuelve el jobId — el resultado llegará por WebSocket.
 */
export const submitCodeService = async (
  payload: SubmitCodePayload,
  token: string,
): Promise<{ jobId: string }> => {
  const response = await fetch(`${API_URL}/execution`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(
      Array.isArray(json.message)
        ? json.message.join(', ')
        : (json.message ?? 'Error al enviar el código'),
    );
  }

  return json;
};
