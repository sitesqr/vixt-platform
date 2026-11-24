import { prisma } from "@/lib/prisma";
import type { CreateDistributionInput, UpdateDistributionInput } from "./types";

export const distributionsRepository = {
  async findByApp(applicationId: string) {
    return prisma.distribution.findMany({
      where: { applicationId },
      orderBy: { sortOrder: "asc" },
      include: { version: true },
    });
  },
  async findById(id: string) {
    return prisma.distribution.findUnique({ where: { id } });
  },
  async create(data: CreateDistributionInput) {
    return prisma.distribution.create({ data });
  },
  async update(id: string, data: UpdateDistributionInput) {
    return prisma.distribution.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.distribution.delete({ where: { id } });
  },
};
