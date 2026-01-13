import api from './index';

// POST /api/ai/ask - Send user prompt to backend AI service
export const askAI = (prompt) => api.post('/ai/ask', { prompt });
