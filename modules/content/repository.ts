import { prisma } from "@/lib/prisma";

export const contentRepository = {
  async findByKey(key: string) {
    return prisma.siteContent.findUnique({ where: { key } });
  },
  async findManyPublic() {
    return prisma.siteContent.findMany({ where: { key: { startsWith: "public." } } });
  },
  async findAll() {
    return prisma.siteContent.findMany({ orderBy: { key: "asc" } });
  },
  async upsert(key: string, title: string | null, value: string, adminId?: string) {
    return prisma.siteContent.upsert({
      where: { key },
      create: { key, title, value, isDefault: false, updatedBy: adminId },
      update: { title, value, isDefault: false, updatedBy: adminId },
    });
  },
  async listFaqs(applicationId?: string) {
    return prisma.faq.findMany({
      where: { active: true, applicationId: applicationId ?? null },
      orderBy: { sortOrder: "asc" },
    });
  },
  async allFaqs() {
    return prisma.faq.findMany({ orderBy: { sortOrder: "asc" } });
  },
};
