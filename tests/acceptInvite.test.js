import request from 'supertest';
import app from '../app.js';
import {beforeAll, describe, expect, it} from "@jest/globals";

describe('Accept Invitation Flow', () => {
    let invitationToken;

    beforeAll(async () => {
        // Signup + invite
        const signup = await request(app).post('/api/v1/auth/signup').send({
            username: 'admin3',
            email: 'admin3@example.com',
            password: 'secret',
            workspaceName: 'Org 3',
        });

        const token = signup.body.token;
        console.log("AUTH TOKEN: ", token);

        const invite = await request(app)
            .post('/api/v1/invite')
            .set('Authorization', `Bearer ${token}`)
            .send({
                email: 'accept@example.com',
                username: 'Invitee',
                role: 'VIEWER',
            });

        console.log(invite.body);
        invitationToken = invite.body.invite.token;
    });

    it('accepts the invitation and creates a user', async () => {
        const res = await request(app).post('/api/v1/accept-invite').send({
            invitationToken: invitationToken,
            password: 'invited123',
        });

        expect(res.statusCode).toBe(200);
        expect(res.body.user.email).toBe('accept@example.com');
        expect(res.body.token).toBeDefined();
    });
});
