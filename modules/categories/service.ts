import { categoriesRepository } from "./repository";
import type { CategoryDto } from "./types";

export const categoriesService = {
  async listPublic(): Promise<CategoryDto[]> {
    const rows = await categoriesRepository.findPublic();
    return rows.map((c) => ({
      id: c.id,
      slug: c.slug,
      name: c.name,
      description: c.description,
      iconName: c.iconName,
      appCount: c._count.applications,
    }));
  },

  async listAdmin() {
    return categoriesRepository.findAll();
  },

  async create(data: Parameters<typeof categoriesRepository.create>[0]) {
    return categoriesRepository.create(data);
  },

  async update(
    id: string,
    data: Parameters<typeof categoriesRepository.update>[1],
  ) {
    return categoriesRepository.update(id, data);
  },

  async remove(id: string) {
    const cat = await categoriesRepository.findById(id);
    if (!cat) throw new Error("NOT_FOUND");
    // Apps relacionados preservados: FK usa SetNull no schema.
    return categoriesRepository.remove(id);
  },
};
