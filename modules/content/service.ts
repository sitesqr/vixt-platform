import { contentRepository } from "./repository";
import type { ContentDto, FaqDto } from "./types";

/** Conteúdo padrão usado somente enquanto o banco não possuir registro editado. */
export const DEFAULT_CONTENT: Record<string, { title: string; value: string }> = {
  "public.hero.title": {
    title: "Título principal",
    value: "Tecnologia que simplifica o seu dia a dia.",
  },
  "public.hero.subtitle": {
    title: "Subtítulo",
    value: "Conheça o ecossistema VIXT: aplicativos gratuitos para pessoais, profissionais e empresas.",
  },
  "public.about.title": { title: "Sobre", value: "Sobre a VIXT" },
  "public.about.text": {
    title: "Texto sobre",
    value: "A VIXT reúne soluções digitais desenvolvidas para facilitar atividades do cotidiano.",
  },
};

export const contentService = {
  async getPublicContent(): Promise<Record<string, ContentDto>> {
    const rows = await contentRepository.findManyPublic();
    const result: Record<string, ContentDto> = {};
    for (const [key, fallback] of Object.entries(DEFAULT_CONTENT)) {
      const row = rows.find((r) => r.key === key);
      result[key] = row
        ? { key, title: row.title, value: row.value, isDefault: false }
        : { key, title: fallback.title, value: fallback.value, isDefault: true };
    }
    return result;
  },
  async get(key: string): Promise<ContentDto | null> {
    const row = await contentRepository.findByKey(key);
    if (row) return { key, title: row.title, value: row.value, isDefault: row.isDefault };
    const fallback = DEFAULT_CONTENT[key];
    return fallback
      ? { key, title: fallback.title, value: fallback.value, isDefault: true }
      : null;
  },
  async listAdmin() {
    return contentRepository.findAll();
  },
  async save(key: string, title: string | null, value: string, adminId?: string) {
    return contentRepository.upsert(key, title, value, adminId);
  },
  async listFaqs(applicationId?: string): Promise<FaqDto[]> {
    const rows = await contentRepository.listFaqs(applicationId);
    return rows.map((f) => ({
      id: f.id,
      question: f.question,
      answer: f.answer,
      applicationId: f.applicationId,
    }));
  },
  async allFaqs() {
    return contentRepository.allFaqs();
  },
};
