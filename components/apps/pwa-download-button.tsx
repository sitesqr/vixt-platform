import { Smartphone } from "lucide-react";

/**
 * Botão de instalação PWA do aplicativo.
 * Abre a PWA do próprio aplicativo, onde o navegador oferece a instalação
 * na tela inicial do celular. Sem APK, sem arquivos e sem cobrança.
 */
export function PwaDownloadButton({
  url,
  appName,
}: {
  url: string;
  appName: string;
}) {
  return (
    <div className="mt-6 border-t border-[#e2e8f0] pt-5">
      <p className="text-xs font-bold tracking-wide text-[#64748b] uppercase">
        Celular
      </p>
      <a
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 flex min-h-12 items-center gap-3 rounded-xl bg-[#0b1220] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1e293b]"
        aria-label={`Baixar ${appName} no celular`}
      >
        <Smartphone size={18} className="shrink-0 text-[#60a5fa]" />
        <span className="flex-1 text-left">Baixar no celular (PWA)</span>
        <span className="rounded-full bg-white/10 px-2 py-0.5 text-[10px] font-bold uppercase">
          Grátis
        </span>
      </a>
      <p className="mt-2 text-xs leading-5 text-[#94a3b8]">
        Abre o aplicativo no navegador. Use “Adicionar à tela inicial” para
        instalá-lo no seu celular.
      </p>
    </div>
  );
}
