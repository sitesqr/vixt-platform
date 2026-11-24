import { PrismaClient } from "@prisma/client";

/**
 * Singleton do Prisma Client.
 * Em desenvolvimento, o Next.js recarrega módulos a cada HMR; sem o cache global
 * isso cria demasiadas conexões. Em produção, uma única instância é suficiente.
 */
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log:
      process.env.NODE_ENV === "development"
        ? ["error", "warn"]
        : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

/** Detecta URL real de banco, ignorando valores de exemplo do .env.example. */
export function isDatabaseConfigured(): boolean {
  const url = process.env.DATABASE_URL ?? "";
  if (!url) return false;
  return !(
    url.includes("ep-xxx") ||
    url.includes("user:password@") ||
    url.includes("localhost:5432")
  );
}
