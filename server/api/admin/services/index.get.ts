export default defineEventHandler(async (event) => {
    return { data: [
        { id: '1', name: 'GPT-4 AI Model', description: 'Advanced AI', type: 'LLM', status: 'active', provider: 'OpenAI', is_system: true }
    ] };
})
