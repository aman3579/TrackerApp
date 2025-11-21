import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { format, isSameDay, subDays } from 'date-fns';
import { apiCall } from '../utils/api';

export interface Habit {
    id: string;
    title: string;
    frequency: string[]; // 'Mon', 'Tue', etc. or 'Daily'
    completedDates: string[]; // ISO date strings YYYY-MM-DD
    streak: number;
    createdAt: number;
}

interface HabitContextType {
    habits: Habit[];
    addHabit: (title: string, frequency: string[]) => void;
    toggleHabitCompletion: (id: string, date: Date) => void;
    deleteHabit: (id: string) => void;
    isLoading: boolean;
    error: string | null;
}

const HabitContext = createContext<HabitContextType | undefined>(undefined);

export const useHabits = () => {
    const context = useContext(HabitContext);
    if (!context) {
        throw new Error('useHabits must be used within a HabitProvider');
    }
    return context;
};

export const HabitProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [habits, setHabits] = useState<Habit[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load habits from API
    useEffect(() => {
        const loadHabits = async () => {
            try {
                setIsLoading(true);
                const data = await apiCall('/habits');
                setHabits(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load habits:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadHabits();
    }, []);

    const calculateStreak = (completedDates: string[]): number => {
        if (completedDates.length === 0) return 0;

        const sortedDates = [...completedDates].sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
        const today = format(new Date(), 'yyyy-MM-dd');
        const yesterday = format(subDays(new Date(), 1), 'yyyy-MM-dd');

        // Check if streak is active (completed today or yesterday)
        if (sortedDates[0] !== today && sortedDates[0] !== yesterday) {
            return 0;
        }

        let streak = 1;
        let currentDate = new Date(sortedDates[0]);

        for (let i = 1; i < sortedDates.length; i++) {
            const prevDate = new Date(sortedDates[i]);
            const expectedPrevDate = subDays(currentDate, 1);

            if (isSameDay(prevDate, expectedPrevDate)) {
                streak++;
                currentDate = prevDate;
            } else {
                break;
            }
        }
        return streak;
    };

    const addHabit = async (title: string, frequency: string[] = ['Daily']) => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            title,
            frequency,
            completedDates: [],
            streak: 0,
            createdAt: Date.now(),
        };

        // Optimistic update
        setHabits(prev => [newHabit, ...prev]);

        try {
            await apiCall('/habits', {
                method: 'POST',
                body: JSON.stringify(newHabit)
            });
        } catch (err: any) {
            console.error('Failed to add habit:', err);
            setHabits(prev => prev.filter(h => h.id !== newHabit.id));
            setError(err.message);
        }
    };

    const toggleHabitCompletion = async (id: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        const isCompleted = habit.completedDates.includes(dateStr);
        let newCompletedDates;

        if (isCompleted) {
            newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
        } else {
            newCompletedDates = [...habit.completedDates, dateStr];
        }

        const updatedHabit = {
            ...habit,
            completedDates: newCompletedDates,
            streak: calculateStreak(newCompletedDates)
        };

        // Optimistic update
        setHabits(prev => prev.map(h => h.id === id ? updatedHabit : h));

        try {
            await apiCall(`/habits/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedHabit)
            });
        } catch (err: any) {
            console.error('Failed to toggle habit:', err);
            setHabits(prev => prev.map(h => h.id === id ? habit : h));
            setError(err.message);
        }
    };

    const deleteHabit = async (id: string) => {
        const habit = habits.find(h => h.id === id);
        if (!habit) return;

        // Optimistic update
        setHabits(prev => prev.filter(h => h.id !== id));

        try {
            await apiCall(`/habits/${id}`, {
                method: 'DELETE'
            });
        } catch (err: any) {
            console.error('Failed to delete habit:', err);
            setHabits(prev => [...prev, habit]);
            setError(err.message);
        }
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabitCompletion, deleteHabit, isLoading, error }}>
            {children}
        </HabitContext.Provider>
    );
};
