import ServiceNowAdapter from '../adapters/serviceNowAdapter.js';

const adapters = {
    servicenow: new ServiceNowAdapter(),
    // jira: new JiraAdapter()
};

export async function getTickets({ provider = 'servicenow', since }) {
    const adapter = adapters[provider];
    if (!adapter) throw new Error(`Unsupported provider: ${provider}`);

    return await adapter.getNewTickets(since);
}
