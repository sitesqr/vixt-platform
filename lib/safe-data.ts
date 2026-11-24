import { isDatabaseConfigured } from "./prisma";

/**
 * Executa uma consulta de leitura pública apenas se o banco estiver configurado.
 * Durante a Fase 1 (sem DATABASE_URL de produção), retorna o fallback.
 * Nunca retorna dados fictícios apresentados como reais.
 */
export async function safePublicQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  if (!isDatabaseConfigured()) return fallback;
  try {
    return await query();
  } catch (error) {
    console.error("[safe-public-query] falha na consulta pública:", error);
    return fallback;
  }
}
