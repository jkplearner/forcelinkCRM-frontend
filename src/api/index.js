import axios from "axios";

// Access token from localStorage
const token = localStorage.getItem("token");

const api = axios.create({
    baseURL: `${import.meta.env.VITE_BACKEND_URL}/api`,
    headers: {
        "Content-Type": "application/json"
    }
});

// Add a request interceptor to include the auth token
api.interceptors.request.use(
    (config) => {
        const currentToken = localStorage.getItem("token");
        if (currentToken) {
            config.headers.Authorization = `Bearer ${currentToken}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default api;
