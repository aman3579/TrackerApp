import { useState } from 'react';
import { useMood } from '../context/MoodContext';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Button,
    Stack,
    TextField,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Chip,
    Paper,
    IconButton,
    Divider,
} from '@mui/material';
import {
    Add as AddIcon,
    TrendingUp as TrendingUpIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const emotionOptions = [
    'happy', 'sad', 'anxious', 'calm', 'energetic', 'tired',
    'stressed', 'peaceful', 'excited', 'angry', 'grateful', 'motivated'
];

const MoodJournal = () => {
    const {
        moodEntries,
        addMoodEntry,
        deleteMoodEntry,
        getTodayMood,
        getAverageMood,
    } = useMood();

    const [dialogOpen, setDialogOpen] = useState(false);
    const [moodRating, setMoodRating] = useState(5);
    const [selectedEmotions, setSelectedEmotions] = useState<string[]>([]);
    const [moodNotes, setMoodNotes] = useState('');
    const [gratitude, setGratitude] = useState('');

    const todayMood = getTodayMood();
    const weekAverage = getAverageMood(7);
    const monthAverage = getAverageMood(30);

    const handleSaveMood = () => {
        const today = new Date().toISOString().split('T')[0];
        addMoodEntry({
            date: today,
            rating: moodRating,
            emotions: selectedEmotions,
            notes: moodNotes || undefined,
            gratitude: gratitude || undefined,
        });
        setMoodRating(5);
        setSelectedEmotions([]);
        setMoodNotes('');
        setGratitude('');
        setDialogOpen(false);
    };

    const handleEmotionToggle = (emotion: string) => {
        setSelectedEmotions(prev =>
            prev.includes(emotion)
                ? prev.filter(e => e !== emotion)
                : [...prev, emotion]
        );
    };

    const getMoodEmoji = (rating: number) => {
        if (rating >= 8) return '😊';
        if (rating >= 6) return '🙂';
        if (rating >= 4) return '😐';
        if (rating >= 2) return '😟';
        return '😢';
    };

    const getMoodColor = (rating: number) => {
        if (rating >= 8) return '#10b981';
        if (rating >= 6) return '#6366f1';
        if (rating >= 4) return '#f59e0b';
        if (rating >= 2) return '#ef4444';
        return '#991b1b';
    };

    const getRatingLabel = (rating: number) => {
        if (rating >= 9) return 'Amazing';
        if (rating >= 7) return 'Great';
        if (rating >= 5) return 'Good';
        if (rating >= 3) return 'Okay';
        return 'Not Great';
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #ec4899 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Mood Journal
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your emotional well-being and find patterns
                </Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: todayMood
                            ? `linear-gradient(135deg, ${getMoodColor(todayMood.rating)}22 0%, ${getMoodColor(todayMood.rating)}11 100%)`
                            : 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: `1px solid ${todayMood ? getMoodColor(todayMood.rating) + '44' : 'rgba(99, 102, 241, 0.2)'}`,
                    }}>
                        <CardContent>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                Today's Mood
                            </Typography>
                            {todayMood ? (
                                <>
                                    <Typography variant="h2" sx={{ mb: 0.5 }}>
                                        {getMoodEmoji(todayMood.rating)}
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 600, color: getMoodColor(todayMood.rating) }}>
                                        {todayMood.rating}/10 - {getRatingLabel(todayMood.rating)}
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    <Typography variant="h6" color="text.secondary">
                                        Not logged yet
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        size="small"
                                        onClick={() => setDialogOpen(true)}
                                        sx={{ mt: 1 }}
                                    >
                                        Log Mood
                                    </Button>
                                </>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                        border: '1px solid rgba(236, 72, 153, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: '#ec4899' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {weekAverage.toFixed(1)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Week Average
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)',
                        border: '1px solid rgba(139, 92, 246, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <TrendingUpIcon sx={{ fontSize: 40, color: '#8b5cf6' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {monthAverage.toFixed(1)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Month Average
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Today's Entry (if exists) */}
            {todayMood && (
                <Card sx={{ mb: 3, borderLeft: '4px solid', borderColor: getMoodColor(todayMood.rating) }}>
                    <CardContent>
                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                            <Box>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                    Today's Entry
                                </Typography>
                                <Stack direction="row" spacing={1} sx={{ mb: 2 }}>
                                    {todayMood.emotions.map(emotion => (
                                        <Chip key={emotion} label={emotion} size="small" />
                                    ))}
                                </Stack>
                                {todayMood.notes && (
                                    <Paper sx={{ p: 2, bgcolor: 'background.default', mb: 1 }}>
                                        <Typography variant="body2">
                                            {todayMood.notes}
                                        </Typography>
                                    </Paper>
                                )}
                                {todayMood.gratitude && (
                                    <Paper sx={{ p: 2, bgcolor: 'rgba(16, 185, 129, 0.1)', borderLeft: '4px solid #10b981' }}>
                                        <Typography variant="body2" fontWeight={600} sx={{ mb: 0.5 }}>
                                            Gratitude
                                        </Typography>
                                        <Typography variant="body2">
                                            {todayMood.gratitude}
                                        </Typography>
                                    </Paper>
                                )}
                            </Box>
                            <IconButton onClick={() => setDialogOpen(true)} color="primary">
                                <EditIcon />
                            </IconButton>
                        </Stack>
                    </CardContent>
                </Card>
            )}

            {/* Mood History */}
            <Card>
                <CardContent>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                            Mood History
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setDialogOpen(true)}
                        >
                            {todayMood ? 'Update Today' : 'Log Mood'}
                        </Button>
                    </Stack>

                    <Divider sx={{ mb: 2 }} />

                    {moodEntries.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                            <Typography color="text.secondary" sx={{ mb: 2 }}>
                                Start tracking your mood to see patterns and insights
                            </Typography>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={() => setDialogOpen(true)}
                            >
                                Log First Entry
                            </Button>
                        </Paper>
                    ) : (
                        <Grid container spacing={2}>
                            {moodEntries.map(entry => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={entry.id}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderColor: getMoodColor(entry.rating),
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-2px)',
                                                boxShadow: 2
                                            }
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Box sx={{ flex: 1 }}>
                                                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                                    <Typography variant="h4">
                                                        {getMoodEmoji(entry.rating)}
                                                    </Typography>
                                                    <Box>
                                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                            {entry.rating}/10
                                                        </Typography>
                                                        <Typography variant="caption" color="text.secondary">
                                                            {new Date(entry.date).toLocaleDateString()}
                                                        </Typography>
                                                    </Box>
                                                </Stack>

                                                {entry.emotions.length > 0 && (
                                                    <Stack direction="row" spacing={0.5} flexWrap="wrap" sx={{ mb: 1 }}>
                                                        {entry.emotions.map(emotion => (
                                                            <Chip
                                                                key={emotion}
                                                                label={emotion}
                                                                size="small"
                                                                sx={{ mb: 0.5 }}
                                                            />
                                                        ))}
                                                    </Stack>
                                                )}

                                                {entry.notes && (
                                                    <Typography
                                                        variant="body2"
                                                        color="text.secondary"
                                                        sx={{
                                                            overflow: 'hidden',
                                                            textOverflow: 'ellipsis',
                                                            display: '-webkit-box',
                                                            WebkitLineClamp: 2,
                                                            WebkitBoxOrient: 'vertical',
                                                        }}
                                                    >
                                                        {entry.notes}
                                                    </Typography>
                                                )}
                                            </Box>
                                            {entry.id !== todayMood?.id && (
                                                <IconButton
                                                    size="small"
                                                    onClick={() => deleteMoodEntry(entry.id)}
                                                    color="error"
                                                >
                                                    <DeleteIcon fontSize="small" />
                                                </IconButton>
                                            )}
                                        </Stack>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </CardContent>
            </Card>

            {/* Log Mood Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Log Your Mood</DialogTitle>
                <DialogContent>
                    <Stack spacing={3} sx={{ mt: 1 }}>
                        {/* Mood Rating */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                How are you feeling? (1-10)
                            </Typography>
                            <Box sx={{ textAlign: 'center', mb: 1 }}>
                                <Typography variant="h1" sx={{ mb: 1 }}>
                                    {getMoodEmoji(moodRating)}
                                </Typography>
                                <Typography variant="h4" sx={{ fontWeight: 700, color: getMoodColor(moodRating) }}>
                                    {moodRating}/10
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {getRatingLabel(moodRating)}
                                </Typography>
                            </Box>
                            <Box sx={{ px: 2 }}>
                                <input
                                    type="range"
                                    min="1"
                                    max="10"
                                    value={moodRating}
                                    onChange={(e) => setMoodRating(parseInt(e.target.value))}
                                    style={{
                                        width: '100%',
                                        height: '8px',
                                        borderRadius: '5px',
                                        background: `linear-gradient(90deg, #ef4444, #f59e0b, #10b981)`,
                                        outline: 'none',
                                        cursor: 'pointer',
                                    }}
                                />
                            </Box>
                        </Box>

                        {/* Emotions */}
                        <Box>
                            <Typography variant="body2" sx={{ mb: 1 }}>
                                What emotions are you experiencing?
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap">
                                {emotionOptions.map(emotion => (
                                    <Chip
                                        key={emotion}
                                        label={emotion}
                                        onClick={() => handleEmotionToggle(emotion)}
                                        color={selectedEmotions.includes(emotion) ? 'primary' : 'default'}
                                        sx={{ mb: 1 }}
                                    />
                                ))}
                            </Stack>
                        </Box>

                        {/* Notes */}
                        <TextField
                            label="How's your day going?"
                            value={moodNotes}
                            onChange={(e) => setMoodNotes(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Share your thoughts, wins, or challenges..."
                        />

                        {/* Gratitude */}
                        <TextField
                            label="What are you grateful for today?"
                            value={gratitude}
                            onChange={(e) => setGratitude(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="Practice gratitude..."
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSaveMood} variant="contained">
                        Save Entry
                    </Button>
                </DialogActions>
            </Dialog>

            {/* FAB */}
            <IconButton
                onClick={() => setDialogOpen(true)}
                sx={{
                    position: 'fixed',
                    bottom: { xs: 80, md: 32 },
                    right: 32,
                    width: 64,
                    height: 64,
                    bgcolor: '#ec4899',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(236, 72, 153, 0.4)',
                    '&:hover': {
                        bgcolor: '#db2777',
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 30px rgba(236, 72, 153, 0.6)'
                    },
                    transition: 'all 0.3s'
                }}
            >
                <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
        </Box>
    );
};

export default MoodJournal;
