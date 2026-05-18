import Cookies from "js-cookie";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:3000";

export interface User {
  id: string;
  email: string;
  username: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
}

interface ApiResponse<T> {
  data: T;
  message?: string;
}

interface PaginatedResponse<T> {
  data: T[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

interface CreateUserDto {
  email: string;
  username: string;
  password: string;
  role?: "USER" | "ADMIN";
}

interface UpdateUserDto {
  email?: string;
  username?: string;
  role?: "USER" | "ADMIN";
  password?: string;
}

function getAuthHeaders(): HeadersInit {
  const token = Cookies.get("accessToken");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
}

export const usersApi = {
  // GET /users - Find all users with pagination
  getUsers: async (
    page = 1,
    limit = 10,
    search = "",
  ): Promise<PaginatedResponse<User>> => {
    const params = new URLSearchParams();
    params.set("page", page.toString());
    params.set("limit", limit.toString());
    if (search.trim()) params.set("search", search.trim());

    const response = await fetch(`${API_BASE}/users?${params.toString()}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error fetching users");
    return response.json();
  },

  // GET /users/:id - Find one user
  getUserById: async (id: string): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "GET",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error fetching user");
    return response.json();
  },

  // POST /users - Create new user
  createUser: async (user: CreateUserDto): Promise<User> => {
    const response = await fetch(`${API_BASE}/users`, {
      method: "POST",
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al crear usuario");
    }
    return response.json();
  },

  // PATCH /users/:id - Update user
  updateUser: async (id: string, user: UpdateUserDto): Promise<User> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "PATCH",
      headers: getAuthHeaders(),
      body: JSON.stringify(user),
    });
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Error al actualizar usuario");
    }
    return response.json();
  },

  // DELETE /users/:id - Remove user
  deleteUser: async (
    id: string,
  ): Promise<ApiResponse<{ success: boolean }>> => {
    const response = await fetch(`${API_BASE}/users/${id}`, {
      method: "DELETE",
      headers: getAuthHeaders(),
    });
    if (!response.ok) throw new Error("Error deleting user");
    return response.json();
  },
};
