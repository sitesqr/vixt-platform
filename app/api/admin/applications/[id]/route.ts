import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { applicationsService } from "@/modules/applications";
import { createHash } from "node:crypto";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

type Params = { params: Promise<{ id: string }> };

function isUuid(value: string) {
  return /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(value);
}

async function audit(input: {
  adminId: string;
  action: string;
  entityId: string;
  request: NextRequest;
}) {
  await prisma.auditLog.create({
    data: {
      adminId: input.adminId,
      action: input.action,
      entityType: "Application",
      entityId: input.entityId,
      ipHash: createHash("sha256")
        .update(input.request.headers.get("x-forwarded-for") ?? "unknown")
        .digest("hex")
        .slice(0, 64),
    },
  });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { id } = await params;
    if (!isUuid(id)) return apiError("BAD_REQUEST", "ID inválido.", 400);

    const body = await request.json().catch(() => null);
    if (!body || typeof body !== "object") {
      return apiError("BAD_REQUEST", "Dados inválidos.", 400);
    }
    const allowed = [
      "slug", "name", "tagline", "description", "objective", "targetAudience",
      "advantages", "requirements", "platforms", "supportEmail", "supportUrl",
      "categoryId", "iconUrl", "accentColor", "status", "published",
      "featured", "sortOrder", "releasedAt",
    ] as const;
    const data: Record<string, unknown> = {};
    for (const key of allowed) {
      if (key in body) data[key] = (body as Record<string, unknown>)[key];
    }
    if (data.slug && typeof data.slug === "string" && !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(data.slug)) {
      return apiError("BAD_REQUEST", "Slug inválido.", 400);
    }
    if (data.releasedAt && typeof data.releasedAt === "string") {
      data.releasedAt = new Date(data.releasedAt);
    }

    const app = await applicationsService.update(id, data);
    await audit({
      adminId: guard.admin.id,
      action: "application.updated",
      entityId: id,
      request,
    });
    return apiSuccess(app);
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: Params) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const { id } = await params;
    if (!isUuid(id)) return apiError("BAD_REQUEST", "ID inválido.", 400);

    await applicationsService.remove(id);
    await audit({
      adminId: guard.admin.id,
      action: "application.deleted",
      entityId: id,
      request,
    });
    return apiSuccess({ deleted: true });
  } catch (error) {
    return handleApiError(error);
  }
}
