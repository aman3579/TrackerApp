import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiCall } from '../utils/api';

export interface TimeBlock {
    id: string;
    title: string;
    day: string;
    startHour: number;
    duration: number;
    category: 'Work' | 'Personal' | 'Study' | 'Fitness';
}

interface PlannerContextType {
    blocks: TimeBlock[];
    addBlock: (block: Omit<TimeBlock, 'id'>) => void;
    deleteBlock: (id: string) => void;
    isLoading: boolean;
    error: string | null;
}

const PlannerContext = createContext<PlannerContextType | undefined>(undefined);

export const usePlanner = () => {
    const context = useContext(PlannerContext);
    if (!context) {
        throw new Error('usePlanner must be used within a PlannerProvider');
    }
    return context;
};

export const PlannerProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [blocks, setBlocks] = useState<TimeBlock[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load time blocks from API
    useEffect(() => {
        const loadBlocks = async () => {
            try {
                setIsLoading(true);
                const data = await apiCall('/planner');
                setBlocks(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load planner blocks:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadBlocks();
    }, []);

    const addBlock = async (block: Omit<TimeBlock, 'id'>) => {
        const newBlock: TimeBlock = {
            ...block,
            id: crypto.randomUUID(),
        };

        // Optimistic update
        setBlocks(prev => [...prev, newBlock]);

        try {
            await apiCall('/planner', {
                method: 'POST',
                body: JSON.stringify(newBlock)
            });
        } catch (err: any) {
            console.error('Failed to add time block:', err);
            setBlocks(prev => prev.filter(b => b.id !== newBlock.id));
            setError(err.message);
        }
    };

    const deleteBlock = async (id: string) => {
        const block = blocks.find(b => b.id === id);
        if (!block) return;

        // Optimistic update
        setBlocks(prev => prev.filter(b => b.id !== id));

        try {
            await apiCall(`/planner/${id}`, {
                method: 'DELETE'
            });
        } catch (err: any) {
            console.error('Failed to delete time block:', err);
            setBlocks(prev => [...prev, block]);
            setError(err.message);
        }
    };

    return (
        <PlannerContext.Provider value={{ blocks, addBlock, deleteBlock, isLoading, error }}>
            {children}
        </PlannerContext.Provider>
    );
};
