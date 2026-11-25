import type { DistributionType } from "@prisma/client";

export interface CreateDistributionInput {
  applicationId: string;
  versionId?: string;
  type: DistributionType;
  label: string;
  url: string;
  active?: boolean;
  
  sortOrder?: number;
}

export type UpdateDistributionInput = Partial<CreateDistributionInput>;
