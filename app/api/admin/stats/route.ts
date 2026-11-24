import { NextRequest } from "next/server";
import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { statsRepository } from "@/modules/stats";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    const raw = Number(request.nextUrl.searchParams.get("days") ?? 30);
    const days = Number.isFinite(raw) ? Math.min(365, Math.max(1, raw)) : 30;
    return apiSuccess(await statsRepository.getDashboard(days), {
      headers: { "Cache-Control": "no-store" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
