import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, setInStorage } from '../utils/storageUtils';

interface Milestone {
    id: string;
    title: string;
    completed: boolean;
    completedDate?: Date;
}

export interface Goal {
    id: string;
    title: string;
    description: string;
    category: 'career' | 'health' | 'learning' | 'financial' | 'personal';
    deadline?: string; // YYYY-MM-DD
    milestones: Milestone[];
    progress: number; // 0-100
    status: 'active' | 'completed' | 'archived';
    createdAt: Date;
}

interface GoalContextType {
    goals: Goal[];
    addGoal: (goal: Omit<Goal, 'id' | 'createdAt'>) => void;
    updateGoal: (id: string, updates: Partial<Goal>) => void;
    deleteGoal: (id: string) => void;
    addMilestone: (goalId: string, milestone: Omit<Milestone, 'id' | 'completed'>) => void;
    toggleMilestone: (goalId: string, milestoneId: string) => void;
    getActiveGoals: () => Goal[];
    getGoalsByCategory: (category: string) => Goal[];
}

const GoalContext = createContext<GoalContextType | undefined>(undefined);

export const GoalProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const username = currentUser?.username;

    const [goals, setGoals] = useState<Goal[]>(() => {
        return getFromStorage('goals', username, []) as Goal[];
    });

    // Reload goals when username changes (user logs in/out)
    useEffect(() => {
        if (username) {
            setGoals(getFromStorage('goals', username, []) as Goal[]);
        } else {
            setGoals([]);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            setInStorage('goals', goals, username);
        }
    }, [goals, username]);

    const addGoal = (goal: Omit<Goal, 'id' | 'createdAt'>) => {
        const newGoal: Goal = {
            ...goal,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        setGoals(prev => [newGoal, ...prev]);
    };

    const updateGoal = (id: string, updates: Partial<Goal>) => {
        setGoals(prev => prev.map(goal => (goal.id === id ? { ...goal, ...updates } : goal)));
    };

    const deleteGoal = (id: string) => {
        setGoals(prev => prev.filter(goal => goal.id !== id));
    };

    const addMilestone = (goalId: string, milestone: Omit<Milestone, 'id' | 'completed'>) => {
        setGoals(prev =>
            prev.map(goal =>
                goal.id === goalId
                    ? {
                        ...goal,
                        milestones: [
                            ...goal.milestones,
                            {
                                ...milestone,
                                id: Date.now().toString(),
                                completed: false,
                            },
                        ],
                    }
                    : goal
            )
        );
    };

    const toggleMilestone = (goalId: string, milestoneId: string) => {
        setGoals(prev =>
            prev.map(goal => {
                if (goal.id === goalId) {
                    const updatedMilestones = goal.milestones.map(m =>
                        m.id === milestoneId
                            ? { ...m, completed: !m.completed, completedDate: !m.completed ? new Date() : undefined }
                            : m
                    );
                    const completedCount = updatedMilestones.filter(m => m.completed).length;
                    const progress = updatedMilestones.length > 0
                        ? (completedCount / updatedMilestones.length) * 100
                        : 0;
                    return { ...goal, milestones: updatedMilestones, progress };
                }
                return goal;
            })
        );
    };

    const getActiveGoals = () => {
        return goals.filter(goal => goal.status === 'active');
    };

    const getGoalsByCategory = (category: string) => {
        return goals.filter(goal => goal.category === category);
    };

    return (
        <GoalContext.Provider
            value={{
                goals,
                addGoal,
                updateGoal,
                deleteGoal,
                addMilestone,
                toggleMilestone,
                getActiveGoals,
                getGoalsByCategory,
            }}
        >
            {children}
        </GoalContext.Provider>
    );
};

export const useGoal = () => {
    const context = useContext(GoalContext);
    if (!context) {
        throw new Error('useGoal must be used within GoalProvider');
    }
    return context;
};
