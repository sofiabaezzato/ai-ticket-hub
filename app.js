import express from "express";
import { PORT } from "./config/env.js";
import {getTickets} from "./services/ticketService.js";

const app = express();

app.get('/api/tickets', async (req, res) => {
    try {
        const since = req.query.since || '2025-07-01 00:00:00';
        const provider = req.query.provider || 'servicenow';
        const tickets = await getTickets({ provider, since });
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