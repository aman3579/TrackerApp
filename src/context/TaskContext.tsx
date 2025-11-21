import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import { apiCall } from '../utils/api';

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
    isLoading: boolean;
    error: string | null;
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
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    // Load tasks from API
    useEffect(() => {
        const loadTasks = async () => {
            try {
                setIsLoading(true);
                const data = await apiCall('/tasks');
                setTasks(data);
                setError(null);
            } catch (err: any) {
                console.error('Failed to load tasks:', err);
                setError(err.message);
            } finally {
                setIsLoading(false);
            }
        };

        loadTasks();
    }, []);

    const addTask = async (title: string, dueDate?: string, priority: 'low' | 'medium' | 'high' = 'medium') => {
        const newTask: Task = {
            id: crypto.randomUUID(),
            title,
            completed: false,
            dueDate,
            priority,
            createdAt: Date.now(),
        };

        // Optimistic update
        setTasks(prev => [newTask, ...prev]);

        try {
            await apiCall('/tasks', {
                method: 'POST',
                body: JSON.stringify(newTask)
            });
        } catch (err: any) {
            console.error('Failed to add task:', err);
            // Rollback on error
            setTasks(prev => prev.filter(t => t.id !== newTask.id));
            setError(err.message);
        }
    };

    const toggleTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTask = { ...task, completed: !task.completed };

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

        try {
            await apiCall(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTask)
            });
        } catch (err: any) {
            console.error('Failed to toggle task:', err);
            // Rollback on error
            setTasks(prev => prev.map(t => t.id === id ? task : t));
            setError(err.message);
        }
    };

    const deleteTask = async (id: string) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        // Optimistic update
        setTasks(prev => prev.filter(t => t.id !== id));

        try {
            await apiCall(`/tasks/${id}`, {
                method: 'DELETE'
            });
        } catch (err: any) {
            console.error('Failed to delete task:', err);
            // Rollback on error
            setTasks(prev => [...prev, task]);
            setError(err.message);
        }
    };

    const updateTask = async (id: string, updates: Partial<Task>) => {
        const task = tasks.find(t => t.id === id);
        if (!task) return;

        const updatedTask = { ...task, ...updates };

        // Optimistic update
        setTasks(prev => prev.map(t => t.id === id ? updatedTask : t));

        try {
            await apiCall(`/tasks/${id}`, {
                method: 'PUT',
                body: JSON.stringify(updatedTask)
            });
        } catch (err: any) {
            console.error('Failed to update task:', err);
            // Rollback on error
            setTasks(prev => prev.map(t => t.id === id ? task : t));
            setError(err.message);
        }
    };

    return (
        <TaskContext.Provider value={{ tasks, addTask, toggleTask, deleteTask, updateTask, isLoading, error }}>
            {children}
        </TaskContext.Provider>
    );
};
