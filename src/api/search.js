import api from './index';

// Type can be 'account', 'lead', 'opportunity'
// This is a deprecated endpoint but kept for safety if any legacy code calls it.
// The real search happens client-side now.
export const searchRecords = async (type, query) => {
    try {
        return await api.get(`/search`, { params: { type, query } });
    } catch (error) {
        console.warn("Search endpoint failed, using mock data.", error);
        return {
            data: {
                data: []
            }
        };
    }
};
