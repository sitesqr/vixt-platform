import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import type {
  CatalogFilters,
  CatalogResult,
  CreateApplicationInput,
  UpdateApplicationInput,
} from "./types";

const summarySelect = {
  id: true,
  slug: true,
  name: true,
  tagline: true,
  iconUrl: true,
  accentColor: true,
  status: true,
  featured: true,
  releasedAt: true,
  updatedAt: true,
  category: { select: { name: true, slug: true } },
} satisfies Prisma.ApplicationSelect;

/** Apenas apps disponíveis e publicados aparecem no catálogo público. */
export const publicWhere: Prisma.ApplicationWhereInput = {
  published: true,
  status: "AVAILABLE",
  ownership: "VIXT",
};

export const applicationsRepository = {
  async findManyPublic(filters: CatalogFilters): Promise<CatalogResult> {
    const page = filters.page ?? 1;
    const pageSize = filters.pageSize ?? 12;
    const where: Prisma.ApplicationWhereInput = {
      ...publicWhere,
      ...(filters.q
        ? {
            OR: [
              { name: { contains: filters.q, mode: "insensitive" } },
              { tagline: { contains: filters.q, mode: "insensitive" } },
              { description: { contains: filters.q, mode: "insensitive" } },
            ],
          }
        : {}),
      ...(filters.category
        ? { category: { slug: filters.category } }
        : {}),
    };

    const orderBy: Prisma.ApplicationOrderByWithRelationInput[] =
      filters.sort === "name"
        ? [{ name: "asc" }]
        : filters.sort === "recent"
          ? [{ releasedAt: "desc" }, { createdAt: "desc" }]
          : filters.sort === "popular"
            ? [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }]
            : [{ featured: "desc" }, { sortOrder: "asc" }, { name: "asc" }];

    const skip = (page - 1) * pageSize;

    // Popularidade: a ordem vem do ranking SQL; buscamos todos os IDs da página
    // e reordenamos em memória para preservar a posição exata.
    if (filters.orderedIds) {
      const ids = filters.orderedIds.slice(skip, skip + pageSize);
      const rows = await prisma.application.findMany({
        where: { ...where, id: { in: ids } },
        select: summarySelect,
      });
      const byId = new Map(rows.map((r) => [r.id, r]));
      return {
        items: ids
          .map((id) => byId.get(id))
          .filter((v): v is NonNullable<typeof v> => Boolean(v)),
        total: filters.orderedIds.length,
        page,
        pageSize,
        totalPages: Math.ceil(filters.orderedIds.length / pageSize),
      };
    }

    const [rows, total] = await Promise.all([
      prisma.application.findMany({
        where,
        select: summarySelect,
        orderBy,
        skip,
        take: pageSize,
      }),
      prisma.application.count({ where }),
    ]);

    return {
      items: rows,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  },

  async findPublicBySlug(slug: string) {
    return prisma.application.findFirst({
      where: { ...publicWhere, slug },
      include: {
        category: true,
        features: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        versions: {
          orderBy: { releasedAt: "desc" },
          include: { distributions: { orderBy: { sortOrder: "asc" } } },
        },
        distributions: {
          where: { active: true, versionId: null },
          orderBy: { sortOrder: "asc" },
        },
      },
    });
  },

  async findAllAdmin() {
    return prisma.application.findMany({
      include: { category: true },
      orderBy: [{ featured: "desc" }, { name: "asc" }],
    });
  },

  async findById(id: string) {
    return prisma.application.findUnique({
      include: {
        category: true,
        features: { orderBy: { sortOrder: "asc" } },
        images: { orderBy: { sortOrder: "asc" } },
        versions: { include: { distributions: true } },
        distributions: true,
      },
      where: { id },
    });
  },

  async create(data: CreateApplicationInput) {
    return prisma.application.create({
      data: {
        ...data,
        advantages: data.advantages ?? [],
        requirements: data.requirements ?? [],
        platforms: data.platforms ?? [],
      },
    });
  },

  async update(id: string, data: UpdateApplicationInput) {
    return prisma.application.update({ where: { id }, data });
  },

  async remove(id: string) {
    return prisma.application.delete({ where: { id } });
  },

  async countByStatus() {
    return prisma.application.groupBy({
      by: ["status"],
      _count: { _all: true },
    });
  },

  async countPublished() {
    return prisma.application.count({ where: publicWhere });
  },

  /** IDs ordenados por visualizações reais (usado na ordenação por popularidade). */
  async popularityRanking(limit = 100): Promise<string[]> {
    const rows = await prisma.$queryRaw<{ id: string }[]>`
      SELECT a."id" AS id
      FROM "applications" a
      LEFT JOIN "analytics_events" e
        ON e."applicationId" = a."id" AND e."type" = 'VIEW'
      WHERE a."published" = true AND a."status" = 'AVAILABLE'
      GROUP BY a."id"
      ORDER BY COUNT(e."id") DESC, a."name" ASC
      LIMIT ${limit}
    `;
    return rows.map((r) => r.id);
  },

  async findFeatured(limit = 6) {
    return prisma.application.findMany({
      where: { ...publicWhere, featured: true },
      select: summarySelect,
      orderBy: { sortOrder: "asc" },
      take: limit,
    });
  },

  async findRecent(limit = 6) {
    return prisma.application.findMany({
      where: { ...publicWhere, releasedAt: { not: null } },
      select: summarySelect,
      orderBy: { releasedAt: "desc" },
      take: limit,
    });
  },

  async findPopular(limit = 6) {
    const ids = await this.popularityRanking(limit);
    const rows = await prisma.application.findMany({
      where: { ...publicWhere, id: { in: ids } },
      select: summarySelect,
    });
    const byId = new Map(rows.map((r) => [r.id, r]));
    return ids
      .map((id) => byId.get(id))
      .filter((v): v is NonNullable<typeof v> => Boolean(v));
  },
};
