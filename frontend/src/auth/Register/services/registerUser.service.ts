const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost/api';

export interface RegisterPayload {
  name: string;      
  lastname: string;  
  email: string;
  password: string;
  passwordConfirm: string;
  courseId: number; 
}

export interface RegisterResponse {
  message: string;
  user: {
    id: number;
    name: string;
    lastname: string;
    email: string;
    course: {
      id: number;
      name: string;
    };
  };
  access_token: string;
}

export const registerUserService = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const response = await fetch(`${API_URL}/auth/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Error al registrar el usuario');
  }

  return json;
};