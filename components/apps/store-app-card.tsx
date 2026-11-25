import Link from "next/link";
import { ArrowUpRight, Download, Star } from "lucide-react";
import type { AppSummary } from "@/modules/applications";
import { Badge } from "@/components/ui/badge";

/**
 * Card da vitrine estilo loja de aplicativos. Mostra o ícone do app e um botão
 * de instalação que abre a PWA do próprio aplicativo (sem APK e sem arquivos).
 */
export function StoreAppCard({ app }: { app: AppSummary }) {
  const initials = app.name
    .replace(/^VIXT\s*/i, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <article className="group vixt-card flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#93c5fd] hover:shadow-[0_24px_60px_-20px_rgba(37,99,235,0.35)]">
      <div className="flex items-start gap-4">
        <span
          className="grid size-16 shrink-0 place-items-center rounded-2xl text-base font-black text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)]"
          style={{
            background: app.accentColor
              ? `linear-gradient(135deg, ${app.accentColor}, #2563eb)`
              : "linear-gradient(135deg, #2f6bff, #06b6d4)",
          }}
          aria-hidden="true"
        >
          {app.iconUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={app.iconUrl} alt="" className="size-full rounded-2xl object-cover" />
          ) : (
            initials
          )}
        </span>

        <div className="min-w-0 flex-1">
          {app.category && (
            <p className="text-xs font-bold tracking-wide text-[#2563eb] uppercase">
              {app.category.name}
            </p>
          )}
          <h3 className="truncate text-lg font-extrabold tracking-tight text-[#0b1220]">
            {app.name}
          </h3>
          <p className="mt-0.5 text-xs font-semibold text-[#64748b]">VIXT</p>
          <div className="mt-1.5 flex items-center gap-1 text-xs text-[#64748b]">
            <Star size={12} className="fill-[#f59e0b] text-[#f59e0b]" />
            <span>Gratuito</span>
            {app.isNew && <Badge tone="green">Novo</Badge>}
          </div>
        </div>
      </div>

      <p className="mt-4 line-clamp-2 text-sm leading-6 text-[#475569]">
        {app.tagline}
      </p>

      <div className="mt-5 flex items-center gap-3 border-t border-[#e2e8f0] pt-4">
        {app.pwaUrl ? (
          <a
            href={app.pwaUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#1d4ed8] px-4 text-sm font-bold text-white transition-colors hover:bg-[#1e40af]"
            aria-label={`Instalar ${app.name}`}
          >
            <Download size={16} /> Instalar
          </a>
        ) : (
          <Link
            href={`/aplicativos/${app.slug}`}
            className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-xl bg-[#eff6ff] px-4 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
          >
            Saiba mais <ArrowUpRight size={16} />
          </Link>
        )}
        <Link
          href={`/aplicativos/${app.slug}`}
          className="grid size-10 shrink-0 place-items-center rounded-xl border border-[#e2e8f0] text-[#475569] transition-colors hover:border-[#93c5fd] hover:text-[#1d4ed8]"
          aria-label={`Ver detalhes de ${app.name}`}
        >
          <ArrowUpRight size={18} />
        </Link>
      </div>
    </article>
  );
}
