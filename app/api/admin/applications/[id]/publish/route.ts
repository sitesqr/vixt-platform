import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { applicationsService } from "@/modules/applications";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { id } = await params;

    const check = await applicationsService.canPublish(id);
    if (!check.ok) return apiError("BAD_REQUEST", check.reason ?? "Não é possível publicar.", 400);

    const app = await applicationsService.update(id, { published: true });
    await prisma.auditLog.create({
      data: {
        adminId: guard.admin.id,
        action: "application.published",
        entityType: "Application",
        entityId: id,
      },
    });
    return apiSuccess(app);
  } catch (error) {
    return handleApiError(error);
  }
}
