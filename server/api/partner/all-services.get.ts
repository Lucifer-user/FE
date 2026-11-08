export default defineEventHandler(async (event) => {
    return { data: [
        { id: 'gpt4', name: 'GPT-4 AI Model' },
        { id: 'claude3', name: 'Claude 3 Opus' }
    ] };
})
