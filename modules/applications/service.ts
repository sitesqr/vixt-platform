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
  DistributionGroup,
  UpdateApplicationInput,
} from "./types";
import type {
  DistributionAvailability,
  DistributionPlatform,
} from "@prisma/client";

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
    platform: DistributionPlatform;
    availability: DistributionAvailability;
    url: string;
    fileName: string | null;
    fileSizeBytes: bigint | null;
    checksumSha256: string | null;
    notes: string | null;
    trackDownload: boolean;
    active: boolean;
  }[],
): DistributionButton[] {
  return distributions
    .filter((d) => d.active)
    .map((d) => {
      const comingSoon = d.availability === "COMING_SOON";
      const hasValidUrl = d.url.startsWith("http");
      return {
        id: d.id,
        label: d.label,
        type: d.type,
        platform: d.platform,
        availability: d.availability,
        // Nunca expomos URL de item "Em breve" — não existe download real.
        url: comingSoon || !hasValidUrl ? null : d.url,
        fileName: d.fileName,
        fileSizeBytes: d.fileSizeBytes?.toString() ?? null,
        checksumSha256: d.checksumSha256,
        notes: d.notes,
        trackDownload: d.trackDownload,
      };
    });
}

export function groupDistributions(buttons: DistributionButton[]): DistributionGroup {
  // PWA também é uma opção web (instalável pelo navegador, sem APK).
  const web = buttons.filter(
    (b) => (b.platform === "WEB" || b.type === "PWA") && b.url,
  );
  const desktop = buttons.filter(
    (b) => ["WINDOWS", "MACOS", "LINUX"].includes(b.platform) && b.url,
  );
  const mobile = buttons.filter(
    (b) => ["ANDROID", "PLAY_STORE"].includes(b.platform) && b.url,
  );
  const comingSoon = [
    ...new Set(
      buttons
        .filter((b) => b.availability === "COMING_SOON")
        .map((b) => b.platform),
    ),
  ];
  return { web, desktop, mobile, comingSoon };
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

    // Botões gerais + botões das versões publicadas, sem duplicatas por id.
    const seen = new Set<string>();
    const allButtons = [
      ...toButtons(app.distributions),
      ...app.versions
        .filter((v) => v.status === "PUBLISHED")
        .flatMap((v) => toButtons(v.distributions)),
    ].filter((b) => (seen.has(b.id) ? false : (seen.add(b.id), true)));

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
      // Botões gerais + os da versão publicada, sem duplicatas.
      distributions: allButtons,
      distributionGroups: groupDistributions(allButtons),
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
