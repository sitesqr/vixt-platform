import { z } from "zod";

/** Slug de URL: minúsculas, números e hífens. */
export const slugSchema = z
  .string()
  .min(2)
  .max(100)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug inválido.");

export const emailSchema = z.string().email().max(180);

/** Senha forte: mínimo 12 caracteres, maiúscula, minúscula, número e símbolo. */
export const passwordSchema = z
  .string()
  .min(12, "A senha deve ter no mínimo 12 caracteres.")
  .max(128)
  .regex(/[A-Z]/, "Inclua uma letra maiúscula.")
  .regex(/[a-z]/, "Inclua uma letra minúscula.")
  .regex(/[0-9]/, "Inclua um número.")
  .regex(/[^A-Za-z0-9]/, "Inclua um símbolo.");

export const urlSchema = z
  .string()
  .url()
  .max(800)
  .refine((v) => v.startsWith("https://") || v.startsWith("http://"), {
    message: "A URL deve usar http ou https.",
  });

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1).max(128),
});

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  pageSize: z.coerce.number().int().min(1).max(48).default(12),
});

export const catalogQuerySchema = paginationSchema.extend({
  q: z.string().trim().max(120).optional(),
  category: slugSchema.optional(),
  sort: z
    .enum(["name", "popular", "recent", "featured"])
    .default("featured"),
});

export function safeJsonStringArray(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value.filter((item): item is string => typeof item === "string");
}
