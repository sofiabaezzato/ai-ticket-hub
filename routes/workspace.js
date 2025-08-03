import express from "express";
import { PrismaClient } from "@prisma/client"
import {authenticateToken} from "../middleware/authMiddleware.js";

const prisma = new PrismaClient();

const workspaceRouter = express.Router();

// Create a new workspace
workspaceRouter.post("/", authenticateToken, async (req, res) => {
    const { name, domain } = req.body;

    try {
        const workspace = await prisma.workspace.create({
            data: {
                name,
                domain,
            },
        });

        return res.status(201).json(workspace);
    } catch (error) {
        console.error("Failed to create workspace:", error);
        return res.status(500).json({ message: "Could not create workspace" });
    }
});

export default workspaceRouter;
