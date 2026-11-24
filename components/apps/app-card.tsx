import Link from "next/link";
import { ArrowUpRight, BadgeCheck, Sparkles } from "lucide-react";
import type { AppSummary } from "@/modules/applications";
import { Badge } from "@/components/ui/badge";

function AppIcon({ app }: { app: AppSummary }) {
  const initials = app.name
    .replace(/^VIXT\s*/i, "")
    .slice(0, 2)
    .toUpperCase();

  return (
    <span
      className="grid size-14 shrink-0 place-items-center rounded-2xl text-sm font-black text-white shadow-[0_8px_20px_-8px_rgba(15,23,42,0.5)]"
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
  );
}

export function AppCard({ app }: { app: AppSummary }) {
  return (
    <article className="group vixt-card relative flex flex-col p-6 transition-all duration-300 hover:-translate-y-1 hover:border-[#93c5fd] hover:shadow-[0_24px_60px_-20px_rgba(37,99,235,0.35)]">
      <div className="flex items-start justify-between gap-3">
        <AppIcon app={app} />
        <div className="flex flex-wrap justify-end gap-1.5">
          {app.isNew && (
            <Badge tone="green">
              <Sparkles size={11} /> Novo
            </Badge>
          )}
          {app.featured && <Badge tone="blue">Destaque</Badge>}
        </div>
      </div>

      <div className="mt-5 flex-1">
        {app.category && (
          <p className="text-xs font-bold tracking-wide text-[#2563eb] uppercase">
            {app.category.name}
          </p>
        )}
        <h3 className="mt-1.5 text-lg font-extrabold tracking-tight text-[#0b1220]">
          {app.name}
        </h3>
        <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#64748b]">
          {app.tagline}
        </p>
      </div>

      <div className="mt-6 flex items-center justify-between border-t border-[#e2e8f0] pt-4">
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#047857]">
          <BadgeCheck size={15} /> Gratuito
        </span>
        <Link
          href={`/aplicativos/${app.slug}`}
          className="inline-flex items-center gap-1 text-sm font-bold text-[#1d4ed8] transition-transform group-hover:translate-x-0.5"
        >
          Conhecer <ArrowUpRight size={16} />
        </Link>
      </div>
    </article>
  );
}
