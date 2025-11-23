import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, setInStorage } from '../utils/storageUtils';

interface Exercise {
    id: string;
    name: string;
    category: 'cardio' | 'strength' | 'flexibility' | 'sports';
    muscleGroups: string[];
    difficulty: 'beginner' | 'intermediate' | 'advanced';
    description: string;
}

interface WorkoutLog {
    id: string;
    date: Date;
    exerciseId: string;
    exerciseName: string;
    sets?: number;
    reps?: number;
    weight?: number; // in kg
    duration?: number; // in minutes
    notes?: string;
}

interface ExerciseContextType {
    exercises: Exercise[];
    workoutLogs: WorkoutLog[];
    addWorkoutLog: (log: Omit<WorkoutLog, 'id'>) => void;
    deleteWorkoutLog: (id: string) => void;
    getTodayWorkouts: () => WorkoutLog[];
    getWeeklyWorkouts: () => WorkoutLog[];
    getTotalWorkouts: () => number;
}

const ExerciseContext = createContext<ExerciseContextType | undefined>(undefined);

// Predefined exercise library
const exerciseLibrary: Exercise[] = [
    // Cardio
    { id: '1', name: 'Running', category: 'cardio', muscleGroups: ['legs', 'core'], difficulty: 'beginner', description: 'Great for cardiovascular health' },
    { id: '2', name: 'Cycling', category: 'cardio', muscleGroups: ['legs'], difficulty: 'beginner', description: 'Low-impact cardio exercise' },
    { id: '3', name: 'Jump Rope', category: 'cardio', muscleGroups: ['legs', 'arms', 'core'], difficulty: 'intermediate', description: 'High-intensity cardio' },
    { id: '4', name: 'Swimming', category: 'cardio', muscleGroups: ['full body'], difficulty: 'intermediate', description: 'Full-body cardio workout' },
    { id: '5', name: 'HIIT', category: 'cardio', muscleGroups: ['full body'], difficulty: 'advanced', description: 'High-intensity interval training' },

    // Strength
    { id: '6', name: 'Push-ups', category: 'strength', muscleGroups: ['chest', 'arms', 'core'], difficulty: 'beginner', description: 'Upper body strength exercise' },
    { id: '7', name: 'Pull-ups', category: 'strength', muscleGroups: ['back', 'arms'], difficulty: 'intermediate', description: 'Back and arm strength' },
    { id: '8', name: 'Squats', category: 'strength', muscleGroups: ['legs', 'glutes'], difficulty: 'beginner', description: 'Lower body strength' },
    { id: '9', name: 'Bench Press', category: 'strength', muscleGroups: ['chest', 'arms'], difficulty: 'intermediate', description: 'Chest and tricep strength' },
    { id: '10', name: 'Deadlifts', category: 'strength', muscleGroups: ['back', 'legs', 'core'], difficulty: 'advanced', description: 'Compound full-body exercise' },
    { id: '11', name: 'Lunges', category: 'strength', muscleGroups: ['legs', 'glutes'], difficulty: 'beginner', description: 'Single-leg strength' },
    { id: '12', name: 'Plank', category: 'strength', muscleGroups: ['core'], difficulty: 'beginner', description: 'Core stability exercise' },
    { id: '13', name: 'Dumbbell Rows', category: 'strength', muscleGroups: ['back', 'arms'], difficulty: 'intermediate', description: 'Back strength exercise' },
    { id: '14', name: 'Shoulder Press', category: 'strength', muscleGroups: ['shoulders', 'arms'], difficulty: 'intermediate', description: 'Shoulder strength' },
    { id: '15', name: 'Bicep Curls', category: 'strength', muscleGroups: ['arms'], difficulty: 'beginner', description: 'Arm strength exercise' },

    // Flexibility
    { id: '16', name: 'Yoga', category: 'flexibility', muscleGroups: ['full body'], difficulty: 'beginner', description: 'Flexibility and mindfulness' },
    { id: '17', name: 'Stretching', category: 'flexibility', muscleGroups: ['full body'], difficulty: 'beginner', description: 'Improve flexibility' },
    { id: '18', name: 'Pilates', category: 'flexibility', muscleGroups: ['core', 'full body'], difficulty: 'intermediate', description: 'Core strength and flexibility' },
    { id: '19', name: 'Dynamic Stretching', category: 'flexibility', muscleGroups: ['full body'], difficulty: 'beginner', description: 'Active stretching routine' },
    { id: '20', name: 'Foam Rolling', category: 'flexibility', muscleGroups: ['full body'], difficulty: 'beginner', description: 'Myofascial release' },

    // Sports
    { id: '21', name: 'Basketball', category: 'sports', muscleGroups: ['legs', 'arms', 'core'], difficulty: 'intermediate', description: 'Team sport activity' },
    { id: '22', name: 'Soccer', category: 'sports', muscleGroups: ['legs', 'core'], difficulty: 'intermediate', description: 'Cardio and agility' },
    { id: '23', name: 'Tennis', category: 'sports', muscleGroups: ['arms', 'legs', 'core'], difficulty: 'intermediate', description: 'Racquet sport' },
    { id: '24', name: 'Badminton', category: 'sports', muscleGroups: ['arms', 'legs'], difficulty: 'beginner', description: 'Indoor racquet sport' },
    { id: '25', name: 'Martial Arts', category: 'sports', muscleGroups: ['full body'], difficulty: 'intermediate', description: 'Combat sport training' },
];

export const ExerciseProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const username = currentUser?.username;

    const [workoutLogs, setWorkoutLogs] = useState<WorkoutLog[]>(() => {
        return getFromStorage('workout_logs', username, []) as WorkoutLog[];
    });

    // Reload workout logs when username changes (user logs in/out)
    useEffect(() => {
        if (username) {
            setWorkoutLogs(getFromStorage('workout_logs', username, []) as WorkoutLog[]);
        } else {
            setWorkoutLogs([]);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            setInStorage('workout_logs', workoutLogs, username);
        }
    }, [workoutLogs, username]);

    const addWorkoutLog = (log: Omit<WorkoutLog, 'id'>) => {
        const newLog: WorkoutLog = {
            ...log,
            id: Date.now().toString(),
        };
        setWorkoutLogs(prev => [newLog, ...prev]);
    };

    const deleteWorkoutLog = (id: string) => {
        setWorkoutLogs(prev => prev.filter(log => log.id !== id));
    };

    const getTodayWorkouts = () => {
        const today = new Date().toDateString();
        return workoutLogs.filter(log => new Date(log.date).toDateString() === today);
    };

    const getWeeklyWorkouts = () => {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return workoutLogs.filter(log => new Date(log.date) >= weekAgo);
    };

    const getTotalWorkouts = () => {
        return workoutLogs.length;
    };

    return (
        <ExerciseContext.Provider
            value={{
                exercises: exerciseLibrary,
                workoutLogs,
                addWorkoutLog,
                deleteWorkoutLog,
                getTodayWorkouts,
                getWeeklyWorkouts,
                getTotalWorkouts,
            }}
        >
            {children}
        </ExerciseContext.Provider>
    );
};

export const useExercise = () => {
    const context = useContext(ExerciseContext);
    if (!context) {
        throw new Error('useExercise must be used within ExerciseProvider');
    }
    return context;
};
