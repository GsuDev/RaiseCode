const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface CreateChallengePayload {
  title: string;
  description: string;
  statement: string;
  dificultyId: number;
  languageId: number;
  subjectId: number;
}

export interface CreateChallengeResponse {
  id: number;
  title: string;
  validate: boolean;
}

export const createChallengeService = async (
  payload: CreateChallengePayload,
  token: string
): Promise<CreateChallengeResponse> => {
  const response = await fetch(`${API_URL}/challenges`, {
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
      Array.isArray(json.message) ? json.message.join(', ') : (json.message ?? 'Error al crear el reto')
    );
  }

  return json;
};
