import axios from 'axios';
import qs from 'querystring';
import dotenv from 'dotenv';
import TicketAdapter from './baseAdapter.js';

dotenv.config();

let accessToken = null;
let tokenExpiresAt = 0;

async function getAccessToken() {
    const now = Date.now();
    if (accessToken && tokenExpiresAt > now) return accessToken;

    const response = await axios.post(
        `${process.env.SERVICENOW_INSTANCE}/oauth_token.do`,
        qs.stringify({
            grant_type: 'password',
            client_id: process.env.SERVICENOW_CLIENT_ID,
            client_secret: process.env.SERVICENOW_CLIENT_SECRET,
            username: process.env.SERVICENOW_USERNAME,
            password: process.env.SERVICENOW_PASSWORD,
            scope: process.env.SERVICENOW_SCOPE,
        }),
        {
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        }
    );

    accessToken = response.data.access_token;
    tokenExpiresAt = now + response.data.expires_in * 1000 - 60000;

    console.log(accessToken)

    return accessToken;
}

export default class ServiceNowAdapter extends TicketAdapter {
    async getNewTickets(since) {
        const token = await getAccessToken();

        const date = new Date(since);
        const dateOnly = date.toISOString().split('T')[0];
        const query = `sys_created_on>=javascript:gs.dateGenerate('${dateOnly}','00:00:00')`;

        const response = await axios.get(
            `${process.env.SERVICENOW_INSTANCE}/api/now/table/incident`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    Accept: 'application/json',
                },
                params: {
                    sysparm_query: query,
                    sysparm_limit: 100,
                    sysparm_display_value: true,
                },
            }
        );
        console.log("→ Final query:", query);
        console.log("→ Response data.result.length:", response.data.result.length);
        console.log("→ Response x-total-count:", response.headers['x-total-count']);

        return response.data.result.map((incident) => ({
            id: incident.sys_id,
            source: 'servicenow',
            summary: incident.short_description,
            description: incident.description || '',
            comments: incident.comments || '',
            createdAt: incident.sys_created_on,
        }));
    }
}
