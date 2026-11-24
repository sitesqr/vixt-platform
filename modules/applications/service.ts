import { applicationsRepository } from "./repository";
import { safeJsonStringArray } from "@/lib/validation";
import type {
  AppDetail,
  AppRow,
  AppSummary,
  CatalogFilters,
  CatalogResult,
  CreateApplicationInput,
  DistributionButton,
  UpdateApplicationInput,
} from "./types";

const NEW_DAYS = 30;
const UPDATED_DAYS = 45;

function daysSince(date: Date): number {
  return (Date.now() - date.getTime()) / (1000 * 60 * 60 * 24);
}

function toSummary(row: AppRow): AppSummary {
  return {
    ...row,
    releasedAt: row.releasedAt?.toISOString() ?? null,
    isNew: row.releasedAt ? daysSince(row.releasedAt) <= NEW_DAYS : false,
    recentlyUpdated: daysSince(row.updatedAt) <= UPDATED_DAYS,
    free: true,
  };
}

function toButtons(
  distributions: {
    id: string;
    label: string;
    type: string;
    url: string;
    trackDownload: boolean;
    active: boolean;
  }[],
): DistributionButton[] {
  return distributions
    .filter((d) => d.active && d.url.startsWith("http"))
    .map((d) => ({
      id: d.id,
      label: d.label,
      type: d.type,
      url: d.url,
      trackDownload: d.trackDownload,
    }));
}

export const applicationsService = {
  async getCatalog(
    filters: CatalogFilters,
  ): Promise<Omit<CatalogResult, "items"> & { items: AppSummary[] }> {
    let orderedIds: string[] | undefined;
    if (filters.sort === "popular") {
      orderedIds = await applicationsRepository.popularityRanking(200);
    }
    const result = await applicationsRepository.findManyPublic({
      ...filters,
      ...(orderedIds ? { orderedIds } : {}),
    });
    return { ...result, items: result.items.map(toSummary) };
  },

  async getBySlug(slug: string): Promise<AppDetail | null> {
    const app = await applicationsRepository.findPublicBySlug(slug);
    if (!app) return null;

    const summary = toSummary(app);
    const versionsWithButtons = app.versions.map((v) => ({
      version: v.version,
      changelog: v.changelog,
      releasedAt: v.releasedAt?.toISOString() ?? null,
      status: v.status,
      distributions: toButtons(v.distributions),
    }));

    return {
      ...summary,
      description: app.description,
      objective: app.objective,
      targetAudience: app.targetAudience,
      advantages: safeJsonStringArray(app.advantages),
      requirements: safeJsonStringArray(app.requirements),
      platforms: safeJsonStringArray(app.platforms),
      supportEmail: app.supportEmail,
      supportUrl: app.supportUrl,
      features: app.features.map((f) => ({
        title: f.title,
        description: f.description,
        iconName: f.iconName,
      })),
      images: app.images.map((i) => ({
        url: i.url,
        alt: i.alt,
        caption: i.caption,
        kind: i.kind,
      })),
      versions: versionsWithButtons,
      // Botões gerais + os da última versão publicada, sem duplicatas.
      distributions: (() => {
        const seen = new Set<string>();
        return [...toButtons(app.distributions), ...versionsWithButtons
          .filter((v) => v.status === "PUBLISHED")
          .flatMap((v) => v.distributions)]
          .filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true)));
      })(),
    };
  },

  async getFeatured(): Promise<AppSummary[]> {
    return (await applicationsRepository.findFeatured()).map(toSummary);
  },

  async getRecent(): Promise<AppSummary[]> {
    return (await applicationsRepository.findRecent()).map(toSummary);
  },

  async getPopular(): Promise<AppSummary[]> {
    return (await applicationsRepository.findPopular()).map(toSummary);
  },

  async listAdmin() {
    return applicationsRepository.findAllAdmin();
  },

  async getAdminById(id: string) {
    return applicationsRepository.findById(id);
  },

  async create(input: CreateApplicationInput) {
    return applicationsRepository.create(input);
  },

  async update(id: string, input: UpdateApplicationInput) {
    return applicationsRepository.update(id, input);
  },

  async remove(id: string) {
    return applicationsRepository.remove(id);
  },

  /** Só publica se houver status DISPONÍVEL e pelo menos um link ativo. */
  async canPublish(id: string): Promise<{ ok: boolean; reason?: string }> {
    const app = await applicationsRepository.findById(id);
    if (!app) return { ok: false, reason: "Aplicativo não encontrado." };
    if (app.status !== "AVAILABLE") {
      return { ok: false, reason: "O status deve ser 'Disponível'." };
    }
    const activeLinks = app.distributions.filter(
      (d) => d.active && d.url.startsWith("http"),
    );
    if (activeLinks.length === 0) {
      return {
        ok: false,
        reason: "Cadastre ao menos um link de distribuição ativo.",
      };
    }
    return { ok: true };
  },
};
