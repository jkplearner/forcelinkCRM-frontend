import api from './index';
import { getAccounts } from './accounts';

export const getNotes = async () => {
    try {
        // 1. Fetch all accounts to get potential parent IDs
        const accountsRes = await getAccounts();
        // Handle various response shapes safely
        const accounts = accountsRes.data?.data || (Array.isArray(accountsRes.data) ? accountsRes.data : []);

        if (!accounts.length) {
            return { data: { data: [] } };
        }

        // 2. Fetch notes for each account in parallel
        const notesPromises = accounts.map(async (acc) => {
            // Prefer sfId (Salesforce ID), fallback if needed. The Autocomplete uses 'Id' or 'sfId', ensuring we have a valid Salesforce ID.
            const relatedId = acc.sfId || acc.Id || acc._id;
            if (!relatedId) return [];

            try {
                // Endpoint: GET /api/notes/{relatedSfId}
                const res = await api.get(`/notes/${relatedId}`);
                // Backend returns { success: true, data: [...] }
                return Array.isArray(res.data?.data) ? res.data.data : [];
            } catch (err) {
                // Ignore 404s or errors for specific accounts (simply means no notes for this account)
                return [];
            }
        });

        const nestedNotes = await Promise.all(notesPromises);
        const allNotes = nestedNotes.flat();

        return {
            data: {
                data: allNotes
            }
        };
    } catch (error) {
        console.error("Error aggregating notes:", error);
        // Return empty list on general failure rather than mock data
        return { data: { data: [] } };
    }
};

export const createNote = (body) => {
    // User verified payload uses strictly these keys:
    const sfBody = {
        title: body.title,
        content: body.content,
        relatedSfId: body.relatedSfId
    };
    return api.post("/notes", sfBody);
};

export const deleteNote = (id) => api.delete(`/notes/${id}`);

