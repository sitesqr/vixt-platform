import { apiSuccess, handleApiError } from "@/lib/api-response";
import { sessionCookie } from "@/lib/jwt";
import { getSession } from "@/modules/auth/session";
import { authService } from "@/modules/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  try {
    const admin = await getSession();
    await authService.logout(admin, undefined);
    const response = apiSuccess({ loggedOut: true });
    response.cookies.delete(sessionCookie.name);
    return response;
  } catch (error) {
    return handleApiError(error);
  }
}
