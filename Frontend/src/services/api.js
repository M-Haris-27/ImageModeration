// services/api.js
import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:7000';

// Create axios instance
const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

// Auth API calls
export const authAPI = {
    // Create new token (admin only)
    createToken: async (isAdmin = false) => {
        const response = await api.post('/auth/tokens', { isAdmin });
        return response.data;
    },

    // Get all tokens (admin only)
    getTokens: async () => {
        const response = await api.get('/auth/tokens');
        return response.data;
    },

    // Delete token (admin only)
    deleteToken: async (token) => {
        const response = await api.delete(`/auth/tokens/${token}`);
        return response.data;
    },

    // Get usage stats (admin only)
    getUsageStats: async () => {
        const response = await api.get('/auth/usage-stats');
        return response.data;
    },
};

// Moderation API calls
export const moderationAPI = {
    // Analyze/moderate image
    analyzeImage: async (file) => {
        const formData = new FormData();
        formData.append('file', file);

        const response = await api.post('/moderate/analyze', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    // Get moderation categories
    getCategories: async () => {
        const response = await api.get('/moderate/categories');
        return response.data;
    },
};

// Health check
export const healthAPI = {
    checkHealth: async () => {
        const response = await api.get('/health');
        return response.data;
    },
};

// Test token validity
export const validateToken = async (token) => {
    try {
        const response = await axios.get(`${API_BASE_URL}/moderate/categories`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        return { valid: true, data: response.data };
    } catch (error) {
        return { valid: false, error: error.response?.data?.detail || 'Invalid token' };
    }
};

export default api;