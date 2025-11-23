// Storage utility to get username-namespaced localStorage keys
export const getStorageKey = (key: string, username?: string | null): string => {
    if (!username) {
        // Fallback for when no user is logged in (shouldn't happen in normal flow)
        return key;
    }
    return `tracker_${username}_${key}`;
};

// Helper to safely get data from localStorage
export const getFromStorage = <T,>(key: string, username?: string | null, defaultValue?: T): T | null => {
    try {
        const storageKey = getStorageKey(key, username);
        const item = localStorage.getItem(storageKey);
        return item ? JSON.parse(item) : (defaultValue ?? null);
    } catch (error) {
        console.error(`Error reading from localStorage (${key}):`, error);
        return defaultValue ?? null;
    }
};

// Helper to safely set data in localStorage
export const setInStorage = (key: string, value: unknown, username?: string | null): void => {
    try {
        const storageKey = getStorageKey(key, username);
        localStorage.setItem(storageKey, JSON.stringify(value));
    } catch (error) {
        console.error(`Error writing to localStorage (${key}):`, error);
    }
};

// Helper to remove data from localStorage
export const removeFromStorage = (key: string, username?: string | null): void => {
    try {
        const storageKey = getStorageKey(key, username);
        localStorage.removeItem(storageKey);
    } catch (error) {
        console.error(`Error removing from localStorage (${key}):`, error);
    }
};
