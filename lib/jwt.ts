import { SignJWT, jwtVerify } from "jose";

const COOKIE_NAME = "vixt_admin_session";
const ALGORITHM = "HS256";

export interface AdminSessionPayload {
  sub: string; // admin id
  email: string;
  role: string;
  sessionId: string;
}

function getSecret(): Uint8Array {
  const secret = process.env.JWT_SECRET;
  if (!secret || secret.length < 32) {
    throw new Error("JWT_SECRET não configurado ou muito curto (mín. 32 caracteres).");
  }
  return new TextEncoder().encode(secret);
}

export async function signSessionToken(
  payload: AdminSessionPayload,
  ttlMinutes = 720,
): Promise<string> {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: ALGORITHM })
    .setIssuedAt()
    .setIssuer("vixt-central")
    .setAudience("vixt-admin")
    .setExpirationTime(`${ttlMinutes}m`)
    .sign(getSecret());
}

export async function verifySessionToken(
  token: string | undefined | null,
): Promise<AdminSessionPayload | null> {
  if (!token) return null;
  try {
    const { payload } = await jwtVerify(token, getSecret(), {
      algorithms: [ALGORITHM],
      issuer: "vixt-central",
      audience: "vixt-admin",
    });
    if (
      typeof payload.sub !== "string" ||
      typeof payload.email !== "string" ||
      typeof payload.role !== "string" ||
      typeof payload.sessionId !== "string"
    ) {
      return null;
    }
    return {
      sub: payload.sub,
      email: payload.email,
      role: payload.role,
      sessionId: payload.sessionId,
    };
  } catch {
    return null;
  }
}

export const sessionCookie = {
  name: COOKIE_NAME,
  options: {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax" as const,
    path: "/",
  },
};
