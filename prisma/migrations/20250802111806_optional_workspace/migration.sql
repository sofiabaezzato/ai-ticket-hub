-- DropForeignKey
ALTER TABLE "public"."User" DROP CONSTRAINT "User_workspaceId_fkey";

-- AlterTable
ALTER TABLE "public"."User" ALTER COLUMN "workspaceId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "public"."User" ADD CONSTRAINT "User_workspaceId_fkey" FOREIGN KEY ("workspaceId") REFERENCES "public"."Workspace"("id") ON DELETE SET NULL ON UPDATE CASCADE;
