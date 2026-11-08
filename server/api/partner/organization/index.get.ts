export default defineEventHandler(async (event) => {
    return { data: { id: 'mock-org-1', name: 'Mock Organization', description: 'Local development mock organization.', address: 'Mock Address', email: 'mock@orbit.ai', status: 'active', created_at: '2023-01-01', phone: '123456789' } };
})
