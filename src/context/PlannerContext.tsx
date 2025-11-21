import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

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

    // Load from localStorage
    useEffect(() => {
        const storedBlocks = localStorage.getItem('tracker_planner');
        if (storedBlocks) {
            try {
                setBlocks(JSON.parse(storedBlocks));
            } catch (e) {
                console.error('Failed to parse planner blocks', e);
            }
        }
    }, []);

    // Save to localStorage
    useEffect(() => {
        localStorage.setItem('tracker_planner', JSON.stringify(blocks));
    }, [blocks]);

    const addBlock = (block: Omit<TimeBlock, 'id'>) => {
        const newBlock: TimeBlock = {
            ...block,
            id: crypto.randomUUID(),
        };
        setBlocks(prev => [...prev, newBlock]);
    };

    const deleteBlock = (id: string) => {
        setBlocks(prev => prev.filter(b => b.id !== id));
    };

    return (
        <PlannerContext.Provider value={{ blocks, addBlock, deleteBlock }}>
            {children}
        </PlannerContext.Provider>
    );
};
