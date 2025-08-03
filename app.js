import express from "express";
import { PORT } from "./config/env.js";
import {createNewTask, getTickets} from "./services/ticketService.js";
import clickupAuthRouter from "./routes/auth/clickupAuth.js";
import workspaceRoutes from "./routes/workspace.js";
import userRoutes from "./routes/user.js";
import tokenRouter from "./routes/token.js";
import authRoutes from "./routes/auth/authRoutes.js";
import {authenticateToken} from "./middleware/authMiddleware.js";
import inviteUserRoutes from "./routes/invitation/inviteUser.js";
import acceptInviteRoutes from "./routes/invitation/acceptInvite.js";
import { setupSwagger } from './docs/swagger.js';


const app = express();

app.use(express.json());
setupSwagger(app);

app.get("/", (req, res) => {
    res.send(`✅ Server up and running on port: ${ PORT }`);
})

app.use('/api/v1/auth', authRoutes);

app.use('/api/v1/workspaces', workspaceRoutes);

app.use('/api/v1/users', userRoutes);

app.use('/api/v1/invite', inviteUserRoutes)

app.use('/api/v1/accept-invite', acceptInviteRoutes)

app.use("/api/v1/token", tokenRouter);

app.use('/api/v1/clickup/oauth', clickupAuthRouter);

app.get('/api/tickets', authenticateToken, async (req, res) => {
    try {
        const since = req.query.since || '2025-07-01 00:00:00';
        const provider = req.query.provider || 'servicenow';
        const tickets = await getTickets({ provider, since });

        await createNewTask()

        res.json({ count: tickets.length, tickets });
    } catch (err) {
        console.error('Ticket fetch error:', err.message);
        res.status(500).json({ error: 'Could not fetch tickets' });
    }
});

app.listen(PORT,() => {
    console.log(`AI Ticket Hub is running on http://localhost:${ PORT }/`);
});

export default app;