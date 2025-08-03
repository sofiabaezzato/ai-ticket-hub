import request from 'supertest';
import { PrismaClient } from '@prisma/client';
import app from "../app.js";
import {afterAll, beforeAll} from "@jest/globals";

const prisma = new PrismaClient();

console.log(process.env.DATABASE_URL)

beforeAll(async () => {
    await prisma.$connect();
});

afterAll(async () => {
    await prisma.$disconnect();
});

describe('Auth Signup Flow', () => {
    it('creates a new admin and workspace', async () => {
        const res = await request(app)
            .post('/api/v1/auth/signup')
            .send({
                username: 'admin-test1',
                email: 'admin-test1@example.com',
                password: 'secret',
                workspaceName: 'Test Company'
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.token).toBeDefined();
        expect(res.body.user.role).toBe('ADMIN');
    });
});
