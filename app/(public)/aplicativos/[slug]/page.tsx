import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CheckCircle2,
  Download,
  ExternalLink,
  Globe,
  Monitor,
  Smartphone,
  Wrench,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { applicationsService } from "@/modules/applications";
import { safePublicQuery } from "@/lib/safe-data";
import { trackEvent, hashSession, newSessionId } from "@/lib/analytics";
import { cookies } from "next/headers";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const app = await safePublicQuery(() => applicationsService.getBySlug(slug), null);
  if (!app) return { title: "Aplicativo não encontrado" };
  return {
    title: app.name,
    description: app.tagline,
    openGraph: {
      title: `${app.name} | VIXT`,
      description: app.tagline,
      type: "website",
      images: app.images.filter((i) => i.kind === "COVER").map((i) => ({ url: i.url })),
    },
  };
}

const typeIcon: Record<string, typeof Globe> = {
  WEB: Globe,
  PLAY_STORE: Smartphone,
  APK: Download,
  PWA: Monitor,
  DESKTOP: Monitor,
  OTHER: ExternalLink,
};

export default async function AppDetailPage({ params }: Props) {
  const { slug } = await params;
  const app = await safePublicQuery(() => applicationsService.getBySlug(slug), null);
  if (!app) notFound();

  const store = await cookies();
  const sid = store.get("vixt_sid")?.value ?? newSessionId();
  void trackEvent({ type: "VIEW", applicationId: app.id, sessionHash: hashSession(sid) });

  const cover = app.images.find((i) => i.kind === "COVER");
  const shots = app.images.filter((i) => i.kind === "SCREENSHOT");

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: app.name,
    description: app.description,
    applicationCategory: app.category?.name ?? "BusinessApplication",
    operatingSystem: app.platforms.join(", ") || "Web",
    offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    url: `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/aplicativos/${app.slug}`,
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="border-b border-[#e2e8f0] bg-white">
        <div className="vixt-container py-12">
          <Link href="/aplicativos" className="inline-flex items-center gap-2 text-sm font-semibold text-[#64748b] hover:text-[#2563eb]">
            <ArrowLeft size={16} /> Voltar ao catálogo
          </Link>

          <div className="mt-8 grid gap-10 lg:grid-cols-[1fr_360px] lg:items-start">
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span
                  className="grid size-16 place-items-center rounded-2xl text-lg font-black text-white"
                  style={{ background: `linear-gradient(135deg, ${app.accentColor ?? "#2f6bff"}, #2563eb)` }}
                >
                  {app.name.replace(/^VIXT\s*/i, "").slice(0, 2).toUpperCase()}
                </span>
                <div>
                  <div className="flex flex-wrap gap-2">
                    {app.category && <Badge tone="blue">{app.category.name}</Badge>}
                    <Badge tone="green">Gratuito</Badge>
                    {app.isNew && <Badge tone="amber">Novo</Badge>}
                  </div>
                  <h1 className="mt-2 text-3xl font-black tracking-tight text-[#0b1220] sm:text-4xl">
                    {app.name}
                  </h1>
                </div>
              </div>

              <p className="mt-6 text-lg leading-8 text-[#475569]">{app.description}</p>

              {app.objective && (
                <section className="mt-10">
                  <h2 className="text-xl font-extrabold text-[#0b1220]">Objetivo do sistema</h2>
                  <p className="mt-3 leading-7 text-[#475569]">{app.objective}</p>
                </section>
              )}

              {app.targetAudience && (
                <section className="mt-8">
                  <h2 className="text-xl font-extrabold text-[#0b1220]">Público-alvo</h2>
                  <p className="mt-3 leading-7 text-[#475569]">{app.targetAudience}</p>
                </section>
              )}

              {app.features.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-xl font-extrabold text-[#0b1220]">Principais funcionalidades</h2>
                  <div className="mt-5 grid gap-3 sm:grid-cols-2">
                    {app.features.map((f, i) => (
                      <div key={i} className="flex gap-3 rounded-xl border border-[#e2e8f0] p-4">
                        <CheckCircle2 size={19} className="mt-0.5 shrink-0 text-[#2563eb]" />
                        <div>
                          <p className="font-bold text-[#1e293b]">{f.title}</p>
                          {f.description && <p className="mt-1 text-sm text-[#64748b]">{f.description}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>
              )}

              {app.advantages.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-xl font-extrabold text-[#0b1220]">Vantagens</h2>
                  <ul className="mt-4 space-y-2">
                    {app.advantages.map((a, i) => (
                      <li key={i} className="flex items-center gap-2 text-[#475569]">
                        <CheckCircle2 size={17} className="text-[#16a34a]" /> {a}
                      </li>
                    ))}
                  </ul>
                </section>
              )}

              {shots.length > 0 && (
                <section className="mt-10">
                  <h2 className="text-xl font-extrabold text-[#0b1220]">Capturas do sistema</h2>
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {shots.map((img, i) => (
                      <figure key={i} className="overflow-hidden rounded-2xl border border-[#e2e8f0]">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={img.url} alt={img.alt} className="aspect-video w-full object-cover" loading="lazy" />
                        {img.caption && <figcaption className="p-3 text-xs text-[#64748b]">{img.caption}</figcaption>}
                      </figure>
                    ))}
                  </div>
                </section>
              )}
            </div>

            <aside className="vixt-card sticky top-24 p-6">
              <p className="text-xs font-bold tracking-wide text-[#64748b] uppercase">Distribuição</p>
              <div className="mt-4 space-y-2">
                {app.distributions.length ? (
                  app.distributions.map((d) => {
                    const Icon = typeIcon[d.type] ?? ExternalLink;
                    return (
                      <a
                        key={d.id}
                        href={`/api/public/redirect/${d.id}`}
                        target="_blank"
                        rel="noopener noreferrer nofollow"
                        className="flex h-12 items-center gap-3 rounded-xl bg-[#eff6ff] px-4 text-sm font-bold text-[#1d4ed8] transition-colors hover:bg-[#dbeafe]"
                      >
                        <Icon size={18} /> {d.label}
                      </a>
                    );
                  })
                ) : (
                  <p className="text-sm text-[#94a3b8]">Nenhum link de distribuição ativo.</p>
                )}
              </div>

              {app.platforms.length > 0 && (
                <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                  <p className="text-xs font-bold text-[#64748b] uppercase">Plataformas</p>
                  <p className="mt-2 text-sm text-[#1e293b]">{app.platforms.join(" · ")}</p>
                </div>
              )}

              {app.versions.length > 0 && (
                <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                  <p className="text-xs font-bold text-[#64748b] uppercase">Versão atual</p>
                  <p className="mt-2 text-sm font-bold text-[#0b1220]">
                    {app.versions.find((v) => v.status === "PUBLISHED")?.version ?? app.versions[0].version}
                  </p>
                  {app.versions[0].releasedAt && (
                    <p className="text-xs text-[#94a3b8]">
                      Atualizado em {new Date(app.versions[0].releasedAt).toLocaleDateString("pt-BR")}
                    </p>
                  )}
                  <details className="mt-4">
                    <summary className="cursor-pointer text-sm font-semibold text-[#2563eb]">
                      Histórico de versões
                    </summary>
                    <div className="mt-3 space-y-3">
                      {app.versions.map((v) => (
                        <div key={v.version} className="rounded-lg bg-[#f8fafc] p-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-bold text-[#0b1220]">v{v.version}</span>
                            <Badge tone={v.status === "PUBLISHED" ? "green" : "gray"}>{v.status}</Badge>
                          </div>
                          {v.changelog && <p className="mt-1 text-xs text-[#64748b]">{v.changelog}</p>}
                          {v.releasedAt && (
                            <p className="mt-1 text-[11px] text-[#94a3b8]">
                              {new Date(v.releasedAt).toLocaleDateString("pt-BR")}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </details>
                </div>
              )}

              {app.requirements.length > 0 && (
                <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                  <p className="text-xs font-bold text-[#64748b] uppercase">Requisitos técnicos</p>
                  <ul className="mt-2 space-y-1 text-sm text-[#475569]">
                    {app.requirements.map((r, i) => <li key={i}>• {r}</li>)}
                  </ul>
                </div>
              )}

              {(app.supportEmail || app.supportUrl) && (
                <div className="mt-6 border-t border-[#e2e8f0] pt-5">
                  <p className="flex items-center gap-2 text-xs font-bold text-[#64748b] uppercase">
                    <Wrench size={14} /> Suporte
                  </p>
                  {app.supportEmail && <p className="mt-2 text-sm text-[#2563eb]">{app.supportEmail}</p>}
                  {app.supportUrl && (
                    <a href={app.supportUrl} target="_blank" rel="noopener noreferrer nofollow" className="text-sm text-[#2563eb] hover:underline">
                      Página de suporte ↗
                    </a>
                  )}
                </div>
              )}

              {cover && (
                <figure className="mt-6 overflow-hidden rounded-xl">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={cover.url} alt={cover.alt} className="w-full object-cover" />
                </figure>
              )}
            </aside>
          </div>
        </div>
      </div>
    </>
  );
}
