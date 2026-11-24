import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const categories = await safePublicQuery(
      () => categoriesService.listPublic(),
      null,
    );
    if (categories === null) {
      return apiError(
        "DATABASE_UNAVAILABLE",
        "Catálogo temporariamente indisponível.",
        503,
      );
    }
    return apiSuccess(categories, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
