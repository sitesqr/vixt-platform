import type {
  AppStatus,
  Application,
  Category,
  Distribution,
  AppVersion,
  AppImage,
  Feature,
  Ownership,
} from "@prisma/client";

export type PublicAppStatus = AppStatus;

/** Linha bruta do banco, antes da formatação para a API pública. */
export interface AppRow {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  iconUrl: string | null;
  accentColor: string | null;
  status: AppStatus;
  featured: boolean;
  releasedAt: Date | null;
  updatedAt: Date;
  category: { name: string; slug: string } | null;
}

export interface AppSummary {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  iconUrl: string | null;
  accentColor: string | null;
  status: AppStatus;
  featured: boolean;
  releasedAt: string | null;
  isNew: boolean;
  recentlyUpdated: boolean;
  category: { name: string; slug: string } | null;
  free: true;
}

export interface DistributionButton {
  id: string;
  label: string;
  type: string;
  url: string | null;
}

/** Links de acesso exibidos na página do aplicativo. */
export interface DistributionGroup {
  links: DistributionButton[];
}

export interface AppDetail extends AppSummary {
  description: string;
  objective: string | null;
  targetAudience: string | null;
  advantages: string[];
  requirements: string[];
  platforms: string[];
  supportEmail: string | null;
  supportUrl: string | null;
  /** URL da PWA instalável no celular — quando presente, exibe botão de download. */
  pwaUrl: string | null;
  features: { title: string; description: string | null; iconName: string | null }[];
  images: { url: string; alt: string; caption: string | null; kind: string }[];
  versions: {
    version: string;
    changelog: string | null;
    releasedAt: string | null;
    status: string;
    distributions: DistributionButton[];
  }[];
  distributions: DistributionButton[];
  distributionGroups: DistributionGroup;
}

export interface CatalogResult {
  items: AppRow[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface CreateApplicationInput {
  slug: string;
  name: string;
  tagline: string;
  description: string;
  objective?: string;
  targetAudience?: string;
  advantages?: string[];
  requirements?: string[];
  platforms?: string[];
  supportEmail?: string;
  supportUrl?: string;
  categoryId?: string;
  iconUrl?: string;
  accentColor?: string;
  status?: AppStatus;
  published?: boolean;
  featured?: boolean;
  ownership?: Ownership;
  sortOrder?: number;
  releasedAt?: Date;
}

export type UpdateApplicationInput = Partial<CreateApplicationInput>;

export interface CatalogFilters {
  q?: string;
  category?: string;
  sort?: "name" | "popular" | "recent" | "featured";
  page?: number;
  pageSize?: number;
  orderedIds?: string[];
}

export type ApplicationWithRelations = Application & {
  category: Category | null;
  features: Feature[];
  images: AppImage[];
  versions: (AppVersion & { distributions: Distribution[] })[];
  distributions: Distribution[];
};
