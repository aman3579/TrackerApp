import { useState, useEffect, useRef } from 'react';
import { useWellness } from '../context/WellnessContext';
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
    Paper,
    LinearProgress,
    Rating,
    Divider,
} from '@mui/material';
import {
    SelfImprovement as MeditationIcon,
    WaterDrop as WaterIcon,
    Bedtime as SleepIcon,
    Add as AddIcon,
    Remove as RemoveIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Stop as StopIcon,
    AccessTime as ClockIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const motivationalQuotes = [
    "Wellness is the complete integration of body, mind, and spirit.",
    "Take care of your body. It's the only place you have to live.",
    "Self-care is not selfish. You cannot serve from an empty vessel.",
    "Small daily improvements are the key to staggering long-term results.",
    "The greatest wealth is health.",
    "Nourishing yourself is not self-indulgence, it's self-respect.",
];

const Wellness = () => {
    const {
        meditationSessions,
        sleepLogs,
        dailyWaterGoal,
        addMeditationSession,
        addWaterGlass,
        removeWaterGlass,
        getTodayWater,
        addSleepLog,
        deleteSleepLog,
        getTotalMeditationTime,
        getAverageSleep,
    } = useWellness();

    // Meditation Timer
    const [meditating, setMeditating] = useState(false);
    const [meditationTime, setMeditationTime] = useState(10); // minutes
    const [meditationTimeLeft, setMeditationTimeLeft] = useState(10 * 60); // seconds
    const [isPaused, setIsPaused] = useState(false);
    const meditationTimerRef = useRef<number | null>(null);
    const meditationStartTime = useRef<Date | null>(null);

    // Sleep Log Dialog
    const [sleepDialogOpen, setSleepDialogOpen] = useState(false);
    const [sleepHours, setSleepHours] = useState('');
    const [sleepQuality, setSleepQuality] = useState<number>(3);
    const [sleepNotes, setSleepNotes] = useState('');

    const todayWater = getTodayWater();
    const totalMeditationMinutes = getTotalMeditationTime();
    const averageSleep = getAverageSleep();
    const todayDate = new Date().toISOString().split('T')[0];

    // Random quote
    const [quote, setQuote] = useState('');
    useEffect(() => {
        setQuote(motivationalQuotes[Math.floor(Math.random() * motivationalQuotes.length)]);
    }, []);

    // Meditation Timer Logic
    useEffect(() => {
        if (meditating && !isPaused) {
            meditationTimerRef.current = setInterval(() => {
                setMeditationTimeLeft(prev => {
                    if (prev <= 1) {
                        handleMeditationComplete();
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);
        } else {
            if (meditationTimerRef.current) {
                clearInterval(meditationTimerRef.current);
            }
        }

        return () => {
            if (meditationTimerRef.current) {
                clearInterval(meditationTimerRef.current);
            }
        };
    }, [meditating, isPaused]);

    const handleMeditationComplete = () => {
        if (meditationStartTime.current) {
            addMeditationSession({
                date: new Date(),
                duration: meditationTime,
                type: 'mindfulness',
            });
        }
        setMeditating(false);
        setIsPaused(false);
        setMeditationTimeLeft(meditationTime * 60);
        meditationStartTime.current = null;
    };

    const startMeditation = () => {
        setMeditating(true);
        setIsPaused(false);
        meditationStartTime.current = new Date();
    };

    const pauseMeditation = () => {
        setIsPaused(true);
    };

    const resumeMeditation = () => {
        setIsPaused(false);
    };

    const stopMeditation = () => {
        setMeditating(false);
        setIsPaused(false);
        setMeditationTimeLeft(meditationTime * 60);
        meditationStartTime.current = null;
    };

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleAddSleep = () => {
        if (sleepHours) {
            addSleepLog({
                date: todayDate,
                hours: parseFloat(sleepHours),
                quality: sleepQuality,
                notes: sleepNotes || undefined,
            });
            setSleepHours('');
            setSleepQuality(3);
            setSleepNotes('');
            setSleepDialogOpen(false);
        }
    };

    const wellnessScore = Math.round(
        ((todayWater / dailyWaterGoal) * 25) +
        (totalMeditationMinutes > 0 ? 25 : 0) +
        (averageSleep >= 7 ? 50 : (averageSleep / 7) * 50)
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Wellness Center
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Nurture your mind and body
                </Typography>
            </Box>

            {/* Daily Quote */}
            <Paper sx={{
                p: 3,
                mb: 4,
                background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(52, 211, 153, 0.05) 100%)',
                borderLeft: '4px solid #10b981'
            }}>
                <Typography variant="h6" sx={{ fontStyle: 'italic', fontWeight: 500 }}>
                    "{quote}"
                </Typography>
            </Paper>

            {/* Wellness Score */}
            <Card sx={{ mb: 4, background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                <CardContent>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Today's Wellness Score
                    </Typography>
                    <Stack direction="row" alignItems="center" spacing={2}>
                        <Typography variant="h2" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {wellnessScore}
                        </Typography>
                        <Box sx={{ flex: 1 }}>
                            <LinearProgress
                                variant="determinate"
                                value={wellnessScore}
                                sx={{ height: 12, borderRadius: 6 }}
                            />
                            <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                Based on water intake, meditation, and sleep quality
                            </Typography>
                        </Box>
                    </Stack>
                </CardContent>
            </Card>

            <Grid container spacing={3}>
                {/* Meditation Timer */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <MeditationIcon sx={{ fontSize: 32, color: '#8b5cf6' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Meditation Timer
                                </Typography>
                            </Stack>

                            <Box sx={{ textAlign: 'center', my: 3 }}>
                                <Box
                                    sx={{
                                        position: 'relative',
                                        display: 'inline-flex',
                                        mb: 2
                                    }}
                                >
                                    <Box
                                        sx={{
                                            width: 180,
                                            height: 180,
                                            borderRadius: '50%',
                                            background: `conic-gradient(#8b5cf6 ${((meditationTime * 60 - meditationTimeLeft) / (meditationTime * 60)) * 100}%, rgba(139, 92, 246, 0.1) 0%)`,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                        }}
                                    >
                                        <Box
                                            sx={{
                                                width: 160,
                                                height: 160,
                                                borderRadius: '50%',
                                                bgcolor: 'background.paper',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                            }}
                                        >
                                            <Typography variant="h3" sx={{ fontWeight: 700, fontFamily: 'monospace' }}>
                                                {formatTime(meditationTimeLeft)}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Box>

                                {!meditating && (
                                    <Stack direction="row" spacing={1} justifyContent="center" sx={{ mb: 2 }}>
                                        {[5, 10, 15, 20, 30].map(mins => (
                                            <Chip
                                                key={mins}
                                                label={`${mins}m`}
                                                onClick={() => {
                                                    setMeditationTime(mins);
                                                    setMeditationTimeLeft(mins * 60);
                                                }}
                                                color={meditationTime === mins ? 'primary' : 'default'}
                                            />
                                        ))}
                                    </Stack>
                                )}

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    {!meditating || isPaused ? (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PlayIcon />}
                                            onClick={isPaused ? resumeMeditation : startMeditation}
                                            sx={{ bgcolor: '#8b5cf6', '&:hover': { bgcolor: '#7c3aed' } }}
                                        >
                                            {isPaused ? 'Resume' : 'Start'}
                                        </Button>
                                    ) : (
                                        <Button
                                            variant="contained"
                                            size="large"
                                            startIcon={<PauseIcon />}
                                            onClick={pauseMeditation}
                                            sx={{ bgcolor: '#f59e0b', '&:hover': { bgcolor: '#d97706' } }}
                                        >
                                            Pause
                                        </Button>
                                    )}
                                    {(meditating || isPaused) && (
                                        <Button
                                            variant="outlined"
                                            size="large"
                                            startIcon={<StopIcon />}
                                            onClick={stopMeditation}
                                            color="error"
                                        >
                                            Stop
                                        </Button>
                                    )}
                                </Stack>

                                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                                    Total meditation: {totalMeditationMinutes} minutes
                                </Typography>
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Water Tracker */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card sx={{ height: '100%' }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 2 }}>
                                <WaterIcon sx={{ fontSize: 32, color: '#3b82f6' }} />
                                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                    Water Intake
                                </Typography>
                            </Stack>

                            <Box sx={{ textAlign: 'center', my: 3 }}>
                                <Typography variant="h1" sx={{ fontWeight: 700, color: '#3b82f6', mb: 1 }}>
                                    {todayWater} / {dailyWaterGoal}
                                </Typography>
                                <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                    Glasses today
                                </Typography>

                                <LinearProgress
                                    variant="determinate"
                                    value={(todayWater / dailyWaterGoal) * 100}
                                    sx={{
                                        height: 16,
                                        borderRadius: 8,
                                        mb: 3,
                                        bgcolor: 'rgba(59, 130, 246, 0.1)',
                                        '& .MuiLinearProgress-bar': {
                                            bgcolor: '#3b82f6'
                                        }
                                    }}
                                />

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <IconButton
                                        onClick={() => removeWaterGlass(todayDate)}
                                        disabled={todayWater === 0}
                                        sx={{
                                            bgcolor: 'background.default',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <RemoveIcon />
                                    </IconButton>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        onClick={() => addWaterGlass(todayDate)}
                                        sx={{ bgcolor: '#3b82f6', '&:hover': { bgcolor: '#2563eb' }, px: 4 }}
                                    >
                                        Add Glass 💧
                                    </Button>
                                    <IconButton
                                        onClick={() => addWaterGlass(todayDate)}
                                        sx={{
                                            bgcolor: 'background.default',
                                            '&:hover': { bgcolor: 'action.hover' }
                                        }}
                                    >
                                        <AddIcon />
                                    </IconButton>
                                </Stack>

                                {todayWater >= dailyWaterGoal && (
                                    <Chip
                                        label="Daily goal achieved! 🎉"
                                        color="success"
                                        sx={{ mt: 2 }}
                                    />
                                )}
                            </Box>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Sleep Tracker */}
                <Grid size={{ xs: 12 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <SleepIcon sx={{ fontSize: 32, color: '#6366f1' }} />
                                    <Box>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Sleep Tracker
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Average: {averageSleep.toFixed(1)} hours
                                        </Typography>
                                    </Box>
                                </Stack>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setSleepDialogOpen(true)}
                                >
                                    Log Sleep
                                </Button>
                            </Stack>

                            <Divider sx={{ my: 2 }} />

                            {sleepLogs.length === 0 ? (
                                <Paper sx={{ p: 3, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography color="text.secondary">
                                        No sleep logs yet. Track your sleep quality!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Grid container spacing={2}>
                                    {sleepLogs.slice(0, 7).map(log => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={log.id}>
                                            <Paper
                                                sx={{
                                                    p: 2,
                                                    borderLeft: '4px solid',
                                                    borderColor: log.quality >= 4 ? '#10b981' : log.quality >= 3 ? '#f59e0b' : '#ef4444'
                                                }}
                                            >
                                                <Stack direction="row" justifyContent="space-between">
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {log.hours}h
                                                        </Typography>
                                                        <Rating value={log.quality} readOnly size="small" />
                                                        <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
                                                            {new Date(log.date).toLocaleDateString()}
                                                        </Typography>
                                                        {log.notes && (
                                                            <Typography variant="body2" sx={{ mt: 1 }}>
                                                                {log.notes}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                    <IconButton
                                                        size="small"
                                                        onClick={() => deleteSleepLog(log.id)}
                                                        color="error"
                                                    >
                                                        <DeleteIcon fontSize="small" />
                                                    </IconButton>
                                                </Stack>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Recent Meditation Sessions */}
                {meditationSessions.length > 0 && (
                    <Grid size={{ xs: 12 }}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Recent Meditation Sessions
                                </Typography>
                                <Grid container spacing={2}>
                                    {meditationSessions.slice(0, 6).map(session => (
                                        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={session.id}>
                                            <Paper sx={{ p: 2, bgcolor: 'background.default' }}>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                    <ClockIcon sx={{ fontSize: 20, color: '#8b5cf6' }} />
                                                    <Typography variant="body2" fontWeight={600}>
                                                        {session.type}
                                                    </Typography>
                                                </Stack>
                                                <Typography variant="h6" sx={{ color: '#8b5cf6' }}>
                                                    {session.duration} minutes
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {new Date(session.date).toLocaleString()}
                                                </Typography>
                                            </Paper>
                                        </Grid>
                                    ))}
                                </Grid>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>

            {/* Sleep Log Dialog */}
            <Dialog open={sleepDialogOpen} onClose={() => setSleepDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Log Sleep</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        <TextField
                            label="Hours Slept"
                            type="number"
                            value={sleepHours}
                            onChange={(e) => setSleepHours(e.target.value)}
                            fullWidth
                            inputProps={{ min: 0, max: 24, step: 0.5 }}
                            autoFocus
                        />
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                Sleep Quality
                            </Typography>
                            <Rating
                                value={sleepQuality}
                                onChange={(_, newValue) => setSleepQuality(newValue || 3)}
                                size="large"
                            />
                        </Box>
                        <TextField
                            label="Notes (optional)"
                            value={sleepNotes}
                            onChange={(e) => setSleepNotes(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="How was your sleep?"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setSleepDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddSleep} variant="contained" disabled={!sleepHours}>
                        Log Sleep
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Wellness;
