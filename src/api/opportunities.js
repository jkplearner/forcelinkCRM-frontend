import api from './index';

export const getOpportunities = () => api.get("/opportunities");
export const getOpportunity = (id) => api.get(`/opportunities/${id}`);

export const createOpportunity = (body) => {
    // Strict mapping to Salesforce Opportunity Object Spec (PascalCase + Custom Region__c)
    const sfBody = {
        name: body.name,
        stageName: body.stage,
        closeDate: body.closeDate,
        amount: body.amount ? Number(body.amount) : null,
        leadSource: body.leadSource,
        type: body.type,
        nextStep: body.nextStep,
        region: body.region
    };
    return api.post("/opportunities", sfBody);
};

export const updateOpportunity = (id, body) => api.patch(`/opportunities/${id}`, body);
export const deleteOpportunity = (id) => api.delete(`/opportunities/${id}`);

