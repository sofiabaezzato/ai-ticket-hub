import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt.js';
import {sanitizeDomain} from "../utils/utils.js";

const prisma = new PrismaClient();

export async function signup(req, res) {
    const { username, email, password, workspaceName, workspaceDomain } = req.body;

    try {
        // Validate required fields
        if (!username || !email || !password || !workspaceName) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        // Sanitize or generate domain
        let domain = workspaceDomain?.trim();
        domain = domain ? sanitizeDomain(domain) : `${Date.now()}`;

        // Check if workspace name or domain already exists
        const existingWorkspace = await prisma.workspace.findFirst({
            where: { domain: workspaceDomain }
        });

        if (existingWorkspace) {
            return res.status(409).json({ message: 'Workspace domain already in use' });
        }

        // Check if email already exists
        const existingUser = await prisma.user.findFirst({ where: { email } });
        if (existingUser) {
            return res.status(409).json({ message: 'Email already in use' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create workspace and user in transaction
        const [workspace, user] = await prisma.$transaction(async (tx) => {
            const workspace = await tx.workspace.create({
                data: {
                    name: workspaceName,
                    domain,
                },
            });

            const user = await tx.user.create({
                data: {
                    username,
                    email,
                    hashedPassword,
                    role: 'ADMIN',
                    workspaceId: workspace.id,
                },
            });

            return [workspace, user];
        });

        // Generate token
        const token = generateToken(user);

        res.status(201).json({
            message: 'Workspace and admin user created successfully',
            token,
            user: {
                id: user.id,
                email: user.email,
                username: user.username,
                role: user.role,
            },
            workspace: {
                id: workspace.id,
                name: workspace.name,
                domain: workspace.domain,
            },
        });

    } catch (err) {
        console.error('Signup error:', err);
        res.status(500).json({ message: 'Internal server error' });
    }
}

export async function login(req, res) {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) return res.status(400).json({ message: 'User not found' });

    const passwordMatch = await bcrypt.compare(password, user.hashedPassword);
    if (!passwordMatch) return res.status(401).json({ message: 'Invalid password' });

    const token = generateToken(user);

    res.json({ token, user: { id: user.id, email: user.email, role: user.role } });
}

export const isAdmin = (req, res, next) => {
    if (req.user.role !== "ADMIN") {
        return res.status(403).json({ message: "Admin only" });
    }
    next();
};