import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { trackEvent, hashSession, newSessionId } from "@/lib/analytics";

export const dynamic = "force-dynamic";

/** Redireciona para o link de acesso cadastrado no banco (nunca do cliente). */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const distribution = await prisma.distribution.findFirst({
    where: { id, active: true },
    select: { id: true, applicationId: true, url: true },
  });

  if (!distribution || !distribution.url.startsWith("http")) {
    return NextResponse.json(
      { ok: false, error: { code: "NOT_FOUND", message: "Link indisponível." } },
      { status: 404 },
    );
  }

  const store = await cookies();
  const sid = store.get("vixt_sid")?.value ?? newSessionId();

  void trackEvent({
    type: "CLICK",
    applicationId: distribution.applicationId,
    distributionId: distribution.id,
    sessionHash: hashSession(sid),
    referrer: request.headers.get("referer") ?? undefined,
  });

  const response = NextResponse.redirect(distribution.url, 302);
  if (!store.get("vixt_sid")) {
    response.cookies.set("vixt_sid", sid, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
  }
  response.headers.set("Cache-Control", "no-store");
  return response;
}
