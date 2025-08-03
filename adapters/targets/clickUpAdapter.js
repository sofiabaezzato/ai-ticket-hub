import axios from 'axios';
import dotenv from 'dotenv';
import TicketTargetAdapter from "./ticketTargetAdapter.js";

dotenv.config();

export default class ClickUpAdapter extends TicketTargetAdapter {
    constructor() {
        super();
        this.api = axios.create({
            baseURL: 'https://api.clickup.com/api/v2/',
            headers: {
                // Authorization: process.env.CLICKUP_API_TOKEN,
                Authorization: "32611876_3decab0b6904ec60723ad256a076d0aaa921ee843bc3c326634c65080205e2ba",
                'Content-Type': 'application/json',
            },
        });
    }

    async createTask(ticket, assignment = {}) {
        const listId = process.env.CLICKUP_LIST_ID;

        const taskData = {
            name: ticket.summary,
            description: `**Description**: ${ticket.description || 'N/A'}\n\n**Comments**:\n${ticket.comments || 'N/A'}`,
            tags: [ticket.source, ...(assignment.tags || [])],
            assignees: assignment.assigneeId ? [assignment.assigneeId] : [],
            due_date: null,
        };

        const res = await this.api.post(`/list/${listId}/task`, taskData);

        return res.data;
    }
}
