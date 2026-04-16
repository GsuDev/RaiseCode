const API_URL = import.meta.env.VITE_API_URL ?? 'https://localhost:3000/api';

export interface LoginPayload {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  access_token: string;
  payload: {
    email: string;
    sub: number;
    roles: string[];
  };
  user: {
    id: number;
    email: string;
    name: string;
    lastname: string;
    cycle: string;
  };
}

export const loginService = async (data: LoginPayload): Promise<LoginResponse> => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Credenciales incorrectas');
  }

  return json;
};
