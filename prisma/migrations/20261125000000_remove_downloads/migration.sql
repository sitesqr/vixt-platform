-- Remove distribuicoes de download e eventos antes de alterar os enums.
DELETE FROM "analytics_events" WHERE "type" = 'DOWNLOAD';
DELETE FROM "distributions" WHERE "type" NOT IN ('WEB', 'OTHER');

-- AlterEnum
BEGIN;
CREATE TYPE "AnalyticsEventType_new" AS ENUM ('VIEW', 'CLICK');
ALTER TABLE "analytics_events" ALTER COLUMN "type" TYPE "AnalyticsEventType_new" USING ("type"::text::"AnalyticsEventType_new");
ALTER TYPE "AnalyticsEventType" RENAME TO "AnalyticsEventType_old";
ALTER TYPE "AnalyticsEventType_new" RENAME TO "AnalyticsEventType";
DROP TYPE "public"."AnalyticsEventType_old";
COMMIT;

-- AlterEnum
BEGIN;
CREATE TYPE "DistributionType_new" AS ENUM ('WEB', 'OTHER');
ALTER TABLE "distributions" ALTER COLUMN "type" TYPE "DistributionType_new" USING ("type"::text::"DistributionType_new");
ALTER TYPE "DistributionType" RENAME TO "DistributionType_old";
ALTER TYPE "DistributionType_new" RENAME TO "DistributionType";
DROP TYPE "public"."DistributionType_old";
COMMIT;

-- DropIndex
DROP INDEX "distributions_applicationId_platform_availability_idx";

-- AlterTable
ALTER TABLE "analytics_events" DROP COLUMN "confirmed";

-- AlterTable
ALTER TABLE "daily_stats" DROP COLUMN "downloads";

-- AlterTable
ALTER TABLE "distributions" DROP COLUMN "availability",
DROP COLUMN "checksumSha256",
DROP COLUMN "fileName",
DROP COLUMN "fileSizeBytes",
DROP COLUMN "notes",
DROP COLUMN "platform",
DROP COLUMN "trackDownload";

-- DropEnum
DROP TYPE "DistributionAvailability";

-- DropEnum
DROP TYPE "DistributionPlatform";

