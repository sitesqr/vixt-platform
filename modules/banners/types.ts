export interface BannerDto {
  id: string;
  title: string;
  subtitle: string | null;
  imageUrl: string | null;
  ctaLabel: string | null;
  ctaUrl: string | null;
  applicationSlug: string | null;
}

export interface CreateBannerInput {
  title: string;
  subtitle?: string;
  imageUrl?: string;
  ctaLabel?: string;
  ctaUrl?: string;
  applicationId?: string;
  active?: boolean;
  sortOrder?: number;
}

export type UpdateBannerInput = Partial<CreateBannerInput>;
