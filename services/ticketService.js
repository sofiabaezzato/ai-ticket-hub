import ServiceNowAdapter from '../adapters/serviceNowAdapter.js';
import ClickUpAdapter from "../adapters/targets/clickUpAdapter.js";

const adapters = {
    servicenow: new ServiceNowAdapter(),
    // jira: new JiraAdapter()
};

const targetAdapters = {
    clickup: new ClickUpAdapter()
}

export async function getTickets({ provider = 'servicenow', since }) {
    const adapter = adapters[provider];
    if (!adapter) throw new Error(`Unsupported provider: ${provider}`);

    return await adapter.getNewTickets(since);
}



export async function createNewTask() {

    const adapter = targetAdapters["clickup"];
    const mockTicket = {
        id: 'test-001',
        source: 'servicenow',
        summary: 'Test Email Change Request',
        description: 'Please change email from a@b.com to c@d.com',
        comments: 'User requested change via support chat.',
        createdAt: new Date().toISOString()
    };

    const assignment = {
        assigneeId: null, // test without assignment
        tags: ['email', 'low-priority']
    };

    await adapter.createTask(mockTicket, assignment);
    console.log('Task created in ClickUp');
}
