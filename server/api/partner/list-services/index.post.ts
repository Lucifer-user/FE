export default defineEventHandler(async (event) => {
    // Mocked response for UI template
    const method = event.method;
    
    if (method === 'GET') {
        return { data: [], message: 'Mocked data' };
    }
    
    return { success: true, message: 'Action mocked successfully' };
})
