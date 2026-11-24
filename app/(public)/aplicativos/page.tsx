import Link from "next/link";
import { ArrowLeft, ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import type { Metadata } from "next";
import { AppCard } from "@/components/apps/app-card";
import { applicationsService } from "@/modules/applications";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Aplicativos",
  description: "Conheça todos os aplicativos gratuitos do ecossistema VIXT.",
};

const sorts = [
  { value: "featured", label: "Destaques" },
  { value: "name", label: "Nome (A–Z)" },
  { value: "popular", label: "Mais populares" },
  { value: "recent", label: "Lançamentos" },
] as const;

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; category?: string; sort?: string; page?: string }>;
}) {
  const params = await searchParams;
  const sort = (sorts.find((s) => s.value === params.sort)?.value ?? "featured") as
    | "featured"
    | "name"
    | "popular"
    | "recent";
  const page = Math.max(1, Number(params.page) || 1);

  const [result, categories] = await Promise.all([
    safePublicQuery(
      () =>
        applicationsService.getCatalog({
          q: params.q,
          category: params.category,
          sort,
          page,
          pageSize: 12,
        }),
      { items: [], total: 0, page: 1, pageSize: 12, totalPages: 0 },
    ),
    safePublicQuery(() => categoriesService.listPublic(), []),
  ]);

  function hrefWith(next: Partial<{ q: string; category: string; sort: string; page: number }>) {
    const sp = new URLSearchParams();
    const q = next.q !== undefined ? next.q : params.q;
    const category = next.category !== undefined ? next.category : params.category;
    const s = next.sort !== undefined ? next.sort : sort;
    const p = next.page !== undefined ? next.page : page;
    if (q) sp.set("q", q);
    if (category) sp.set("category", category);
    if (s && s !== "featured") sp.set("sort", s);
    if (p > 1) sp.set("page", String(p));
    return `/aplicativos${sp.size ? `?${sp}` : ""}`;
  }

  return (
    <div className="vixt-container py-14">
      <div className="max-w-2xl">
        <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">Catálogo</p>
        <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0b1220]">
          Aplicativos VIXT
        </h1>
        <p className="mt-4 text-[#64748b]">
          Encontre soluções gratuitas por nome, segmento ou categoria.
        </p>
      </div>

      <div className="vixt-card mt-10 space-y-4 p-5">
        <form className="flex flex-col gap-3 sm:flex-row" action="/aplicativos" method="GET">
          <div className="relative flex-1">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[#94a3b8]" />
            <input
              name="q"
              defaultValue={params.q}
              placeholder="Pesquisar aplicativo..."
              className="h-11 w-full rounded-xl border border-[#cbd5e1] pl-11 pr-4 text-sm focus:border-[#2f6bff] focus:outline-none"
            />
          </div>
          <input type="hidden" name="category" value={params.category ?? ""} />
          <input type="hidden" name="sort" value={sort} />
          <button className="inline-flex h-11 items-center justify-center rounded-xl bg-[#2f6bff] px-6 text-sm font-semibold text-white hover:bg-[#2563eb]">
            Buscar
          </button>
        </form>

        <div className="flex flex-wrap items-center gap-2 border-t border-[#e2e8f0] pt-4">
          <span className="inline-flex items-center gap-1.5 text-xs font-bold text-[#64748b] uppercase">
            <SlidersHorizontal size={14} /> Filtros
          </span>
          <Link
            href={hrefWith({ category: "" })}
            className={`rounded-full px-3 py-1.5 text-xs font-semibold ${!params.category ? "bg-[#0b1220] text-white" : "bg-[#f1f5f9] text-[#475569]"}`}
          >
            Todos
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat.id}
              href={hrefWith({ category: cat.slug, page: 1 })}
              className={`rounded-full px-3 py-1.5 text-xs font-semibold ${
                params.category === cat.slug
                  ? "bg-[#0b1220] text-white"
                  : "bg-[#f1f5f9] text-[#475569] hover:bg-[#e2e8f0]"
              }`}
            >
              {cat.name}
            </Link>
          ))}
        </div>

        <div className="flex flex-wrap gap-2 border-t border-[#e2e8f0] pt-4">
          <span className="text-xs font-bold text-[#64748b] uppercase">Ordenar:</span>
          {sorts.map((s) => (
            <Link
              key={s.value}
              href={hrefWith({ sort: s.value, page: 1 })}
              className={`rounded-lg px-3 py-1.5 text-xs font-semibold ${
                sort === s.value ? "bg-[#eff6ff] text-[#1d4ed8]" : "text-[#64748b] hover:bg-[#f8fafc]"
              }`}
            >
              {s.label}
            </Link>
          ))}
        </div>
      </div>

      <p className="mt-6 text-sm text-[#64748b]">
        {result.total} aplicativo(s) encontrado(s)
      </p>

      {result.items.length ? (
        <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {result.items.map((app) => (
            <AppCard key={app.id} app={{ ...app, isNew: false, recentlyUpdated: false, free: true }} />
          ))}
        </div>
      ) : (
        <div className="vixt-card mt-5 border-dashed p-12 text-center">
          <p className="font-semibold text-[#1e293b]">Nenhum aplicativo encontrado.</p>
          <p className="mt-2 text-sm text-[#64748b]">
            Tente outros termos ou remova os filtros aplicados.
          </p>
        </div>
      )}

      {result.totalPages > 1 && (
        <div className="mt-10 flex items-center justify-center gap-3">
          {page > 1 && (
            <Link href={hrefWith({ page: page - 1 })} className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold">
              <ArrowLeft size={16} /> Anterior
            </Link>
          )}
          <span className="text-sm text-[#64748b]">Página {page} de {result.totalPages}</span>
          {page < result.totalPages && (
            <Link href={hrefWith({ page: page + 1 })} className="inline-flex items-center gap-2 rounded-xl border border-[#e2e8f0] bg-white px-4 py-2 text-sm font-semibold">
              Próxima <ArrowRight size={16} />
            </Link>
          )}
        </div>
      )}
    </div>
  );
}
