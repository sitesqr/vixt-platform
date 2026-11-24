import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { bannersService } from "@/modules/banners";
import { urlSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().min(2).max(200),
  subtitle: z.string().optional(),
  imageUrl: urlSchema.optional(),
  ctaLabel: z.string().max(100).optional(),
  ctaUrl: urlSchema.optional(),
  applicationId: z.string().uuid().optional(),
  active: z.boolean().optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    return apiSuccess(await bannersService.listAdmin());
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400, parsed.error.issues);
    }
    return apiSuccess(await bannersService.create(parsed.data), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
