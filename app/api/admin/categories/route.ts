import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { categoriesService } from "@/modules/categories";
import { slugSchema } from "@/lib/validation";

export const dynamic = "force-dynamic";

const schema = z.object({
  slug: slugSchema,
  name: z.string().min(2).max(100),
  description: z.string().optional(),
  iconName: z.string().max(60).optional(),
  sortOrder: z.number().int().optional(),
});

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    return apiSuccess(await categoriesService.listAdmin());
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
    return apiSuccess(await categoriesService.create(parsed.data), { status: 201 });
  } catch (error) {
    return handleApiError(error);
  }
}
