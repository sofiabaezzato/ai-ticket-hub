import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function resetDatabase() {
    await prisma.$transaction([
        prisma.$executeRawUnsafe(`TRUNCATE "IntegrationToken" RESTART IDENTITY CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE "Invitation" RESTART IDENTITY CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE "User" RESTART IDENTITY CASCADE`),
        prisma.$executeRawUnsafe(`TRUNCATE "Workspace" RESTART IDENTITY CASCADE`)
    ]);
}
