import api from './index';

export const getAccounts = () => api.get("/accounts");

export const createAccount = (body) => {
    // Strict mapping to Salesforce Account Object Spec
    const sfBody = {
        name: body.name,
        phone: body.phone,
        website: body.website,
        type: body.type,
        ownership: body.ownership,
        industry: body.industry,
        numberOfEmployees: body.numberOfEmployees ? Number(body.numberOfEmployees) : null,
        annualRevenue: body.annualRevenue ? Number(body.annualRevenue) : null,
        rating: body.rating,
        sic: body.sic,
        lastInteractionDate: body.lastInteractionDate || null
    };
    return api.post("/accounts", sfBody);
};

export const updateAccount = (id, body) => api.patch(`/accounts/${id}`, body);
export const deleteAccount = (id) => api.delete(`/accounts/${id}`);

