-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "AppStatus" AS ENUM ('DEVELOPMENT', 'TESTING', 'AVAILABLE', 'MAINTENANCE', 'DISCONTINUED');

-- CreateEnum
CREATE TYPE "Ownership" AS ENUM ('VIXT', 'THIRD_PARTY');

-- CreateEnum
CREATE TYPE "ImageKind" AS ENUM ('ICON', 'SCREENSHOT', 'COVER', 'VIDEO_POSTER');

-- CreateEnum
CREATE TYPE "VersionStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ARCHIVED');

-- CreateEnum
CREATE TYPE "DistributionType" AS ENUM ('WEB', 'PLAY_STORE', 'APK', 'PWA', 'DESKTOP', 'OTHER');

-- CreateEnum
CREATE TYPE "AnalyticsEventType" AS ENUM ('VIEW', 'CLICK', 'DOWNLOAD');

-- CreateTable
CREATE TABLE "admins" (
    "id" UUID NOT NULL,
    "email" VARCHAR(180) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "roleId" UUID NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "admins_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_sessions" (
    "id" UUID NOT NULL,
    "adminId" UUID NOT NULL,
    "tokenHash" VARCHAR(64) NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "admin_sessions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "admin_roles" (
    "id" UUID NOT NULL,
    "name" VARCHAR(60) NOT NULL,
    "description" TEXT,

    CONSTRAINT "admin_roles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "permissions" (
    "id" UUID NOT NULL,
    "key" VARCHAR(80) NOT NULL,
    "description" TEXT,

    CONSTRAINT "permissions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "role_permissions" (
    "roleId" UUID NOT NULL,
    "permissionId" UUID NOT NULL,

    CONSTRAINT "role_permissions_pkey" PRIMARY KEY ("roleId","permissionId")
);

-- CreateTable
CREATE TABLE "audit_logs" (
    "id" UUID NOT NULL,
    "adminId" UUID,
    "action" VARCHAR(80) NOT NULL,
    "entityType" VARCHAR(60) NOT NULL,
    "entityId" VARCHAR(80),
    "metadata" JSONB,
    "ipHash" VARCHAR(64),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "audit_logs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "applications" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(120) NOT NULL,
    "shortName" VARCHAR(60),
    "tagline" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "objective" TEXT,
    "targetAudience" TEXT,
    "advantages" JSONB,
    "requirements" JSONB,
    "platforms" JSONB,
    "supportEmail" VARCHAR(180),
    "supportUrl" VARCHAR(500),
    "status" "AppStatus" NOT NULL DEFAULT 'DEVELOPMENT',
    "published" BOOLEAN NOT NULL DEFAULT false,
    "featured" BOOLEAN NOT NULL DEFAULT false,
    "ownership" "Ownership" NOT NULL DEFAULT 'VIXT',
    "publisherId" UUID,
    "categoryId" UUID,
    "iconUrl" VARCHAR(500),
    "accentColor" VARCHAR(20),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "releasedAt" TIMESTAMP(3),
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "applications_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "categories" (
    "id" UUID NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "description" TEXT,
    "iconName" VARCHAR(60),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "categories_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "features" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "title" VARCHAR(160) NOT NULL,
    "description" TEXT,
    "iconName" VARCHAR(60),
    "sortOrder" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "features_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_images" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "url" VARCHAR(500) NOT NULL,
    "alt" VARCHAR(200) NOT NULL,
    "caption" VARCHAR(240),
    "kind" "ImageKind" NOT NULL DEFAULT 'SCREENSHOT',
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_images_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "publishers" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "slug" VARCHAR(100) NOT NULL,
    "approved" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "publishers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "app_versions" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "version" VARCHAR(40) NOT NULL,
    "changelog" TEXT,
    "status" "VersionStatus" NOT NULL DEFAULT 'DRAFT',
    "releasedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "app_versions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "distributions" (
    "id" UUID NOT NULL,
    "applicationId" UUID NOT NULL,
    "versionId" UUID,
    "type" "DistributionType" NOT NULL,
    "label" VARCHAR(120) NOT NULL,
    "url" VARCHAR(800) NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "trackDownload" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "distributions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "site_contents" (
    "key" VARCHAR(80) NOT NULL,
    "title" VARCHAR(200),
    "value" TEXT NOT NULL,
    "isDefault" BOOLEAN NOT NULL DEFAULT true,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "updatedBy" UUID,

    CONSTRAINT "site_contents_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "faqs" (
    "id" UUID NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "applicationId" UUID,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "faqs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "banners" (
    "id" UUID NOT NULL,
    "title" VARCHAR(200) NOT NULL,
    "subtitle" TEXT,
    "imageUrl" VARCHAR(500),
    "ctaLabel" VARCHAR(100),
    "ctaUrl" VARCHAR(500),
    "applicationId" UUID,
    "active" BOOLEAN NOT NULL DEFAULT false,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "banners_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "settings" (
    "key" VARCHAR(80) NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "settings_pkey" PRIMARY KEY ("key")
);

-- CreateTable
CREATE TABLE "analytics_events" (
    "id" UUID NOT NULL,
    "type" "AnalyticsEventType" NOT NULL,
    "applicationId" UUID,
    "distributionId" UUID,
    "sessionHash" VARCHAR(64),
    "referrer" VARCHAR(300),
    "confirmed" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "analytics_events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_stats" (
    "id" UUID NOT NULL,
    "date" DATE NOT NULL,
    "applicationId" UUID NOT NULL,
    "views" INTEGER NOT NULL DEFAULT 0,
    "clicks" INTEGER NOT NULL DEFAULT 0,
    "downloads" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "daily_stats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "admins_email_key" ON "admins"("email");

-- CreateIndex
CREATE INDEX "admins_active_idx" ON "admins"("active");

-- CreateIndex
CREATE UNIQUE INDEX "admin_sessions_tokenHash_key" ON "admin_sessions"("tokenHash");

-- CreateIndex
CREATE INDEX "admin_sessions_adminId_idx" ON "admin_sessions"("adminId");

-- CreateIndex
CREATE INDEX "admin_sessions_expiresAt_idx" ON "admin_sessions"("expiresAt");

-- CreateIndex
CREATE UNIQUE INDEX "admin_roles_name_key" ON "admin_roles"("name");

-- CreateIndex
CREATE UNIQUE INDEX "permissions_key_key" ON "permissions"("key");

-- CreateIndex
CREATE INDEX "audit_logs_createdAt_idx" ON "audit_logs"("createdAt");

-- CreateIndex
CREATE INDEX "audit_logs_entityType_entityId_idx" ON "audit_logs"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "audit_logs_adminId_idx" ON "audit_logs"("adminId");

-- CreateIndex
CREATE UNIQUE INDEX "applications_slug_key" ON "applications"("slug");

-- CreateIndex
CREATE INDEX "applications_published_status_idx" ON "applications"("published", "status");

-- CreateIndex
CREATE INDEX "applications_categoryId_idx" ON "applications"("categoryId");

-- CreateIndex
CREATE INDEX "applications_featured_idx" ON "applications"("featured");

-- CreateIndex
CREATE INDEX "applications_releasedAt_idx" ON "applications"("releasedAt");

-- CreateIndex
CREATE INDEX "applications_status_idx" ON "applications"("status");

-- CreateIndex
CREATE UNIQUE INDEX "categories_slug_key" ON "categories"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "categories_name_key" ON "categories"("name");

-- CreateIndex
CREATE INDEX "categories_active_sortOrder_idx" ON "categories"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "features_applicationId_sortOrder_idx" ON "features"("applicationId", "sortOrder");

-- CreateIndex
CREATE INDEX "app_images_applicationId_sortOrder_idx" ON "app_images"("applicationId", "sortOrder");

-- CreateIndex
CREATE UNIQUE INDEX "publishers_slug_key" ON "publishers"("slug");

-- CreateIndex
CREATE INDEX "app_versions_applicationId_status_releasedAt_idx" ON "app_versions"("applicationId", "status", "releasedAt");

-- CreateIndex
CREATE UNIQUE INDEX "app_versions_applicationId_version_key" ON "app_versions"("applicationId", "version");

-- CreateIndex
CREATE INDEX "distributions_applicationId_active_idx" ON "distributions"("applicationId", "active");

-- CreateIndex
CREATE INDEX "distributions_versionId_idx" ON "distributions"("versionId");

-- CreateIndex
CREATE INDEX "faqs_active_sortOrder_idx" ON "faqs"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "faqs_applicationId_idx" ON "faqs"("applicationId");

-- CreateIndex
CREATE INDEX "banners_active_sortOrder_idx" ON "banners"("active", "sortOrder");

-- CreateIndex
CREATE INDEX "analytics_events_createdAt_idx" ON "analytics_events"("createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_applicationId_type_createdAt_idx" ON "analytics_events"("applicationId", "type", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_type_createdAt_idx" ON "analytics_events"("type", "createdAt");

-- CreateIndex
CREATE INDEX "analytics_events_distributionId_idx" ON "analytics_events"("distributionId");

-- CreateIndex
CREATE INDEX "daily_stats_date_idx" ON "daily_stats"("date");

-- CreateIndex
CREATE UNIQUE INDEX "daily_stats_date_applicationId_key" ON "daily_stats"("date", "applicationId");

-- AddForeignKey
ALTER TABLE "admins" ADD CONSTRAINT "admins_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "admin_sessions" ADD CONSTRAINT "admin_sessions_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "admin_roles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "role_permissions" ADD CONSTRAINT "role_permissions_permissionId_fkey" FOREIGN KEY ("permissionId") REFERENCES "permissions"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "audit_logs" ADD CONSTRAINT "audit_logs_adminId_fkey" FOREIGN KEY ("adminId") REFERENCES "admins"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_publisherId_fkey" FOREIGN KEY ("publisherId") REFERENCES "publishers"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "applications" ADD CONSTRAINT "applications_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "categories"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "features" ADD CONSTRAINT "features_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_images" ADD CONSTRAINT "app_images_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "app_versions" ADD CONSTRAINT "app_versions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "distributions" ADD CONSTRAINT "distributions_versionId_fkey" FOREIGN KEY ("versionId") REFERENCES "app_versions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "faqs" ADD CONSTRAINT "faqs_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "banners" ADD CONSTRAINT "banners_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "analytics_events" ADD CONSTRAINT "analytics_events_distributionId_fkey" FOREIGN KEY ("distributionId") REFERENCES "distributions"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_stats" ADD CONSTRAINT "daily_stats_applicationId_fkey" FOREIGN KEY ("applicationId") REFERENCES "applications"("id") ON DELETE CASCADE ON UPDATE CASCADE;

