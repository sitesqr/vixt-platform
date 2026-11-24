import { prisma } from "@/lib/prisma";
import type { CreateBannerInput, UpdateBannerInput } from "./types";

export const bannersRepository = {
  async findActive() {
    return prisma.banner.findMany({
      where: { active: true },
      orderBy: { sortOrder: "asc" },
      include: { application: { select: { slug: true } } },
    });
  },
  async findAll() {
    return prisma.banner.findMany({
      orderBy: { sortOrder: "asc" },
      include: { application: { select: { slug: true, name: true } } },
    });
  },
  async findById(id: string) {
    return prisma.banner.findUnique({ where: { id } });
  },
  async create(data: CreateBannerInput) {
    return prisma.banner.create({ data });
  },
  async update(id: string, data: UpdateBannerInput) {
    return prisma.banner.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.banner.delete({ where: { id } });
  },
};
