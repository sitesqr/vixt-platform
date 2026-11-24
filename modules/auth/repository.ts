import { prisma } from "@/lib/prisma";
import type { AdminWithRole } from "./types";

export const authRepository = {
  async findByEmail(email: string): Promise<AdminWithRole | null> {
    return prisma.admin.findUnique({
      where: { email: email.trim().toLowerCase() },
      include: { role: true },
    });
  },

  async createSession(
    adminId: string,
    sessionId: string,
    tokenHash: string,
    expiresAt: Date,
  ) {
    return prisma.adminSession.create({
      data: { id: sessionId, adminId, tokenHash, expiresAt },
    });
  },

  async findValidSession(sessionId: string, tokenHash: string) {
    return prisma.adminSession.findFirst({
      where: {
        id: sessionId,
        tokenHash,
        expiresAt: { gt: new Date() },
        admin: { active: true },
      },
      include: { admin: { include: { role: true } } },
    });
  },

  async deleteSession(sessionId: string) {
    return prisma.adminSession.deleteMany({ where: { id: sessionId } });
  },

  async touchLastLogin(adminId: string) {
    return prisma.admin.update({
      where: { id: adminId },
      data: { lastLoginAt: new Date() },
    });
  },

  async logAudit(input: {
    adminId?: string;
    action: string;
    entityType: string;
    entityId?: string;
    metadata?: Record<string, unknown>;
    ipHash?: string;
  }) {
    return prisma.auditLog.create({
      data: {
        adminId: input.adminId,
        action: input.action,
        entityType: input.entityType,
        entityId: input.entityId,
        metadata: input.metadata as object | undefined,
        ipHash: input.ipHash,
      },
    });
  },
};
