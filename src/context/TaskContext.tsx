import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export interface Task {
    id: string;
    title: string;
    completed: boolean;
    dueDate?: string;
    priority: 'low' | 'medium' | 'high';
    createdAt: number;
}

interface TaskContextType {
    tasks: Task[];
    addTask: (title: string, dueDate?: string, priority?: 'low' | 'medium' | 'high') => void;
    toggleTask: (id: string) => void;
    deleteTask: (id: string) => void;
    updateTask: (id: string, updates: Partial<Task>) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export const useTasks = () => {
    const context = useContext(TaskContext);
    if (!context) {
        throw new Error('useTasks must be used within a TaskProvider');
    }
    return context;
};

export const TaskProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [tasks, setTasks] = useState<Task[]>([]);

    // Load from API
    useEffect(() => {
        fetch('http://localhost:3001/api/tasks')
            .then(res => res.json())
            .then(data => setTasks(data))
            .catch(err => console.error('Failed to load tasks', err));
    }, []);

    // Save to API
    useEffect(() => {
        if (tasks.length > 0) {
            fetch('http://localhost:3001/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(tasks)
            }).catch(err => console.error('Failed to save tasks', err));
        }
    }, [tasks]);

    const addTask = (title: string, dueDate?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            dueDate,
            priority,
            createdAt: Date.now(),
        };
        setTasks(prev => [newTask, ...prev]);
    };

    const toggleTask = (id: string) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, completed: !task.completed } : task
        ));
    };

    const deleteTask = (id: string) => {
        setTasks(prev => prev.filter(task => task.id !== id));
    };

    const updateTask = (id: string, updates: Partial<Task>) => {
        setTasks(prev => prev.map(task =>
            task.id === id ? { ...task, ...updates } : task
        ));
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, updateTask }}>
            {children}
        </TaskContext.Provider>
    );
};
