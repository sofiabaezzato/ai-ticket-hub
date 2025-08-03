import express from "express";
import { PrismaClient } from "@prisma/client"
import {authenticateToken} from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();

const userRouter = express.Router();

// Create a new user in a workspace
userRouter.post("/", authenticateToken, async (req, res) => {
    const { username, email, role, telegramId, workspaceId } = req.body;

    try {
        const user = await prisma.user.create({
            data: {
                username,
                email,
                role: role,
                telegramId,
                workspace: {
                    connect: { id: workspaceId },
                },
            },
        });

        return res.status(201).json(user);
    } catch (error) {
        console.error("Failed to create user:", error);
        return res.status(500).json({ message: "Could not create user" });
    }
});

userRouter.patch("/me", authenticateToken, async (req, res) => {
    const userId = req.user.id; // from JWT
    const { username, email, telegramId, workspaceId } = req.body;

    try {
        const updatedUser = await prisma.user.update({
            where: { id: userId },
            data: {
                ...(username && { username }),
                ...(email && { email }),
                ...(telegramId && { telegramId }),
                ...(workspaceId && { workspace: { connect: { id: workspaceId } } }),
            },
        });

        return res.json({
            message: "User updated successfully",
            user: {
                id: updatedUser.id,
                username: updatedUser.username,
                email: updatedUser.email,
                telegramId: updatedUser.telegramId,
                role: updatedUser.role,
                workspaceId: updatedUser.workspaceId,
            },
        });
    } catch (error) {
        console.error("Failed to update user:", error);
        return res.status(500).json({ message: "Could not update user" });
    }
});

export default userRouter;
