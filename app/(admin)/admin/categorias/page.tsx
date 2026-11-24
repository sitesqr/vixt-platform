import { SimpleManager } from "@/components/admin/simple-manager";
import { categoriesService } from "@/modules/categories";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Categorias" };

export default async function AdminCategoriesPage() {
  const categories = await safePublicQuery(() => categoriesService.listAdmin(), []);
  return (
    <SimpleManager
      title="Categorias"
      endpoint="/api/admin/categories"
      initialItems={categories.map((c) => ({
        id: c.id,
        title: c.name,
        subtitle: c.description ?? undefined,
        meta: `/${c.slug} · ${c._count.applications} aplicativo(s)`,
      }))}
      fields={[
        { name: "slug", label: "Slug", required: true },
        { name: "name", label: "Nome", required: true },
        { name: "description", label: "Descrição" },
        { name: "iconName", label: "Ícone (nome)" },
      ]}
    />
  );
}
