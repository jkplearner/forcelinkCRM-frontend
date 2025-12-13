import api from './index';

export const getTasks = () => api.get("/tasks");

export const createTask = (body) => {
    // Strict mapping to MongoDB Local Task Spec (camelCase)
    const localBody = {
        subject: body.subject,   // Required
        status: body.status,     // Required
        priority: body.priority,
        dueDate: body.dueDate,
        description: body.description // Optional extra
    };
    return api.post("/tasks", localBody);
};

export const updateTask = (id, body) => api.patch(`/tasks/${id}`, body);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);

