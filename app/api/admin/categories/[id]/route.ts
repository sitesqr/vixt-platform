import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { categoriesService } from "@/modules/categories";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { id } = await params;
    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400);
    }
    const allowed = ["slug", "name", "description", "iconName", "sortOrder", "active"];
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = (body as Record<string, unknown>)[key];
    }
    return apiSuccess(await categoriesService.update(id, data));
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { id } = await params;
    await categoriesService.remove(id);
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
