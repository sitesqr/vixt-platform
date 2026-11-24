import { ContentEditor } from "@/components/admin/content-editor";
import { contentService } from "@/modules/content";
import { safePublicQuery } from "@/lib/safe-data";

export const dynamic = "force-dynamic";
export const metadata = { title: "Conteúdo" };

export default async function AdminContentPage() {
  const [contents, faqs] = await Promise.all([
    safePublicQuery(() => contentService.listAdmin(), []),
    safePublicQuery(() => contentService.allFaqs(), []),
  ]);
  return (
    <ContentEditor
      contents={contents.map((c) => ({ key: c.key, title: c.title, value: c.value, isDefault: c.isDefault }))}
      faqs={faqs.map((f) => ({ id: f.id, question: f.question, answer: f.answer }))}
    />
  );
}
