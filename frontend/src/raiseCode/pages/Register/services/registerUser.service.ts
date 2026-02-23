// URL base de la API leída desde las variables de entorno de Vite
const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export interface RegisterPayload {
  nombre: string;
  apellidos: string;
  email: string;
  password: string;
  passwordConfirm: string;
  cycle: string;
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    cycle: string;
  };
  payload: object;
  access_token: string;
}

/**
 * Envía los datos de registro al backend y devuelve usuario + token.
 * Lanza un error con el mensaje del servidor si la respuesta no es OK.
 */
export const registerUserService = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    // El backend devuelve { message: string } en los errores
    throw new Error(json.message ?? 'Error al registrar el usuario');
  }

  return json;
};
