import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, setInStorage } from '../utils/storageUtils';

interface MeditationSession {
    id: string;
    date: Date;
    duration: number; // in minutes
    type: string;
}

interface WaterLog {
    date: string; // YYYY-MM-DD
    glasses: number;
}

interface SleepLog {
    id: string;
    date: string; // YYYY-MM-DD
    hours: number;
    quality: number; // 1-5 stars
    notes?: string;
}

interface WellnessContextType {
    meditationSessions: MeditationSession[];
    waterLogs: WaterLog[];
    sleepLogs: SleepLog[];
    dailyWaterGoal: number;
    addMeditationSession: (session: Omit<MeditationSession, 'id'>) => void;
    addWaterGlass: (date: string) => void;
    removeWaterGlass: (date: string) => void;
    getTodayWater: () => number;
    addSleepLog: (log: Omit<SleepLog, 'id'>) => void;
    updateSleepLog: (id: string, updates: Partial<SleepLog>) => void;
    deleteSleepLog: (id: string) => void;
    getTotalMeditationTime: () => number;
    getAverageSleep: () => number;
}

const WellnessContext = createContext<WellnessContextType | undefined>(undefined);

export const WellnessProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const username = currentUser?.username;

    const [meditationSessions, setMeditationSessions] = useState<MeditationSession[]>(() => {
        return getFromStorage('meditation_sessions', username, []) as MeditationSession[];
    });

    const [waterLogs, setWaterLogs] = useState<WaterLog[]>(() => {
        return getFromStorage('water_logs', username, []) as WaterLog[];
    });

    const [sleepLogs, setSleepLogs] = useState<SleepLog[]>(() => {
        return getFromStorage('sleep_logs', username, []) as SleepLog[];
    });

    const dailyWaterGoal = 8; // 8 glasses per day

    // Reload data when username changes (user logs in/out)
    useEffect(() => {
        if (username) {
            setMeditationSessions(getFromStorage('meditation_sessions', username, []) as MeditationSession[]);
            setWaterLogs(getFromStorage('water_logs', username, []) as WaterLog[]);
            setSleepLogs(getFromStorage('sleep_logs', username, []) as SleepLog[]);
        } else {
            setMeditationSessions([]);
            setWaterLogs([]);
            setSleepLogs([]);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            setInStorage('meditation_sessions', meditationSessions, username);
        }
    }, [meditationSessions, username]);

    useEffect(() => {
        if (username) {
            setInStorage('water_logs', waterLogs, username);
        }
    }, [waterLogs, username]);

    useEffect(() => {
        if (username) {
            setInStorage('sleep_logs', sleepLogs, username);
        }
    }, [sleepLogs, username]);

    const addMeditationSession = (session: Omit<MeditationSession, 'id'>) => {
        const newSession: MeditationSession = {
            ...session,
            id: Date.now().toString(),
        };
        setMeditationSessions(prev => [newSession, ...prev]);
    };

    const addWaterGlass = (date: string) => {
        setWaterLogs(prev => {
            const existing = prev.find(log => log.date === date);
            if (existing) {
                return prev.map(log =>
                    log.date === date ? { ...log, glasses: log.glasses + 1 } : log
                );
            }
            return [...prev, { date, glasses: 1 }];
        });
    };

    const removeWaterGlass = (date: string) => {
        setWaterLogs(prev =>
            prev.map(log =>
                log.date === date && log.glasses > 0
                    ? { ...log, glasses: log.glasses - 1 }
                    : log
            )
        );
    };

    const getTodayWater = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayLog = waterLogs.find(log => log.date === today);
        return todayLog ? todayLog.glasses : 0;
    };

    const addSleepLog = (log: Omit<SleepLog, 'id'>) => {
        const newLog: SleepLog = {
            ...log,
            id: Date.now().toString(),
        };
        setSleepLogs(prev => [newLog, ...prev]);
    };

    const updateSleepLog = (id: string, updates: Partial<SleepLog>) => {
        setSleepLogs(prev => prev.map(log => (log.id === id ? { ...log, ...updates } : log)));
    };

    const deleteSleepLog = (id: string) => {
        setSleepLogs(prev => prev.filter(log => log.id !== id));
    };

    const getTotalMeditationTime = () => {
        return meditationSessions.reduce((total, session) => total + session.duration, 0);
    };

    const getAverageSleep = () => {
        if (sleepLogs.length === 0) return 0;
        const totalHours = sleepLogs.reduce((sum, log) => sum + log.hours, 0);
        return totalHours / sleepLogs.length;
    };

    return (
        <WellnessContext.Provider
            value={{
                meditationSessions,
                waterLogs,
                sleepLogs,
                dailyWaterGoal,
                addMeditationSession,
                addWaterGlass,
                removeWaterGlass,
                getTodayWater,
                addSleepLog,
                updateSleepLog,
                deleteSleepLog,
                getTotalMeditationTime,
                getAverageSleep,
            }}
        >
            {children}
        </WellnessContext.Provider>
    );
};

export const useWellness = () => {
    const context = useContext(WellnessContext);
    if (!context) {
        throw new Error('useWellness must be used within WellnessProvider');
    }
    return context;
};
