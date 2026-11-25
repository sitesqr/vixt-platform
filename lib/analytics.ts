import { createHash, randomUUID } from "node:crypto";
import type { AnalyticsEventType } from "@prisma/client";
import { prisma } from "./prisma";

/**
 * Analytics sem login e sem PII.
 * - sessionHash: SHA-256 de identificador de sessão + salt, truncado a 64 chars.
 * - IP bruto nunca é gravado.
 * - Apenas VIEW e CLICK são registrados; não há downloads na plataforma.
 */
export function hashSession(identifier: string): string {
  const salt = process.env.ANALYTICS_SALT ?? "vixt-dev-salt-change-me";
  return createHash("sha256")
    .update(`${salt}:${identifier}`)
    .digest("hex")
    .slice(0, 64);
}

export function newSessionId(): string {
  return randomUUID();
}

export async function trackEvent(input: {
  type: AnalyticsEventType;
  applicationId: string;
  distributionId?: string;
  sessionHash?: string;
  referrer?: string;
}): Promise<void> {
  try {
    await prisma.analyticsEvent.create({
      data: {
        type: input.type,
        applicationId: input.applicationId,
        distributionId: input.distributionId,
        sessionHash: input.sessionHash,
        referrer: input.referrer?.slice(0, 300),
      },
    });
    await upsertDailyStat(input.type, input.applicationId);
  } catch (error) {
    // Estatística nunca deve quebrar a experiência do visitante.
    console.error("[analytics] falha ao registrar evento:", error);
  }
}

async function upsertDailyStat(
  type: AnalyticsEventType,
  applicationId: string,
) {
  const date = new Date();
  date.setUTCHours(0, 0, 0, 0);
  const field = type === "VIEW" ? "views" : "clicks";

  await prisma.dailyStat.upsert({
    where: { date_applicationId: { date, applicationId } },
    create: { date, applicationId, [field]: 1 },
    update: { [field]: { increment: 1 } },
  });
}
