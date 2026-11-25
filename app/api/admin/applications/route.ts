import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { applicationsService } from "@/modules/applications";
import { slugSchema, urlSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const createSchema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(120),
  tagline: z.string().min(5).max(500),
  description: z.string().min(10),
  objective: z.string().optional(),
  targetAudience: z.string().optional(),
  advantages: z.array(z.string()).optional(),
  requirements: z.array(z.string()).optional(),
  platforms: z.array(z.string()).optional(),
  supportEmail: z.string().email().optional(),
  supportUrl: urlSchema.optional(),
  pwaUrl: urlSchema.optional(),
  categoryId: z.string().uuid().optional(),
  iconUrl: urlSchema.optional(),
  accentColor: z
    .string()
    .regex(/^#[0-9A-Fa-f]{6}$/)
    .optional(),
  status: z
    .enum(["DEVELOPMENT", "TESTING", "AVAILABLE", "MAINTENANCE", "DISCONTINUED"])
    .optional(),
  published: z.boolean().optional(),
  featured: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
  releasedAt: z.string().datetime().optional(),
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const apps = await applicationsService.listAdmin();
    return apiSuccess(apps, { headers: { "Cache-Control": "no-store" } });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;

    const body = await request.json().catch(() => null);
    const parsed = createSchema.safeParse(body);
    if (!parsed.success) {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400, parsed.error.issues);
    }
    const data = {
      ...parsed.data,
      releasedAt: parsed.data.releasedAt
        ? new Date(parsed.data.releasedAt)
        : undefined,
    };
    const app = await applicationsService.create(data);
    return apiSuccess(app, { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
