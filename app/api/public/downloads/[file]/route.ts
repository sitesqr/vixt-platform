import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { apiError } from "@/lib/api-response";

/** Serve os instaladores PWA (APKs leves) hospedados em mobile/artifacts. */
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "vixt-oficina-pwa-instalador.apk",
  "vixt-barbearia-pwa-instalador.apk",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!ALLOWED.has(file)) {
    return apiError("NOT_FOUND", "Arquivo não encontrado.", 404);
  }
  const bytes = await readFile(
    path.join(process.cwd(), "mobile", "artifacts", file),
  );
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
