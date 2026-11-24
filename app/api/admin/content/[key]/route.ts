import { NextRequest } from "next/server";
import { z } from "zod";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { contentService } from "@/modules/content";

export const dynamic = "force-dynamic";

const schema = z.object({
  title: z.string().max(200).nullable().optional(),
  value: z.string().min(1),
});

export async function PUT(request: NextRequest, { params }: { params: Promise<{ key: string }> }) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { key } = await params;
    const parsed = schema.safeParse(await request.json().catch(() => null));
    if (!parsed.success) {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400, parsed.error.issues);
    }
    const row = await contentService.save(
      key,
      parsed.data.title ?? null,
      parsed.data.value,
      guard.admin.id,
    );
    return apiSuccess(row);
  } catch (error) {
    return handleApiError(error);
  }
}
