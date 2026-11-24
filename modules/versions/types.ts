import type { VersionStatus } from "@prisma/client";

export interface CreateVersionInput {
  applicationId: string;
  version: string;
  changelog?: string;
  status?: VersionStatus;
  releasedAt?: Date;
}

export type UpdateVersionInput = Partial<CreateVersionInput>;
