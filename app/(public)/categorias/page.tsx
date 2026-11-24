import Link from "next/link";
import type { Metadata } from "next";
import { FolderTree } from "lucide-react";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata: Metadata = {
  title: "Categorias",
  description: "Explore os aplicativos VIXT por categoria.",
};

export default async function CategoriesPage() {
  const categories = await safePublicQuery(() => categoriesService.listPublic(), []);
  return (
    <div className="vixt-container py-14">
      <p className="text-sm font-bold tracking-wider text-[#2563eb] uppercase">Categorias</p>
      <h1 className="mt-3 text-4xl font-black tracking-tight text-[#0b1220]">
        Explore por segmento
      </h1>
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((cat) => (
          <Link
            key={cat.id}
            href={`/aplicativos?category=${cat.slug}`}
            className="group vixt-card p-7 transition-all hover:-translate-y-1 hover:border-[#93c5fd]"
          >
            <span className="grid size-12 place-items-center rounded-xl bg-[#eff6ff] text-[#2563eb]">
              <FolderTree size={24} />
            </span>
            <h2 className="mt-5 text-xl font-extrabold text-[#0b1220]">{cat.name}</h2>
            <p className="mt-2 text-sm text-[#64748b]">{cat.description}</p>
            <p className="mt-5 text-sm font-bold text-[#2563eb]">
              {cat.appCount} aplicativo(s) →
            </p>
          </Link>
        ))}
        {!categories.length && (
          <p className="text-sm text-[#64748b]">Nenhuma categoria publicada.</p>
        )}
      </div>
    </div>
  );
}
