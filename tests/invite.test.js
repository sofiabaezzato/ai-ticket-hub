import request from 'supertest';
import app from '../app.js';
import {beforeAll, describe, expect, it} from "@jest/globals";

describe('User Invitation Flow', () => {
    let token;
    let workspaceId;

    beforeAll(async () => {
        // Signup as admin
        const res = await request(app).post('/api/v1/auth/signup').send({
            username: 'admin2',
            email: 'admin2@example.com',
            password: 'secret',
            workspaceName: 'Team 2',
        });

        token = res.body.token;
        workspaceId = res.body.user.workspaceId;
    });

    it('invites a user to the workspace', async () => {
        const res = await request(app)
            .post('/api/v1/invite')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'user@example.com',
                username: 'User',
                role: 'DEVELOPER',
            });

        expect(res.statusCode).toBe(201);
        expect(res.body.invite.token).toBeDefined();
    });
});
