
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export interface User {
  id: number;
  name: string;
  lastname: string;
  email: string;
  course?: {
    name: string;
  };
  roles: string[];
}

export interface Course {
  id: number;
  name: string;
}

interface CreateUserDto {
  name: string;
  lastname: string;
  email: string;
  password: string;
  passwordConfirm: string;
  courseId: number;
}

interface UpdateUserDto {
  name?: string;
  lastname?: string;
  email?: string;
  courseId?: number;
}

export interface GeneratedUserCredentials {
  email: string;
  password: string;
}

interface UsersResponse {
  data: User[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const getAuthHeader = () => {
  const token = localStorage.getItem('token');
  return {
    'Content-Type': 'application/json',
    Authorization: token ? `Bearer ${token}` : '',
  };
};

export const adminUsersService = {
  /**
   * Obtiene la lista de usuarios con paginación
   */
  getUsers: async (page: number = 1, limit: number = 10): Promise<UsersResponse> => {
    const response = await fetch(`${API_URL}/users?page=${page}&limit=${limit}`, {
      method: 'GET',
      headers: getAuthHeader(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener usuarios');
    }

    return response.json();
  },

  /**
   * Crea un nuevo usuario
   */
  createUser: async (createUserDto: CreateUserDto): Promise<User> => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: getAuthHeader(),
      credentials: 'include',
      body: JSON.stringify(createUserDto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al crear usuario');
    }

    return response.json();
  },

  /**
   * Actualiza un usuario existente
   */
  updateUser: async (id: number, updateUserDto: UpdateUserDto): Promise<User> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'PATCH',
      headers: getAuthHeader(),
      credentials: 'include',
      body: JSON.stringify(updateUserDto),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al actualizar usuario');
    }

    return response.json();
  },

  /**
   * Elimina un usuario
   */
  deleteUser: async (id: number): Promise<void> => {
    const response = await fetch(`${API_URL}/users/${id}`, {
      method: 'DELETE',
      headers: getAuthHeader(),
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al eliminar usuario');
    }
  },

  /**
   * Obtiene la lista de cursos
   */
  getCourses: async (): Promise<Course[]> => {
    const response = await fetch(`${API_URL}/courses`, {
      method: 'GET',
      headers: getAuthHeader(),
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Error al obtener cursos');
    }

    const data = await response.json();
    // El endpoint puede devolver { data: [...] } o directamente [...]
    return Array.isArray(data) ? data : data.data || [];
  },

  /**
   * Crea un lote de usuarios genéricos con contraseñas auto-generadas
   */
  createBulkGenericUsers: async (
    prefix: string,
    count: number,
    courseId?: number
  ): Promise<GeneratedUserCredentials[]> => {
    const response = await fetch(`${API_URL}/users/bulk-generic`, {
      method: 'POST',
      headers: getAuthHeader(),
      credentials: 'include',
      body: JSON.stringify({ prefix, count, ...(courseId ? { courseId } : {}) }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Error al generar usuarios en lote');
    }

    return response.json();
  },
};