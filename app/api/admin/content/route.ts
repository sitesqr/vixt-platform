import { apiSuccess, handleApiError } from "@/lib/api-response";
import { requireAdmin } from "@/lib/admin-guard";
import { contentService } from "@/modules/content";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const guard = await requireAdmin();
    if (guard.response) return guard.response;
    return apiSuccess({
      contents: await contentService.listAdmin(),
      faqs: await contentService.allFaqs(),
    });
  } catch (error) {
    return handleApiError(error);
  }
}
