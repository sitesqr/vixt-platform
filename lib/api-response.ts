import { NextResponse } from "next/server";
import { ZodError } from "zod";

export type ApiErrorCode =
  | "BAD_REQUEST"
  | "UNAUTHORIZED"
  | "FORBIDDEN"
  | "NOT_FOUND"
  | "CONFLICT"
  | "RATE_LIMITED"
  | "DATABASE_UNAVAILABLE"
  | "INTERNAL";

export interface ApiErrorBody {
  ok: false;
  error: { code: ApiErrorCode; message: string; details?: unknown };
}

export function apiSuccess<T>(data: T, init?: ResponseInit) {
  return NextResponse.json({ ok: true, data }, init);
}

export function apiError(
  code: ApiErrorCode,
  message: string,
  status: number,
  details?: unknown,
) {
  const body: ApiErrorBody = {
    ok: false,
    error: { code, message, ...(details ? { details } : {}) },
  };
  return NextResponse.json(body, { status });
}

const STATUS_BY_CODE: Record<ApiErrorCode, number> = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  RATE_LIMITED: 429,
  DATABASE_UNAVAILABLE: 503,
  INTERNAL: 500,
};

/**
 * Traduz erros conhecidos para respostas HTTP seguras.
 * Nunca expõe stack traces ou mensagens internas do Prisma ao cliente.
 */
export function handleApiError(error: unknown) {
  if (error instanceof ZodError) {
    return apiError(
      "BAD_REQUEST",
      "Dados inválidos.",
      400,
      error.issues.map((i) => ({
        path: i.path.join("."),
        message: i.message,
      })),
    );
  }

  const message = error instanceof Error ? error.message : "";

  if (message.includes("P2002")) {
    return apiError("CONFLICT", "Registro já existente.", 409);
  }
  if (message.includes("P2025")) {
    return apiError("NOT_FOUND", "Registro não encontrado.", 404);
  }
  if (message.includes("P1001") || message.includes("P1003")) {
    return apiError(
      "DATABASE_UNAVAILABLE",
      "Banco de dados indisponível no momento.",
      503,
    );
  }
  if (message.includes("DATABASE_URL")) {
    return apiError(
      "DATABASE_UNAVAILABLE",
      "Banco de dados não configurado.",
      503,
    );
  }

  console.error("[api] erro não tratado:", error);
  return apiError("INTERNAL", "Erro interno do servidor.", 500);
}

export function errorStatus(code: ApiErrorCode) {
  return STATUS_BY_CODE[code];
}
