import { NextResponse } from "next/server";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { apiError } from "@/lib/api-response";

/**
 * Serve os instaladores PWA (APKs leves) hospedados em mobile/artifacts.
 * Cada versão tem um nome de arquivo único — evita o diálogo
 * "Baixar o arquivo novamente?" do Chrome.
 */
export const dynamic = "force-dynamic";

const FILES: Record<string, { source: string; display: string }> = {
  "vixt-oficina-instalador-v1.apk": {
    source: "vixt-oficina-pwa-instalador.apk",
    display: "VIXT-Oficina-Instalador-v1.apk",
  },
  "vixt-barbearia-instalador-v1.apk": {
    source: "vixt-barbearia-pwa-instalador.apk",
    display: "VIXT-Barbearia-Instalador-v1.apk",
  },
};

export async function GET(
  request: Request,
  { params }: { params: Promise<{ file: string }> },
) {
  const { file } = await params;
  const entry = FILES[file];
  if (!entry) return apiError("NOT_FOUND", "Arquivo não encontrado.", 404);

  const bytes = await readFile(
    path.join(process.cwd(), "mobile", "artifacts", entry.source),
  );

  // Sem cache: cada clique gera um download novo, com nome único.
  void request;
  return new NextResponse(new Uint8Array(bytes), {
    headers: {
      "Content-Type": "application/vnd.android.package-archive",
      "Content-Disposition": `attachment; filename="${entry.display}"`,
      "Content-Length": String(bytes.length),
      "Cache-Control": "no-store, no-cache, must-revalidate",
      "X-Content-Type-Options": "nosniff",
    },
  });
}
