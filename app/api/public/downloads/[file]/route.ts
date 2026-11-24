import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { apiError } from "@/lib/api-response";

/**
 * Serve artefatos de demonstração (APK) armazenados em mobile/artifacts.
 * Em produção, as URLs de distribuição devem apontar para CDN/Storage real —
 * esta rota existe apenas para validar o fluxo local de download.
 */
export const dynamic = "force-dynamic";

const ALLOWED = new Set([
  "vixt-oficina-1.0.0-demo.apk",
  "vixt-barbearia-1.0.0-demo.apk",
]);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  if (!ALLOWED.has(file)) {
    return apiError("NOT_FOUND", "Arquivo não encontrado.", 404);
  }

  const filePath = path.join(process.cwd(), "mobile", "artifacts", file);
  const bytes = await readFile(filePath);

  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${file}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "public, max-age=3600",
    },
  });
}
