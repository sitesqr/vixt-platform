import { prisma } from "@/lib/prisma";
import type { CreateCategoryInput, UpdateCategoryInput } from "./types";

export const categoriesRepository = {
  async findPublic() {
    return prisma.category.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: {
        _count: {
          select: {
            applications: { where: { published: true, status: "AVAILABLE" } },
          },
        },
      },
    });
  },

  async findAll() {
    return prisma.category.findMany({
      orderBy: { sortOrder: "asc" },
      include: { _count: { select: { applications: true } } },
    });
  },

  async findBySlug(slug: string) {
    return prisma.category.findUnique({ where: { slug } });
  },

  async findById(id: string) {
    return prisma.category.findUnique({ where: { id } });
  },

  async create(data: CreateCategoryInput) {
    return prisma.category.create({ data });
  },

  async update(id: string, data: UpdateCategoryInput) {
    return prisma.category.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.category.delete({ where: { id } });
  },
};
