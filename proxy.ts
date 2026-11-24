import { NextResponse, type NextRequest } from "next/server";
import { sessionCookie } from "@/lib/jwt";

/**
 * Proteção de primeira linha da área administrativa.
 * A validação criptográfica e a checagem da sessão no banco são feitas
 * novamente no servidor (lib/auth/session.ts + /api/admin/**).
 */
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(sessionCookie.name)?.value;
  const isLogin = pathname === "/admin/login";

  if (isLogin) {
    if (token) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.next();
  }

  if (!token) {
    const url = new URL("/admin/login", request.url);
    url.searchParams.set("next", pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin", "/admin/:path*", "/admin/login"],
};
