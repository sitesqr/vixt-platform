import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { trackEvent, hashSession, newSessionId } from "@/lib/analytics";
import { applicationsService } from "@/modules/applications";
import { safePublicQuery } from "@/lib/safe-data";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

const SESSION_COOKIE = "vixt_sid";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ slug: string }> },
) {
  try {
    const { slug } = await params;
    const app = await safePublicQuery(
      () => applicationsService.getBySlug(slug),
      null,
    );
    if (app === null) {
      return apiError("DATABASE_UNAVAILABLE", "Catálogo indisponível.", 503);
    }
    if (!app) return apiError("NOT_FOUND", "Aplicativo não encontrado.", 404);

    const store = await cookies();
    let sid = store.get(SESSION_COOKIE)?.value;
    if (!sid) sid = newSessionId();

    void trackEvent({
      type: "VIEW",
      applicationId: app.id,
      sessionHash: hashSession(sid),
    });

    const response = apiSuccess(app, {
      headers: { "Cache-Control": "private, no-store" },
    });
    if (!store.get(SESSION_COOKIE)) {
      response.cookies.set(SESSION_COOKIE, sid, {
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        maxAge: 60 * 60 * 24 * 7,
        path: "/",
      });
    }
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
