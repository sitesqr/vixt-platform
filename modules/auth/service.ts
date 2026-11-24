import { createHash, randomUUID } from "node:crypto";
import { signSessionToken, verifySessionToken } from "@/lib/jwt";
import { verifyPassword } from "@/lib/password";
import { checkRateLimit } from "@/lib/rate-limit";
import { authRepository } from "./repository";
import type {
  AuthenticatedAdmin,
  LoginInput,
  LoginResult,
} from "./types";

export class AuthError extends Error {
  constructor(
    public readonly code:
      | "INVALID_CREDENTIALS"
      | "INACTIVE_ADMIN"
      | "RATE_LIMITED"
      | "SESSION_INVALID",
    message: string,
  ) {
    super(message);
  }
}

function hashToken(token: string): string {
  return createHash("sha256").update(token).digest("hex");
}

export const authService = {
  async login(input: LoginInput, ipHash?: string): Promise<LoginResult> {
    const rate = checkRateLimit(
      `login:${input.email.toLowerCase()}`,
      Number(process.env.RATE_LIMIT_LOGIN_MAX ?? 5),
      15 * 60 * 1000,
    );
    if (!rate.allowed) {
      throw new AuthError("RATE_LIMITED", "Muitas tentativas. Tente novamente mais tarde.");
    }

    const admin = await authRepository.findByEmail(input.email);
    const valid = admin
      ? await verifyPassword(admin.passwordHash, input.password)
      : false;

    // Não revelar se o e-mail existe: mesmo erro para ambos os casos.
    if (!admin || !valid) {
      await authRepository.logAudit({
        action: "auth.login.failed",
        entityType: "Admin",
        ipHash,
        metadata: { email: input.email.toLowerCase() },
      });
      throw new AuthError("INVALID_CREDENTIALS", "E-mail ou senha incorretos.");
    }

    if (!admin.active) {
      throw new AuthError("INACTIVE_ADMIN", "Este usuário está inativo.");
    }

    const ttl = Number(process.env.ADMIN_SESSION_TTL_MINUTES ?? 720);
    const sessionId = randomUUID();
    const token = await signSessionToken(
      {
        sub: admin.id,
        email: admin.email,
        role: admin.role.name,
        sessionId,
      },
      ttl,
    );
    const expiresAt = new Date(Date.now() + ttl * 60 * 1000);

    await authRepository.createSession(
      admin.id,
      sessionId,
      hashToken(token),
      expiresAt,
    );
    await authRepository.touchLastLogin(admin.id);
    await authRepository.logAudit({
      adminId: admin.id,
      action: "auth.login.success",
      entityType: "Admin",
      entityId: admin.id,
      ipHash,
    });

    return {
      token,
      expiresAt,
      admin: {
        id: admin.id,
        email: admin.email,
        name: admin.name,
        role: admin.role.name,
        sessionId,
      },
    };
  },

  async validateSession(token: string | undefined): Promise<AuthenticatedAdmin | null> {
    const payload = await verifySessionToken(token);
    if (!payload) return null;

    const session = await authRepository.findValidSession(
      payload.sessionId,
      hashToken(token!),
    );
    if (!session || session.adminId !== payload.sub) return null;

    return {
      id: session.admin.id,
      email: session.admin.email,
      name: session.admin.name,
      role: session.admin.role.name,
      sessionId: payload.sessionId,
    };
  },

  async logout(admin: AuthenticatedAdmin | null, token: string | undefined) {
    if (admin) {
      await authRepository.deleteSession(admin.sessionId);
      await authRepository.logAudit({
        adminId: admin.id,
        action: "auth.logout",
        entityType: "Admin",
        entityId: admin.id,
      });
    }
    void token;
  },

  /** Verifica se a role possui uma permissão ( preparação para RBAC ). */
  hasPermission(role: string, permission: string): boolean {
    if (role === "SUPER_ADMIN") return true;
    const matrix: Record<string, string[]> = {
      ADMIN: [
        "applications.read",
        "applications.write",
        "categories.write",
        "content.write",
        "banners.write",
        "stats.read",
      ],
      EDITOR: ["applications.read", "applications.write", "content.write"],
      VIEWER: ["applications.read", "stats.read"],
    };
    return matrix[role]?.includes(permission) ?? false;
  },
};
