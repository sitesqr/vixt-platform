import { NextResponse } from "next/server";

/**
 * Distribuição via APK foi descontinuada: o Android exibe o aviso do Google
 * Play Protect para sideload. Os aplicativos agora são instalados como PWA.
 * Esta rota retorna 410 (Gone) para qualquer arquivo, inclusive links antigos.
 */
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: {
        code: "GONE",
        message:
          "Downloads APK foram descontinuados. Instale o aplicativo como PWA pelo navegador.",
      },
    },
    { status: 410 },
  );
}
