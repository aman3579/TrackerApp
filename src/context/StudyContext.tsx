import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { useAuth } from './AuthContext';
import { getFromStorage, setInStorage } from '../utils/storageUtils';

interface StudySession {
    id: string;
    startTime: Date;
    endTime: Date;
    duration: number;
    type: 'pomodoro' | 'focus';
    notes?: string;
}

interface QuickNote {
    id: string;
    content: string;
    subject?: string;
    createdAt: Date;
}

interface PomodoroSettings {
    workDuration: number; // in minutes
    shortBreakDuration: number;
    longBreakDuration: number;
    sessionsUntilLongBreak: number;
    autoStartBreaks: boolean;
    autoStartPomodoros: boolean;
}

interface StudyContextType {
    sessions: StudySession[];
    quickNotes: QuickNote[];
    studyStreak: number;
    totalStudyTime: number;
    todayStudyTime: number;
    pomodoroSettings: PomodoroSettings;
    addSession: (session: Omit<StudySession, 'id'>) => void;
    deleteSession: (id: string) => void;
    addQuickNote: (note: Omit<QuickNote, 'id' | 'createdAt'>) => void;
    updateQuickNote: (id: string, content: string, subject?: string) => void;
    deleteQuickNote: (id: string) => void;
    updatePomodoroSettings: (settings: Partial<PomodoroSettings>) => void;
    updateStudyStreak: () => void;
}

const StudyContext = createContext<StudyContextType | undefined>(undefined);

const defaultPomodoroSettings: PomodoroSettings = {
    workDuration: 25,
    shortBreakDuration: 5,
    longBreakDuration: 15,
    sessionsUntilLongBreak: 4,
    autoStartBreaks: false,
    autoStartPomodoros: false,
};

export const StudyProvider = ({ children }: { children: ReactNode }) => {
    const { currentUser } = useAuth();
    const username = currentUser?.username;

    const [sessions, setSessions] = useState<StudySession[]>(() => {
        return getFromStorage('study_sessions', username, []) as StudySession[];
    });

    const [quickNotes, setQuickNotes] = useState<QuickNote[]>(() => {
        return getFromStorage('quick_notes', username, []) as QuickNote[];
    });

    const [studyStreak, setStudyStreak] = useState<number>(() => {
        return getFromStorage('study_streak', username, 0) as number;
    });

    const [pomodoroSettings, setPomodoroSettings] = useState<PomodoroSettings>(() => {
        return getFromStorage('pomodoro_settings', username, defaultPomodoroSettings) as PomodoroSettings;
    });

    const [lastStudyDate, setLastStudyDate] = useState<string | null>(() => {
        return getFromStorage('last_study_date', username, null) as string | null;
    });

    // Reload all study data when username changes (user logs in/out)
    useEffect(() => {
        if (username) {
            setSessions(getFromStorage('study_sessions', username, []) as StudySession[]);
            setQuickNotes(getFromStorage('quick_notes', username, []) as QuickNote[]);
            setStudyStreak(getFromStorage('study_streak', username, 0) as number);
            setPomodoroSettings(getFromStorage('pomodoro_settings', username, defaultPomodoroSettings) as PomodoroSettings);
            setLastStudyDate(getFromStorage('last_study_date', username, null) as string | null);
        } else {
            setSessions([]);
            setQuickNotes([]);
            setStudyStreak(0);
            setPomodoroSettings(defaultPomodoroSettings);
            setLastStudyDate(null);
        }
    }, [username]);

    useEffect(() => {
        if (username) {
            setInStorage('study_sessions', sessions, username);
        }
    }, [sessions, username]);

    useEffect(() => {
        if (username) {
            setInStorage('quick_notes', quickNotes, username);
        }
    }, [quickNotes, username]);

    useEffect(() => {
        if (username) {
            setInStorage('study_streak', studyStreak, username);
        }
    }, [studyStreak, username]);

    useEffect(() => {
        if (username) {
            setInStorage('pomodoro_settings', pomodoroSettings, username);
        }
    }, [pomodoroSettings, username]);

    useEffect(() => {
        if (lastStudyDate && username) {
            setInStorage('last_study_date', lastStudyDate, username);
        }
    }, [lastStudyDate, username]);

    const addSession = (session: Omit<StudySession, 'id'>) => {
        const newSession: StudySession = {
            ...session,
            id: Date.now().toString(),
        };
        setSessions(prev => [newSession, ...prev]);
        updateStudyStreak();
    };

    const deleteSession = (id: string) => {
        setSessions(prev => prev.filter(s => s.id !== id));
    };

    const addQuickNote = (note: Omit<QuickNote, 'id' | 'createdAt'>) => {
        const newNote: QuickNote = {
            ...note,
            id: Date.now().toString(),
            createdAt: new Date(),
        };
        setQuickNotes(prev => [newNote, ...prev]);
    };

    const updateQuickNote = (id: string, content: string, subject?: string) => {
        setQuickNotes(prev => prev.map(note =>
            note.id === id ? { ...note, content, subject } : note
        ));
    };

    const deleteQuickNote = (id: string) => {
        setQuickNotes(prev => prev.filter(n => n.id !== id));
    };

    const updatePomodoroSettings = (settings: Partial<PomodoroSettings>) => {
        setPomodoroSettings(prev => ({ ...prev, ...settings }));
    };

    const updateStudyStreak = () => {
        const today = new Date().toDateString();
        const yesterday = new Date(Date.now() - 86400000).toDateString();

        if (lastStudyDate === today) {
            // Already studied today, don't increment
            return;
        } else if (lastStudyDate === yesterday) {
            // Studied yesterday, increment streak
            setStudyStreak(prev => prev + 1);
        } else if (!lastStudyDate) {
            // First study session ever
            setStudyStreak(1);
        } else {
            // Streak broken, reset to 1
            setStudyStreak(1);
        }
        setLastStudyDate(today);
    };

    const getTotalStudyTime = () => {
        return sessions.reduce((total, session) => total + session.duration, 0);
    };

    const getTodayStudyTime = () => {
        const today = new Date().toDateString();
        return sessions
            .filter(session => new Date(session.startTime).toDateString() === today)
            .reduce((total, session) => total + session.duration, 0);
    };

    const totalStudyTime = getTotalStudyTime();
    const todayStudyTime = getTodayStudyTime();

    return (
        <StudyContext.Provider
            value={{
                sessions,
                quickNotes,
                studyStreak,
                totalStudyTime,
                todayStudyTime,
                pomodoroSettings,
                addSession,
                deleteSession,
                addQuickNote,
                updateQuickNote,
                deleteQuickNote,
                updatePomodoroSettings,
                updateStudyStreak,
            }}
        >
            {children}
        </StudyContext.Provider>
    );
};

export const useStudy = () => {
    const context = useContext(StudyContext);
    if (!context) {
        throw new Error('useStudy must be used within StudyProvider');
    }
    return context;
};
