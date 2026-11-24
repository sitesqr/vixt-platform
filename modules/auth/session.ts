import { cookies } from "next/headers";
import { sessionCookie } from "@/lib/jwt";
import { authService } from "./service";
import type { AuthenticatedAdmin } from "./types";

/** Retorna o admin autenticado ou null. Use em API routes e server components. */
export async function getSession(): Promise<AuthenticatedAdmin | null> {
  const store = await cookies();
  const token = store.get(sessionCookie.name)?.value;
  return authService.validateSession(token);
}

/** Exige autenticação; lança erro para ser traduzido pela camada de API. */
export async function requireSession(): Promise<AuthenticatedAdmin> {
  const admin = await getSession();
  if (!admin) throw new Error("UNAUTHORIZED");
  return admin;
}
