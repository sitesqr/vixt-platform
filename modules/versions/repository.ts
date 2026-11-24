import { prisma } from "@/lib/prisma";
import type { CreateVersionInput, UpdateVersionInput } from "./types";

export const versionsRepository = {
  async findByApp(applicationId: string) {
    return prisma.appVersion.findMany({
      where: { applicationId },
      orderBy: { releasedAt: "desc" },
      include: { distributions: true },
    });
  },
  async findById(id: string) {
    return prisma.appVersion.findUnique({ where: { id } });
  },
  async create(data: CreateVersionInput) {
    return prisma.appVersion.create({ data });
  },
  async update(id: string, data: UpdateVersionInput) {
    return prisma.appVersion.update({ where: { id }, data });
  },
  async remove(id: string) {
    return prisma.appVersion.delete({ where: { id } });
  },
};
