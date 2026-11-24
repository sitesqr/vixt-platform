import { prisma } from "@/lib/prisma";

export const settingsRepository = {
  async findAll() {
    return prisma.setting.findMany();
  },
  async findByKey(key: string) {
    return prisma.setting.findUnique({ where: { key } });
  },
  async upsert(key: string, value: unknown) {
    return prisma.setting.upsert({
      where: { key },
      create: { key, value: value as object },
      update: { value: value as object },
    });
  },
};
