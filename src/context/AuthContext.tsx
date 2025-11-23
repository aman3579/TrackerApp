import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';

interface User {
    id: string;
    username: string;
    password: string; // Simple hash for demo purposes
    createdAt: Date;
    displayName?: string;
}

interface AuthContextType {
    currentUser: User | null;
    isAuthenticated: boolean;
    login: (username: string, password: string) => boolean;
    register: (username: string, password: string) => boolean;
    logout: () => void;
    getAllUsers: () => User[];
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Simple hash function for demo purposes (NOT secure for production)
const simpleHash = (str: string): string => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash;
    }
    return hash.toString(36);
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<User | null>(null);

    // Load users and current session from localStorage
    useEffect(() => {
        const sessionUser = localStorage.getItem('tracker_current_user');
        if (sessionUser) {
            const users = getStoredUsers();
            const user = users.find(u => u.username === sessionUser);
            if (user) {
                setCurrentUser(user);
            } else {
                localStorage.removeItem('tracker_current_user');
            }
        }
    }, []);

    const getStoredUsers = (): User[] => {
        const usersJson = localStorage.getItem('tracker_users');
        if (!usersJson) return [];
        try {
            return JSON.parse(usersJson);
        } catch {
            return [];
        }
    };

    const saveUsers = (users: User[]) => {
        localStorage.setItem('tracker_users', JSON.stringify(users));
    };

    const register = (username: string, password: string): boolean => {
        // Validation
        if (!username || !password) {
            return false;
        }

        if (username.length < 3) {
            alert('Username must be at least 3 characters long');
            return false;
        }

        if (password.length < 4) {
            alert('Password must be at least 4 characters long');
            return false;
        }

        const users = getStoredUsers();

        // Check if username already exists
        if (users.some(u => u.username.toLowerCase() === username.toLowerCase())) {
            alert('Username already exists');
            return false;
        }

        // Create new user
        const newUser: User = {
            id: Date.now().toString(),
            username: username,
            password: simpleHash(password),
            createdAt: new Date(),
            displayName: username,
        };

        users.push(newUser);
        saveUsers(users);

        // Auto-login after registration
        setCurrentUser(newUser);
        localStorage.setItem('tracker_current_user', username);

        return true;
    };

    const login = (username: string, password: string): boolean => {
        const users = getStoredUsers();
        const hashedPassword = simpleHash(password);

        const user = users.find(
            u => u.username.toLowerCase() === username.toLowerCase() &&
                u.password === hashedPassword
        );

        if (user) {
            setCurrentUser(user);
            localStorage.setItem('tracker_current_user', username);
            return true;
        }

        alert('Invalid username or password');
        return false;
    };

    const logout = () => {
        setCurrentUser(null);
        localStorage.removeItem('tracker_current_user');
    };

    const getAllUsers = (): User[] => {
        return getStoredUsers();
    };

    const value: AuthContextType = {
        currentUser,
        isAuthenticated: currentUser !== null,
        login,
        register,
        logout,
        getAllUsers,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
