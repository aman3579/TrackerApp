import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { format, isSameDay, subDays } from 'date-fns';

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

    // Load from local storage
    useEffect(() => {
        const storedHabits = localStorage.getItem('tracker_habits');
        if (storedHabits) {
            try {
                setHabits(JSON.parse(storedHabits));
            } catch (e) {
                console.error('Failed to parse habits', e);
            }
        }
    }, []);

    // Save to local storage
    useEffect(() => {
        localStorage.setItem('tracker_habits', JSON.stringify(habits));
    }, [habits]);

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

    const addHabit = (title: string, frequency: string[] = ['Daily']) => {
        const newHabit: Habit = {
            id: crypto.randomUUID(),
            title,
            frequency,
            completedDates: [],
            streak: 0,
            createdAt: Date.now(),
        };
        setHabits(prev => [newHabit, ...prev]);
    };

    const toggleHabitCompletion = (id: string, date: Date) => {
        const dateStr = format(date, 'yyyy-MM-dd');

        setHabits(prev => prev.map(habit => {
            if (habit.id !== id) return habit;

            const isCompleted = habit.completedDates.includes(dateStr);
            let newCompletedDates;

            if (isCompleted) {
                newCompletedDates = habit.completedDates.filter(d => d !== dateStr);
            } else {
                newCompletedDates = [...habit.completedDates, dateStr];
            }

            return {
                ...habit,
                completedDates: newCompletedDates,
                streak: calculateStreak(newCompletedDates)
            };
        }));
    };

    const deleteHabit = (id: string) => {
        setHabits(prev => prev.filter(habit => habit.id !== id));
    };

    return (
        <HabitContext.Provider value={{ habits, addHabit, toggleHabitCompletion, deleteHabit }}>
            {children}
        </HabitContext.Provider>
    );
};
