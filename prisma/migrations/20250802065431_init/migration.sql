/*
  Warnings:

  - A unique constraint covering the columns `[service,workspaceId]` on the table `IntegrationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[service,userId]` on the table `IntegrationToken` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[email]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[domain]` on the table `Workspace` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `IntegrationToken` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Workspace` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."IntegrationToken" ADD COLUMN     "metadata" JSONB,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "public"."Workspace" ADD COLUMN     "domain" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationToken_service_workspaceId_key" ON "public"."IntegrationToken"("service", "workspaceId");

-- CreateIndex
CREATE UNIQUE INDEX "IntegrationToken_service_userId_key" ON "public"."IntegrationToken"("service", "userId");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "public"."User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Workspace_domain_key" ON "public"."Workspace"("domain");
