import type { Category } from "@prisma/client";

export interface CategoryDto {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  iconName: string | null;
  appCount: number;
}

export interface CreateCategoryInput {
  slug: string;
  name: string;
  description?: string;
  iconName?: string;
  sortOrder?: number;
}

export type UpdateCategoryInput = Partial<CreateCategoryInput> & {
  active?: boolean;
};

export type { Category };
