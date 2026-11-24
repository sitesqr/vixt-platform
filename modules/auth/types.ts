import type { Admin, AdminRole } from "@prisma/client";

export interface AdminWithRole extends Admin {
  role: AdminRole;
}

export interface AuthenticatedAdmin {
  id: string;
  email: string;
  name: string;
  role: string;
  sessionId: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface LoginResult {
  token: string;
  admin: AuthenticatedAdmin;
  expiresAt: Date;
}
