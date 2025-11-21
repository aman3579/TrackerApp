// Simple user ID management
// Generates and stores a unique user ID in localStorage
// This allows multi-user support without requiring authentication

export const getUserId = (): string => {
    const STORAGE_KEY = 'tracker_user_id';

    let userId = localStorage.getItem(STORAGE_KEY);

    if (!userId) {
        // Generate a unique ID
        userId = `user_${crypto.randomUUID()}`;
        localStorage.setItem(STORAGE_KEY, userId);
    }

    return userId;
};

// API base URL - automatically uses correct URL for local and production
export const API_BASE_URL = import.meta.env.MODE === 'production'
    ? '/api'
    : 'http://localhost:3001/api';

// Helper to make authenticated API calls
export const apiCall = async (endpoint: string, options: RequestInit = {}) => {
    const userId = getUserId();

    const headers = {
        'Content-Type': 'application/json',
        'x-user-id': userId,
        ...options.headers,
    };

    const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers,
    });

    if (!response.ok) {
        throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
};
