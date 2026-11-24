import { describe, it, expect } from "vitest";
import {
  slugSchema,
  emailSchema,
  passwordSchema,
  catalogQuerySchema,
  urlSchema,
} from "@/lib/validation";

describe("validação de entrada", () => {
  it("aceita slugs válidos e rejeita inválidos", () => {
    expect(slugSchema.safeParse("lava-rapido").success).toBe(true);
    expect(slugSchema.safeParse("Lava-Rapido").success).toBe(false);
    expect(slugSchema.safeParse("slug com espaço").success).toBe(false);
    expect(slugSchema.safeParse("-invalido").success).toBe(false);
  });

  it("valida e normaliza e-mails", () => {
    expect(emailSchema.safeParse("admin@vixt.com.br").success).toBe(true);
    expect(emailSchema.safeParse("nao-e-email").success).toBe(false);
  });

  it("exige senha forte", () => {
    expect(passwordSchema.safeParse("Senha@123456").success).toBe(true);
    expect(passwordSchema.safeParse("fraca").success).toBe(false);
    expect(passwordSchema.safeParse("semSimbolo123A").success).toBe(false);
  });

  it("aceita apenas URLs http(s)", () => {
    expect(urlSchema.safeParse("https://app.vixt.com.br").success).toBe(true);
    expect(urlSchema.safeParse("javascript:alert(1)").success).toBe(false);
    expect(urlSchema.safeParse("ftp://servidor.arquivo").success).toBe(false);
  });

  it("aplica paginação e ordenação padrão", () => {
    const parsed = catalogQuerySchema.parse({ q: "oficina" });
    expect(parsed.page).toBe(1);
    expect(parsed.pageSize).toBe(12);
    expect(parsed.sort).toBe("featured");
    expect(parsed.q).toBe("oficina");
  });

  it("rejeita pageSize acima do limite", () => {
    expect(catalogQuerySchema.safeParse({ pageSize: 1000 }).success).toBe(false);
  });
});
