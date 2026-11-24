import { apiSuccess, handleApiError } from "@/lib/api-response";
import { getSession } from "@/modules/auth/session";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const admin = await getSession();
    if (!admin) return apiSuccess({ authenticated: false, admin: null });
    return apiSuccess({ authenticated: true, admin });
  } catch (error) {
    return handleApiError(error);
  }
}
