import { NextRequest } from "next/server";
import { createHash } from "node:crypto";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { loginSchema } from "@/lib/validation";
import { sessionCookie } from "@/lib/jwt";
import { authService, AuthError } from "@/modules/auth";

export const dynamic = "force-dynamic";

function ipHash(request: NextRequest): string {
  return createHash("sha256")
    .update(request.headers.get("x-forwarded-for") ?? "unknown")
    .digest("hex")
    .slice(0, 64);
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);
    const parsed = loginSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("BAD_REQUEST", "E-mail e senha são obrigatórios.", 400);
    }

    const result = await authService.login(parsed.data, ipHash(request));
    const response = apiSuccess({
      admin: result.admin,
      expiresAt: result.expiresAt.toISOString(),
    });
    response.cookies.set(sessionCookie.name, result.token, {
      ...sessionCookie.options,
      maxAge: Math.floor((result.expiresAt.getTime() - Date.now()) / 1000),
    });
    return response;
  } catch (error) {
    if (error instanceof AuthError) {
      const rateLimited = error.code === "RATE_LIMITED";
      return apiError(
        rateLimited ? "RATE_LIMITED" : "UNAUTHORIZED",
        error.message,
        rateLimited ? 429 : 401,
      );
    }
    return handleApiError(error);
  }
}
