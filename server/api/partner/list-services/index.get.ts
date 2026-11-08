export default defineEventHandler(async (event) => {
    return { data: [
        { id: '1', name: 'Mock Chat Service', token_limit: 1000000, token_used: 50000, status: 'active' },
        { id: '2', name: 'Mock Embed Service', token_limit: 500000, token_used: 12000, status: 'inactive' }
    ] };
})
