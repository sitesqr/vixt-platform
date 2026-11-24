import type { NextResponse } from "next/server";
import { apiError } from "./api-response";
import { getSession } from "@/modules/auth/session";
import type { AuthenticatedAdmin } from "@/modules/auth";

/**
 * Protege rotas administrativas no BACKEND.
 * Retorna { admin } ou { response } com 401 — nunca confia apenas no middleware.
 */
export async function requireAdmin(): Promise<
  { admin: AuthenticatedAdmin; response?: never } | { response: NextResponse; admin?: never }
> {
  const admin = await getSession();
  if (!admin) {
    return { response: apiError("UNAUTHORIZED", "Autenticação necessária.", 401) };
  }
  return { admin };
}
