import { NextRequest } from "next/server";
import { apiError, apiSuccess, handleApiError } from "@/lib/api-response";
import { catalogQuerySchema } from "@/lib/validation";
import { applicationsService } from "@/modules/applications";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const params = Object.fromEntries(request.nextUrl.searchParams.entries());
    const query = catalogQuerySchema.safeParse(params);
    if (!query.success) {
      return apiError("BAD_REQUEST", "Parâmetros inválidos.", 400, query.error.issues);
    }
    const result = await safePublicQuery(
      () => applicationsService.getCatalog(query.data),
      null,
    );
    if (result === null) {
      return apiError(
        "DATABASE_UNAVAILABLE",
        "Catálogo temporariamente indisponível.",
        503,
      );
    }
    return apiSuccess(result, {
      headers: { "Cache-Control": "public, s-maxage=60, stale-while-revalidate=300" },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
