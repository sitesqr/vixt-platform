import { describe, it, expect, beforeAll } from "vitest";
import { hashPassword, verifyPassword } from "@/lib/password";
import { signSessionToken, verifySessionToken } from "@/lib/jwt";
import { hashSession } from "@/lib/analytics";
import { checkRateLimit } from "@/lib/rate-limit";

beforeAll(() => {
  process.env.JWT_SECRET = "segredo-de-teste-com-mais-de-32-caracteres-aleatorios";
  process.env.ANALYTICS_SALT = "salt-de-teste";
});

describe("segurança", () => {
  it("gera hash Argon2id e verifica senha correta/incorreta", async () => {
    const hash = await hashPassword("Senha@123456");
    expect(hash).toMatch(/^\$argon2id\$/);
    expect(hash).not.toContain("Senha@123456");
    expect(await verifyPassword(hash, "Senha@123456")).toBe(true);
    expect(await verifyPassword(hash, "errada")).toBe(false);
  });

  it("assina e valida token de sessão com payload íntegro", async () => {
    const payload = {
      sub: "admin-1",
      email: "admin@vixt.com.br",
      role: "SUPER_ADMIN",
      sessionId: "sessao-1",
    };
    const token = await signSessionToken(payload, 10);
    const verified = await verifySessionToken(token);
    expect(verified).toEqual(payload);
    expect(await verifySessionToken("token.invalido")).toBeNull();
    expect(await verifySessionToken(undefined)).toBeNull();
  });

  it("hash de sessão é determinístico e não revela o identificador", () => {
    const a = hashSession("visitante-123");
    const b = hashSession("visitante-123");
    expect(a).toBe(b);
    expect(a).toHaveLength(64);
    expect(a).not.toContain("visitante");
    expect(hashSession("visitante-456")).not.toBe(a);
  });

  it("rate limit bloqueia após o limite", () => {
    const key = `teste-${Math.random()}`;
    for (let i = 0; i < 3; i++) {
      expect(checkRateLimit(key, 3, 60_000).allowed).toBe(true);
    }
    const blocked = checkRateLimit(key, 3, 60_000);
    expect(blocked.allowed).toBe(false);
    expect(blocked.remaining).toBe(0);
  });
});
