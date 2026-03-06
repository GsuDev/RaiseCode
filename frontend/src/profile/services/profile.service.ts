const API_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:3000/api';

export interface LanguageStat {
  languageName: string;
  count: number;
}

export interface ProfileResponse {
  stats: {
    completedCount: number;
  };
  languages: LanguageStat[];
}

export const getProfileService = async (token: string): Promise<ProfileResponse> => {

  // DESCOMENTAR ESTO CUANDO EL BACKEND ESTÉ LISTO

  /*
  const response = await fetch(`${API_URL}/users/me`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  });

  const json = await response.json();

  if (!response.ok) {
    throw new Error(json.message ?? 'Error al obtener la información del perfil');
  }

  return json;
  */


  // MOCK TEMPORAL

  return new Promise((resolve) => {
    // Simulamos que el backend tarda 1 segundo en responder para ver el Spinner
    setTimeout(() => {
      resolve({
        stats: {
          completedCount: 45 
        },
        languages: [
          { languageName: "JavaScript", count: 28 },
          { languageName: "PHP", count: 8 },
          { languageName: "Java", count: 5 },
          { languageName: "Python", count: 4 },
        ]
      });
    }, 1000); 
  });
};