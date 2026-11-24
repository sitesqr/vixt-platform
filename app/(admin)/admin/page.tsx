import Link from "next/link";
import { ArrowUpRight, Blocks, Download, Eye, FolderTree, MousePointerClick, Plus } from "lucide-react";
import { StatsClient } from "@/components/admin/stats-client";
import { statsRepository } from "@/modules/stats";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";

export const metadata = { title: "Visão geral" };

const empty = {
  totals: {
    applications: 0,
    published: 0,
    development: 0,
    categories: 0,
    views: 0,
    clicks: 0,
    downloads: 0,
  },
  topViewed: [],
  topDownloaded: [],
  timeline: [],
  recentActivity: [],
  newPublished: [],
};

export default async function AdminDashboard() {
  const stats = await safePublicQuery(() => statsRepository.getDashboard(30), empty);

  const cards = [
    { label: "Aplicativos", value: stats.totals.applications, icon: Blocks, href: "/admin/aplicativos" },
    { label: "Publicados", value: stats.totals.published, icon: ArrowUpRight, href: "/admin/aplicativos" },
    { label: "Em desenvolvimento", value: stats.totals.development, icon: Blocks, href: "/admin/aplicativos" },
    { label: "Categorias", value: stats.totals.categories, icon: FolderTree, href: "/admin/categorias" },
    { label: "Visualizações", value: stats.totals.views, icon: Eye, href: "/admin/estatisticas" },
    { label: "Cliques", value: stats.totals.clicks, icon: MousePointerClick, href: "/admin/estatisticas" },
    { label: "Downloads", value: stats.totals.downloads, icon: Download, href: "/admin/estatisticas" },
  ];

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black tracking-tight text-[#0b1220]">Visão geral</h2>
          <p className="mt-1 text-sm text-[#64748b]">Indicadores dos últimos 30 dias.</p>
        </div>
        <Link
          href="/admin/aplicativos"
          className="inline-flex h-10 items-center gap-2 rounded-xl bg-[#2f6bff] px-4 text-sm font-semibold text-white hover:bg-[#2563eb]"
        >
          <Plus size={17} /> Novo aplicativo
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-[#e2e8f0] bg-white p-5 transition-shadow hover:shadow-lg"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-[#64748b]">{card.label}</span>
              <card.icon size={17} className="text-[#2f6bff]" />
            </div>
            <p className="mt-3 text-3xl font-black tracking-tight text-[#0b1220]">
              {card.value.toLocaleString("pt-BR")}
            </p>
          </Link>
        ))}
      </div>

      <StatsClient timeline={stats.timeline} topViewed={stats.topViewed} />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <h3 className="font-extrabold text-[#0b1220]">Atividade recente</h3>
          {stats.recentActivity.length ? (
            <ul className="mt-4 divide-y divide-[#e2e8f0]">
              {stats.recentActivity.map((a) => (
                <li key={a.id} className="py-3 text-sm">
                  <p className="font-semibold text-[#1e293b]">{a.action}</p>
                  <p className="text-xs text-[#94a3b8]">
                    {a.entityType} · {a.adminName ?? "sistema"} ·{" "}
                    {new Date(a.createdAt).toLocaleString("pt-BR")}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#94a3b8]">Nenhuma atividade registrada.</p>
          )}
        </section>

        <section className="rounded-2xl border border-[#e2e8f0] bg-white p-6">
          <h3 className="font-extrabold text-[#0b1220]">Novos aplicativos publicados</h3>
          {stats.newPublished.length ? (
            <ul className="mt-4 divide-y divide-[#e2e8f0]">
              {stats.newPublished.map((a) => (
                <li key={a.id} className="flex items-center justify-between py-3">
                  <span className="text-sm font-semibold text-[#1e293b]">{a.name}</span>
                  <Link href={`/aplicativos/${a.slug}`} className="text-xs font-bold text-[#2563eb]">
                    Ver →
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 text-sm text-[#94a3b8]">Nenhuma publicação recente.</p>
          )}
        </section>
      </div>
    </div>
  );
}
