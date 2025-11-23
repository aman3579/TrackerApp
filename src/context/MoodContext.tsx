import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, setInStorage } from '../utils/storageUtils';

export interface MoodEntry {
    id: string;
    date: string; // YYYY-MM-DD
    rating: number; // 1-10
    emotions: string[]; // e.g., ['happy', 'energetic', 'calm']
    notes?: string;
    gratitude?: string;
}

interface MoodContextType {
    moodEntries: MoodEntry[];
    addMoodEntry: (entry: Omit<MoodEntry, 'id'>) => void;
    updateMoodEntry: (id: string, updates: Partial<MoodEntry>) => void;
    deleteMoodEntry: (id: string) => void;
    getTodayMood: () => MoodEntry | undefined;
    getAverageMood: (days: number) => number;
}

const MoodContext = createContext<MoodContextType | undefined>(undefined);

export const MoodProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const username = currentUser?.username;

    const [entries, setEntries] = useState<MoodEntry[]>(() => {
        return getFromStorage('mood_entries', username, []) as MoodEntry[];
    });

    // Reload entries when username changes (user logs in/out)
    useEffect(() => {
        if (username) {
            setEntries(getFromStorage('mood_entries', username, []) as MoodEntry[]);
        } else {
            setEntries([]);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            setInStorage('mood_entries', entries, username);
        }
    }, [entries, username]);

    const addMoodEntry = (entry: Omit<MoodEntry, 'id'>) => {
        const newEntry: MoodEntry = {
            ...entry,
            id: Date.now().toString(),
        };
        // Replace entry if one already exists for the same date
        setEntries(prev => {
            const filtered = prev.filter(e => e.date !== entry.date);
            return [newEntry, ...filtered];
        });
    };

    const updateMoodEntry = (id: string, updates: Partial<MoodEntry>) => {
        setEntries(prev => prev.map(entry => (entry.id === id ? { ...entry, ...updates } : entry)));
    };

    const deleteMoodEntry = (id: string) => {
        setEntries(prev => prev.filter(entry => entry.id !== id));
    };

    const getTodayMood = () => {
        const today = new Date().toISOString().split('T')[0];
        return entries.find(entry => entry.date === today);
    };

    const getAverageMood = (days: number) => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - days);
        const recentEntries = entries.filter(entry => new Date(entry.date) >= cutoff);
        if (recentEntries.length === 0) return 0;
        const total = recentEntries.reduce((sum, entry) => sum + entry.rating, 0);
        return total / recentEntries.length;
    };

    return (
        <MoodContext.Provider
            value={{
                moodEntries: entries,
                addMoodEntry,
                updateMoodEntry,
                deleteMoodEntry,
                getTodayMood,
                getAverageMood,
            }}
        >
            {children}
        </MoodContext.Provider>
    );
};

export const useMood = () => {
    const context = useContext(MoodContext);
    if (!context) {
        throw new Error('useMood must be used within MoodProvider');
    }
    return context;
};
