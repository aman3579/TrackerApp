import { useState, useEffect, useRef } from 'react';
import { useStudy } from '../context/StudyContext';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    IconButton,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    LinearProgress,
    Paper,
    Divider,
    Alert,
} from '@mui/material';
import {
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Stop as StopIcon,
    Settings as SettingsIcon,
    LocalFireDepartment as FireIcon,
    Timer as TimerIcon,
    NoteAdd as NoteAddIcon,
    Delete as DeleteIcon,
    AccessTime as ClockIcon,
} from '@mui/icons-material';

const StudyHacks = () => {
    const {
        sessions,
        quickNotes,
        studyStreak,
        todayStudyTime,
        pomodoroSettings,
        addSession,
        addQuickNote,
        deleteQuickNote,
        updatePomodoroSettings,
    } = useStudy();

    // Pomodoro Timer State
    const [isRunning, setIsRunning] = useState(false);
    const [isPaused, setIsPaused] = useState(false);
    const [currentMode, setCurrentMode] = useState<'work' | 'shortBreak' | 'longBreak'>('work');
    const [timeLeft, setTimeLeft] = useState(pomodoroSettings.workDuration * 60);
    const [sessionCount, setSessionCount] = useState(0);
    const [sessionStartTime, setSessionStartTime] = useState<Date | null>(null);

    // Dialogs
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [noteDialogOpen, setNoteDialogOpen] = useState(false);
    const [newNote, setNewNote] = useState('');
    const [noteSubject, setNoteSubject] = useState('');

    // Settings
    const [workDuration, setWorkDuration] = useState(pomodoroSettings.workDuration);
    const [shortBreakDuration, setShortBreakDuration] = useState(pomodoroSettings.shortBreakDuration);
    const [longBreakDuration, setLongBreakDuration] = useState(pomodoroSettings.longBreakDuration);

    const timerRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    useEffect(() => {
        if (isRunning && !isPaused) {
            timerRef.current = setInterval(() => {
                setTimeLeft(prev => {
                    if (prev <= 1) {
                        handleTimerComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        }

        return () => {
            if (timerRef.current) {
                clearInterval(timerRef.current);
            }
        };
    }, [isRunning, isPaused]);

    const handleTimerComplete = () => {
        playSound();

        // Save session if it was a work session
        if (currentMode === 'work' && sessionStartTime) {
            const endTime = new Date();
            const duration = Math.floor((endTime.getTime() - sessionStartTime.getTime()) / 1000 / 60);
            addSession({
                startTime: sessionStartTime,
                endTime,
                duration,
                type: 'pomodoro',
            });
            setSessionCount(prev => prev + 1);
        }

        // Auto-transition to next mode
        if (currentMode === 'work') {
            const nextSessionCount = sessionCount + 1;
            if (nextSessionCount % pomodoroSettings.sessionsUntilLongBreak === 0) {
                setCurrentMode('longBreak');
                setTimeLeft(pomodoroSettings.longBreakDuration * 60);
            } else {
                setCurrentMode('shortBreak');
                setTimeLeft(pomodoroSettings.shortBreakDuration * 60);
            }
            if (pomodoroSettings.autoStartBreaks) {
                setIsRunning(true);
                setIsPaused(false);
            } else {
                setIsRunning(false);
            }
        } else {
            setCurrentMode('work');
            setTimeLeft(pomodoroSettings.workDuration * 60);
            if (pomodoroSettings.autoStartPomodoros) {
                setIsRunning(true);
                setIsPaused(false);
                setSessionStartTime(new Date());
            } else {
                setIsRunning(false);
            }
        }
    };

    const playSound = () => {
        if (audioRef.current) {
            audioRef.current.play();
        }
    };

    const handleStart = () => {
        setIsRunning(true);
        setIsPaused(false);
        if (currentMode === 'work' && !sessionStartTime) {
            setSessionStartTime(new Date());
        }
    };

    const handlePause = () => {
        setIsPaused(true);
    };

    const handleResume = () => {
        setIsPaused(false);
    };

    const handleStop = () => {
        setIsRunning(false);
        setIsPaused(false);
        setTimeLeft(currentMode === 'work' ? pomodoroSettings.workDuration * 60 :
            currentMode === 'shortBreak' ? pomodoroSettings.shortBreakDuration * 60 :
                pomodoroSettings.longBreakDuration * 60);
        setSessionStartTime(null);
    };

    const handleSaveSettings = () => {
        updatePomodoroSettings({
            workDuration,
            shortBreakDuration,
            longBreakDuration,
        });
        if (!isRunning) {
            setTimeLeft(workDuration * 60);
        }
        setSettingsOpen(false);
    };

    const handleAddNote = () => {
        if (newNote.trim()) {
            addQuickNote({
                content: newNote,
                subject: noteSubject || undefined,
            });
            setNewNote('');
            setNoteSubject('');
            setNoteDialogOpen(false);
        }
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const getProgress = () => {
        const total = currentMode === 'work' ? pomodoroSettings.workDuration * 60 :
            currentMode === 'shortBreak' ? pomodoroSettings.shortBreakDuration * 60 :
                pomodoroSettings.longBreakDuration * 60;
        return ((total - timeLeft) / total) * 100;
    };

    const getModeColor = () => {
        switch (currentMode) {
            case 'work': return '#6366f1';
            case 'shortBreak': return '#10b981';
            case 'longBreak': return '#ec4899';
        }
    };

    const getModeLabel = () => {
        switch (currentMode) {
            case 'work': return 'Focus Time';
            case 'shortBreak': return 'Short Break';
            case 'longBreak': return 'Long Break';
        }
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Hidden audio element for timer sound */}
            <audio ref={audioRef} src="data:audio/wav;base64,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" />

            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Study Hacks
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Master your focus with Pomodoro technique and study tracking
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Stats Row */}
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                        border: '1px solid rgba(236, 72, 153, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <FireIcon sx={{ fontSize: 40, color: '#ec4899' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {studyStreak}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Day Streak 🔥
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <ClockIcon sx={{ fontSize: 40, color: '#6366f1' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {Math.floor(todayStudyTime / 60)}h {todayStudyTime % 60}m
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Today's Focus
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <TimerIcon sx={{ fontSize: 40, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {sessionCount}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Pomodoros Today
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Pomodoro Timer */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Pomodoro Timer
                                </Typography>
                                <IconButton onClick={() => setSettingsOpen(true)} size="small">
                                    <SettingsIcon />
                                </IconButton>
                            </Stack>

                            <Box sx={{ textAlign: 'center', my: 3 }}>
                                <Chip
                                    label={getModeLabel()}
                                    sx={{
                                        bgcolor: getModeColor(),
                                        color: 'white',
                                        fontWeight: 600,
                                        fontSize: '1rem',
                                        px: 2,
                                        mb: 3
                                    }}
                                />

                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-flex',
                                        mb: 3
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 220,
                                            height: 220,
                                            borderRadius: '50%',
                                            background: `conic-gradient(${getModeColor()} ${getProgress()}%, rgba(255,255,255,0.1) ${getProgress()}%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 190,
                                                height: 190,
                                                borderRadius: '50%',
                                                bgcolor: 'background.paper',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h2" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                                {formatTime(timeLeft)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    {!isRunning || isPaused ? (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={isPaused ? <PlayIcon /> : <PlayIcon />}
                                            onClick={isPaused ? handleResume : handleStart}
                                            sx={{
                                                bgcolor: getModeColor(),
                                                '&:hover': { bgcolor: getModeColor(), opacity: 0.9 }
                                            }}
                                        >
                                            {isPaused ? 'Resume' : 'Start'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PauseIcon />}
                                            onClick={handlePause}
                                            sx={{
                                                bgcolor: '#f59e0b',
                                                '&:hover': { bgcolor: '#f59e0b', opacity: 0.9 }
                                            }}
                                        >
                                            Pause
                                        </Button>
                                    )}
                                    {(isRunning || isPaused) && (
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<StopIcon />}
                                            onClick={handleStop}
                                            color="error"
                                        >
                                            Stop
                                        </Button>
                                    )}
                                </Stack>
                            </Box>

                            {currentMode === 'work' && (
                                <Alert severity="info" icon={<TimerIcon />} sx={{ mt: 2 }}>
                                    Session {sessionCount + 1} • {pomodoroSettings.sessionsUntilLongBreak - (sessionCount % pomodoroSettings.sessionsUntilLongBreak)} before long break
                                </Alert>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Quick Notes */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Quick Notes
                                </Typography>
                                <IconButton onClick={() => setNoteDialogOpen(true)} color="primary">
                                    <NoteAddIcon />
                                </IconButton>
                            </Stack>

                            <Stack spacing={1.5} sx={{ maxHeight: 400, overflowY: 'auto' }}>
                                {quickNotes.length === 0 ? (
                                    <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                                        <Typography color="text.secondary">
                                            No quick notes yet. Capture your study insights!
                                        </Typography>
                                    </Paper>
                                ) : (
                                    quickNotes.map(note => (
                                        <Paper
                                            key={note.id}
                                            sx={{
                                                p: 2,
                                                bgcolor: 'background.default',
                                                borderLeft: '4px solid',
                                                borderColor: 'primary.main'
                                            }}
                                        >
                                            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                                <Box sx={{ flex: 1 }}>
                                                    {note.subject && (
                                                        <Chip
                                                            label={note.subject}
                                                            size="small"
                                                            sx={{ mb: 1 }}
                                                        />
                                                    )}
                                                    <Typography variant="body2">
                                                        {note.content}
                                                    </Typography>
                                                    <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                        {new Date(note.createdAt).toLocaleDateString()}
                                                    </Typography>
                                                </Box>
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteQuickNote(note.id)}
                                                    sx={{ ml: 1 }}
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            </Stack>
                                        </Paper>
                                    ))
                                )}
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Session History */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Recent Sessions
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {sessions.length === 0 ? (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                                    No study sessions yet. Start your first Pomodoro!
                                </Typography>
                            ) : (
                                <Grid container spacing={2}>
                                    {sessions.slice(0, 10).map(session => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
                                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                    <TimerIcon sx={{ fontSize: 20, color: 'primary.main' }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {session.type === 'pomodoro' ? 'Pomodoro' : 'Focus'} Session
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="h6" color="primary.main">
                                                    {session.duration} minutes
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(session.startTime).toLocaleString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Settings Dialog */}
            <Dialog open={settingsOpen} onClose={() => setSettingsOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Pomodoro Settings</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Work Duration (minutes)"
                            type="number"
                            value={workDuration}
                            onChange={(e) => setWorkDuration(parseInt(e.target.value) || 25)}
                            fullWidth
                            inputProps={{ min: 1, max: 120 }}
                        />
                        <TextField
                            label="Short Break (minutes)"
                            type="number"
                            value={shortBreakDuration}
                            onChange={(e) => setShortBreakDuration(parseInt(e.target.value) || 5)}
                            fullWidth
                            inputProps={{ min: 1, max: 30 }}
                        />
                        <TextField
                            label="Long Break (minutes)"
                            type="number"
                            value={longBreakDuration}
                            onChange={(e) => setLongBreakDuration(parseInt(e.target.value) || 15)}
                            fullWidth
                            inputProps={{ min: 1, max: 60 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSettingsOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveSettings} variant="contained">
                        Save
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Note Dialog */}
            <Dialog open={noteDialogOpen} onClose={() => setNoteDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Add Quick Note</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Subject (optional)"
                            value={noteSubject}
                            onChange={(e) => setNoteSubject(e.target.value)}
                            fullWidth
                            placeholder="e.g., Math, Physics, etc."
                        />
                        <TextField
                            label="Note"
                            value={newNote}
                            onChange={(e) => setNewNote(e.target.value)}
                            fullWidth
                            multiline
                            rows={4}
                            placeholder="Capture your study insight..."
                            autoFocus
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setNoteDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddNote} variant="contained" disabled={!newNote.trim()}>
                        Add Note
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default StudyHacks;
