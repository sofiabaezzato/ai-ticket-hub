import express from "express";
import bcrypt from 'bcryptjs';
import { PrismaClient } from "@prisma/client";
import {generateToken} from "../../utils/jwt.js";

const prisma = new PrismaClient();
const acceptInviteRoutes = express.Router();

/**
 * @swagger
 * /api/v1/accept-invite:
 *   post:
 *     summary: Accept an invitation and create user account
 *     description: |
 *       Accept a workspace invitation using the invitation token and create a new user account.
 *
 *       **Features:**
 *       - Validates invitation token and expiration
 *       - Creates new user account with provided password
 *       - Assigns role and workspace as specified in invitation
 *       - Marks invitation as ACCEPTED
 *       - Returns JWT token for immediate authentication
 *       - Auto-generates username from email if not provided in invitation
 *
 *       **Process:**
 *       1. User receives invitation link with token
 *       2. User provides token and desired password
 *       3. System validates token and creates user account
 *       4. Invitation status is updated to ACCEPTED
 *       5. User receives JWT token for authentication
 *     tags: [Invitations]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/AcceptInviteRequest'
 *           examples:
 *             valid_acceptance:
 *               summary: Accept invitation with password
 *               value:
 *                 invitationToken: "123e4567-e89b-12d3-a456-426614174000"
 *                 password: "mySecurePassword123"
 *             strong_password:
 *               summary: Accept with strong password
 *               value:
 *                 invitationToken: "987fcdeb-51a2-43d7-8bb4-123456789abc"
 *                 password: "SuperSecure!Pass456"
 *     responses:
 *       200:
 *         description: Invitation accepted and user account created
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AcceptInviteResponse'
 *       400:
 *         description: Bad request - invalid token, expired invitation, or user already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               invalid_token:
 *                 summary: Invalid or expired token
 *                 value:
 *                   message: "Invalid or expired token."
 *               invalid_invitation:
 *                 summary: Invitation not pending
 *                 value:
 *                   message: "Invalid invitation."
 *               user_registered:
 *                 summary: User already registered
 *                 value:
 *                   message: "User already registered."
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal error"
 */
acceptInviteRoutes.post("/", async (req, res) => {
    const { invitationToken, password } = req.body;

    try {
        const invite = await prisma.invitation.findUnique({ where: { token: invitationToken } });

        if (!invite || invite.expiresAt < new Date()) {
            return res.status(400).json({ message: "Invalid or expired token." });
        } else if (invite.status !== "PENDING") {
            return res.status(400).json({ message: "Invalid invitation." });
        }

        const existingUser = await prisma.user.findUnique({
            where: { email: invite.email },
        });

        if (existingUser) {
            return res.status(400).json({ message: "User already registered." });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await prisma.user.create({
            data: {
                email: invite.email,
                username: invite.username ?? invite.email.split("@")[0],
                role: invite.role,
                workspaceId: invite.workspaceId,
                hashedPassword,
            },
        });

        await prisma.invitation.update({
            where: { id: invite.id },
            data: { status: "ACCEPTED" },
        });

        const jwt = generateToken(user)

        return res.status(200).json({ token: jwt, user: { id: user.id, email: user.email, role: user.role } });
    } catch (err) {
        console.error("Invite acceptance failed:", err);
        return res.status(500).json({ message: "Internal error" });
    }
});

export default acceptInviteRoutes;