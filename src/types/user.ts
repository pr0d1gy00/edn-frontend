export interface User {
  id: string;
  email: string;
  username: string;
  role: "ADMIN" | "USER";
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateUserInput {
  email: string;
  username: string;
  password: string;
  role?: "ADMIN" | "USER";
}

export interface UpdateUserInput {
  email?: string;
  username?: string;
  role?: "ADMIN" | "USER";
  password?: string;
}
