import dotenv from 'dotenv';
import { PrismaClient } from '@prisma/client';
import { resetDatabase } from './resetDb.js';
import { beforeAll, afterAll } from '@jest/globals';

dotenv.config({ path: '.env.test', debug: false });

const prisma = new PrismaClient();


beforeAll(async () => {
    await resetDatabase();
});

afterAll(async () => {
    await prisma.$disconnect();
});
