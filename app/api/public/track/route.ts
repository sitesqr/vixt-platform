import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { checkRateLimit } from "@/lib/rate-limit";
import { hashSession, newSessionId, trackEvent } from "@/lib/analytics";
import { prisma } from "@/lib/prisma";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const schema = z.object({
  distributionId: z.string().uuid(),
  // "click" = clique no botão; "download" = evento de download registrado.
  kind: z.enum(["click", "download"]),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = schema.safeParse(body);
    if (!parsed.success) {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400);
    }

    const distribution = await prisma.distribution.findFirst({
      where: { id: parsed.data.distributionId, active: true },
      select: { id: true, applicationId: true, trackDownload: true },
    });
    if (!distribution) {
      return apiError("NOT_FOUND", "Link de distribuição inválido.", 404);
    }

    const ipHash = hashSession(
      request.headers.get("x-forwarded-for") ?? "unknown",
    );
    const rate = checkRateLimit(`track:${ipHash}`, 60, 60 * 1000);
    if (!rate.allowed) {
      return apiError("RATE_LIMITED", "Muitas requisições.", 429);
    }

    const store = await cookies();
    const sid = store.get("vixt_sid")?.value ?? newSessionId();
    const type = parsed.data.kind === "download" ? "DOWNLOAD" : "CLICK";

    void trackEvent({
      type,
      applicationId: distribution.applicationId,
      distributionId: distribution.id,
      sessionHash: hashSession(sid),
      referrer: request.headers.get("referer") ?? undefined,
      // Nunca afirmamos que a instalação foi concluída.
      confirmed: false,
    });

    return apiSuccess({ recorded: true, type });
  } catch (error) {
    return handleApiError(error);
  }
}
