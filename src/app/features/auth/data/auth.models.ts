// src/app/features/auth/data/auth.models.ts

export interface AuthRequest {
  username: string;
  password: string;
}

export interface AuthResponse {
  token: string;
  username: string;
  role: string;
}

export interface AuthRegisterResponse {
  username: string;
  role: string;
}
