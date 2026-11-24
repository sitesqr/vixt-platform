import { bannersRepository } from "./repository";
import type { BannerDto } from "./types";

export const bannersService = {
  async listActive(): Promise<BannerDto[]> {
    const rows = await bannersRepository.findActive();
    return rows.map((b) => ({
      id: b.id,
      title: b.title,
      subtitle: b.subtitle,
      imageUrl: b.imageUrl,
      ctaLabel: b.ctaLabel,
      ctaUrl: b.ctaUrl,
      applicationSlug: b.application?.slug ?? null,
    }));
  },
  async listAdmin() {
    return bannersRepository.findAll();
  },
  async create(data: Parameters<typeof bannersRepository.create>[0]) {
    return bannersRepository.create(data);
  },
  async update(id: string, data: Parameters<typeof bannersRepository.update>[1]) {
    return bannersRepository.update(id, data);
  },
  async remove(id: string) {
    return bannersRepository.remove(id);
  },
};
