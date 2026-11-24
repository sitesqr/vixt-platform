import { SimpleManager } from "@/components/admin/simple-manager";
import { bannersService } from "@/modules/banners";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Banners" };

export default async function AdminBannersPage() {
  const banners = await safePublicQuery(() => bannersService.listAdmin(), []);
  return (
    <SimpleManager
      title="Banners"
      endpoint="/api/admin/banners"
      initialItems={banners.map((b) => ({
        id: b.id,
        title: b.title,
        subtitle: b.subtitle ?? undefined,
        meta: b.active ? "Ativo" : "Inativo",
      }))}
      fields={[
        { name: "title", label: "Título", required: true },
        { name: "subtitle", label: "Subtítulo" },
        { name: "imageUrl", label: "URL da imagem" },
        { name: "ctaLabel", label: "Texto do botão" },
        { name: "ctaUrl", label: "URL do botão" },
      ]}
    />
  );
}
