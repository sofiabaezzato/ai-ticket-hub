import express from "express";
import { PrismaClient } from "@prisma/client"
import {authenticateToken} from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();
const tokenRouter = express.Router();

/**
 * Add a new integration token
 *
 * Accepts either:
 * - workspaceId (for workspace-level token)
 * - userId (for user-level token)
 */
tokenRouter.post("/", authenticateToken, async (req, res) => {
    const {
        service,
        accessToken,
        refreshToken,
        metadata,
        expiresAt,
        workspaceId,
        userId
    } = req.body;

    try {
        if (!service || !accessToken || (!workspaceId && !userId)) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        // Check for uniqueness constraint
        const where = workspaceId
            ? { service_workspaceId: { service, workspaceId } }
            : { service_userId: { service, userId } };

        const existing = await prisma.integrationToken.findUnique({ where });

        if (existing) {
            return res.status(409).json({ message: "Token already exists for this service and scope" });
        }

        const newToken = await prisma.integrationToken.create({
            data: {
                service,
                accessToken,
                refreshToken,
                metadata,
                expiresAt: expiresAt ? new Date(expiresAt) : null,
                workspace: workspaceId ? { connect: { id: workspaceId } } : undefined,
                user: userId ? { connect: { id: userId } } : undefined
            }
        });

        return res.status(201).json(newToken);
    } catch (error) {
        console.error("Error creating integration token:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
});

export default tokenRouter;
