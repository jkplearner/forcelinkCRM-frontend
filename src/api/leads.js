import api from './index';

export const getLeads = () => api.get("/leads");

export const createLead = (body) => {
    return api.post("/leads", {
        salutation: body.salutation || null,
        firstName: body.firstName || null,
        lastName: body.lastName,           // REQUIRED
        company: body.company,             // REQUIRED
        status: body.status,               // REQUIRED
        email: body.email || null,
        phone: body.phone || null,
        mobilePhone: body.mobilePhone || null,
        website: body.website || null,
        industry: body.industry || null,
        leadSource: body.leadSource || null,
        rating: body.rating || null,
        annualRevenue: body.annualRevenue ? Number(body.annualRevenue) : null,
        numberOfEmployees: body.numberOfEmployees ? Number(body.numberOfEmployees) : null
    });
};

export const updateLead = (id, body) => api.patch(`/leads/${id}`, body);
export const deleteLead = (id) => api.delete(`/leads/${id}`);

