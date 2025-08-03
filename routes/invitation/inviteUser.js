import express from "express";
import { PrismaClient } from "@prisma/client";
import { v4 as uuidv4 } from "uuid";
import {authenticateToken} from "../../middleware/authMiddleware.js";
import {isAdmin} from "../../services/authService.js";

const prisma = new PrismaClient();
const inviteUserRoutes = express.Router();

/**
 * @swagger
 * /api/v1/invite:
 *   post:
 *     summary: Invite a new user to the workspace
 *     description: |
 *       Create an invitation for a new user to join the current workspace. Only admin users can send invitations.
 *
 *       **Features:**
 *       - Creates a unique invitation token with 3-day expiration
 *       - Validates that the email is not already registered
 *       - Prevents duplicate pending invitations for the same email
 *       - Generates invitation link for email distribution
 *       - Requires admin privileges
 *
 *       **Process:**
 *       1. Admin creates invitation with email, username (optional), and role
 *       2. System generates unique token and expiration date (3 days)
 *       3. Invitation link is created for email distribution
 *       4. Invitation is stored with PENDING status
 *     tags: [Invitations]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/InviteUserRequest'
 *           examples:
 *             developer_invite:
 *               summary: Invite a developer
 *               value:
 *                 email: "john.dev@example.com"
 *                 username: "john_developer"
 *                 role: "DEVELOPER"
 *             trainer_invite:
 *               summary: Invite a trainer (no username)
 *               value:
 *                 email: "trainer@example.com"
 *                 role: "TRAINER"
 *             admin_invite:
 *               summary: Invite another admin
 *               value:
 *                 email: "admin2@example.com"
 *                 username: "admin_two"
 *                 role: "ADMIN"
 *     responses:
 *       201:
 *         description: Invitation created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/InviteUserResponse'
 *       400:
 *         description: Bad request - user exists or invitation already pending
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             examples:
 *               user_exists:
 *                 summary: User already registered
 *                 value:
 *                   message: "User already exists."
 *               invite_exists:
 *                 summary: Pending invitation already exists
 *                 value:
 *                   message: "An invite already exists."
 *       401:
 *         description: Unauthorized - invalid or missing token
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Unauthorized"
 *       403:
 *         description: Forbidden - admin access required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Admin only"
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ErrorResponse'
 *             example:
 *               message: "Internal error"
 */
inviteUserRoutes.post("/", authenticateToken, isAdmin, async (req, res) => {
    const { email, username, role } = req.body;
    const workspaceId = req.user.workspaceId;
    const invitedById = req.user.userId;

    try {
        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: "User already exists." });
        }

        const existingInvite = await prisma.invitation.findFirst({
            where: { email, workspaceId, status: "PENDING" },
        });

        if (existingInvite) {
            return res.status(400).json({ message: "An invite already exists." });
        }

        const token = uuidv4();
        const expiresAt = new Date(Date.now() + 1000 * 60 * 60 * 24 * 3); // expires in 3 days

        console.log("req.user:", req.user);
        const invite = await prisma.invitation.create({
            data: {
                email,
                username,
                role,
                token,
                expiresAt,
                workspace: {
                    connect: { id: workspaceId }
                },
                invitedBy: {
                    connect: { id: req.user.id }
                }
            }
        });

        const inviteLink = `https://your-app.com/accept-invite?token=${token}`;
        console.log(`Send invite to ${email}: ${inviteLink}`);

        return res.status(201).json({ message: "Invitation created", invite });
    } catch (err) {
        console.error("Failed to invite user:", err);
        return res.status(500).json({ message: "Internal error" });
    }
});

export default inviteUserRoutes;