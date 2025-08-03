export async function syncTickets(sourceAdapter, targetAdapter, aiAssigner = null) {
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString(); // 5 minutes ago
    const tickets = await sourceAdapter.getNewTickets(since);

    for (const ticket of tickets) {
        let assignment = null;

        if (aiAssigner) {
            assignment = await aiAssigner.assign(ticket); // Future AI integration
        }

        await targetAdapter.createTask(ticket, assignment);
    }
}
