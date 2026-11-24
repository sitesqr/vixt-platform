-- CreateEnum
CREATE TYPE "DistributionPlatform" AS ENUM ('WEB', 'WINDOWS', 'ANDROID', 'MACOS', 'LINUX', 'OTHER');

-- CreateEnum
CREATE TYPE "DistributionAvailability" AS ENUM ('AVAILABLE', 'COMING_SOON');

-- AlterTable
ALTER TABLE "distributions" ADD COLUMN     "availability" "DistributionAvailability" NOT NULL DEFAULT 'AVAILABLE',
ADD COLUMN     "checksumSha256" VARCHAR(64),
ADD COLUMN     "fileName" VARCHAR(200),
ADD COLUMN     "fileSizeBytes" BIGINT,
ADD COLUMN     "notes" TEXT,
ADD COLUMN     "platform" "DistributionPlatform" NOT NULL DEFAULT 'WEB';

-- CreateIndex
CREATE INDEX "distributions_applicationId_platform_availability_idx" ON "distributions"("applicationId", "platform", "availability");

