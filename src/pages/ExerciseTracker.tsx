import { useState } from 'react';
import { useExercise } from '../context/ExerciseContext';
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
    Divider,
    IconButton,
    MenuItem,
    Tabs,
    Tab,
    Badge,
} from '@mui/material';
import {
    FitnessCenter as FitnessIcon,
    Add as AddIcon,
    DirectionsRun as RunIcon,
    SelfImprovement as YogaIcon,
    Sports as SportsIcon,
    Delete as DeleteIcon,
    TrendingUp as TrendingUpIcon,
} from '@mui/icons-material';

const ExerciseTracker = () => {
    const {
        exercises,
        workoutLogs,
        addWorkoutLog,
        deleteWorkoutLog,
        getTodayWorkouts,
        getWeeklyWorkouts,
        getTotalWorkouts,
    } = useExercise();

    const [tabValue, setTabValue] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedExercise, setSelectedExercise] = useState('');
    const [sets, setSets] = useState('');
    const [reps, setReps] = useState('');
    const [weight, setWeight] = useState('');
    const [duration, setDuration] = useState('');
    const [notes, setNotes] = useState('');
    const [categoryFilter, setCategoryFilter] = useState<string>('all');

    const todayWorkouts = getTodayWorkouts();
    const weeklyWorkouts = getWeeklyWorkouts();
    const totalWorkouts = getTotalWorkouts();

    const handleAddWorkout = () => {
        if (!selectedExercise) return;

        const exercise = exercises.find(e => e.id === selectedExercise);
        if (!exercise) return;

        addWorkoutLog({
            date: new Date(),
            exerciseId: exercise.id,
            exerciseName: exercise.name,
            sets: sets ? parseInt(sets) : undefined,
            reps: reps ? parseInt(reps) : undefined,
            weight: weight ? parseFloat(weight) : undefined,
            duration: duration ? parseInt(duration) : undefined,
            notes: notes || undefined,
        });

        // Reset form
        setSelectedExercise('');
        setSets('');
        setReps('');
        setWeight('');
        setDuration('');
        setNotes('');
        setDialogOpen(false);
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'cardio': return <RunIcon />;
            case 'strength': return <FitnessIcon />;
            case 'flexibility': return <YogaIcon />;
            case 'sports': return <SportsIcon />;
            default: return <FitnessIcon />;
        }
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'cardio': return '#ef4444';
            case 'strength': return '#6366f1';
            case 'flexibility': return '#10b981';
            case 'sports': return '#f59e0b';
            default: return '#6366f1';
        }
    };

    const getDifficultyColor = (difficulty: string) => {
        switch (difficulty) {
            case 'beginner': return 'success';
            case 'intermediate': return 'warning';
            case 'advanced': return 'error';
            default: return 'default';
        }
    };

    const filteredExercises = categoryFilter === 'all'
        ? exercises
        : exercises.filter(e => e.category === categoryFilter);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Exercise Tracker
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your workouts and build healthy habits
                </Typography>
            </Box>

            {/* Stats Row */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <FitnessIcon sx={{ fontSize: 40, color: '#6366f1' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {todayWorkouts.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Today's Workouts
                                    </Typography>
                                </Box>
                            </Stack>
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
                                        {weeklyWorkouts.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        This Week
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
                                <RunIcon sx={{ fontSize: 40, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {totalWorkouts}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Total Workouts
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content Tabs */}
            <Card sx={{ mb: 3 }}>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label="Exercise Library" />
                    <Tab
                        label={
                            <Badge badgeContent={workoutLogs.length} color="primary">
                                <span style={{ marginRight: 16 }}>Workout History</span>
                            </Badge>
                        }
                    />
                </Tabs>

                {/* Exercise Library Tab */}
                {tabValue === 0 && (
                    <Box sx={{ p: 3 }}>
                        <Stack direction="row" spacing={2} sx={{ mb: 3 }}>
                            <Button
                                variant={categoryFilter === 'all' ? 'contained' : 'outlined'}
                                onClick={() => setCategoryFilter('all')}
                                size="small"
                            >
                                All
                            </Button>
                            <Button
                                variant={categoryFilter === 'cardio' ? 'contained' : 'outlined'}
                                onClick={() => setCategoryFilter('cardio')}
                                size="small"
                                sx={{ bgcolor: categoryFilter === 'cardio' ? '#ef4444' : undefined }}
                            >
                                Cardio
                            </Button>
                            <Button
                                variant={categoryFilter === 'strength' ? 'contained' : 'outlined'}
                                onClick={() => setCategoryFilter('strength')}
                                size="small"
                                sx={{ bgcolor: categoryFilter === 'strength' ? '#6366f1' : undefined }}
                            >
                                Strength
                            </Button>
                            <Button
                                variant={categoryFilter === 'flexibility' ? 'contained' : 'outlined'}
                                onClick={() => setCategoryFilter('flexibility')}
                                size="small"
                                sx={{ bgcolor: categoryFilter === 'flexibility' ? '#10b981' : undefined }}
                            >
                                Flexibility
                            </Button>
                            <Button
                                variant={categoryFilter === 'sports' ? 'contained' : 'outlined'}
                                onClick={() => setCategoryFilter('sports')}
                                size="small"
                                sx={{ bgcolor: categoryFilter === 'sports' ? '#f59e0b' : undefined }}
                            >
                                Sports
                            </Button>
                        </Stack>

                        <Grid container spacing={2}>
                            {filteredExercises.map(exercise => (
                                <Grid size={{ xs: 12, sm: 6, md: 4 }} key={exercise.id}>
                                    <Paper
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderColor: getCategoryColor(exercise.category),
                                            cursor: 'pointer',
                                            transition: 'all 0.3s',
                                            '&:hover': {
                                                transform: 'translateY(-4px)',
                                                boxShadow: 4,
                                            }
                                        }}
                                        onClick={() => {
                                            setSelectedExercise(exercise.id);
                                            setDialogOpen(true);
                                        }}
                                    >
                                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                                            {getCategoryIcon(exercise.category)}
                                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                {exercise.name}
                                            </Typography>
                                        </Stack>
                                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                                            {exercise.description}
                                        </Typography>
                                        <Stack direction="row" spacing={1}>
                                            <Chip
                                                label={exercise.category}
                                                size="small"
                                                sx={{ bgcolor: getCategoryColor(exercise.category), color: 'white' }}
                                            />
                                            <Chip
                                                label={exercise.difficulty}
                                                size="small"
                                                color={getDifficultyColor(exercise.difficulty) as any}
                                            />
                                        </Stack>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            {exercise.muscleGroups.join(', ')}
                                        </Typography>
                                    </Paper>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                )}

                {/* Workout History Tab */}
                {tabValue === 1 && (
                    <Box sx={{ p: 3 }}>
                        {workoutLogs.length === 0 ? (
                            <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                <Typography color="text.secondary">
                                    No workouts logged yet. Start your fitness journey!
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={() => setDialogOpen(true)}
                                    sx={{ mt: 2 }}
                                >
                                    Log Workout
                                </Button>
                            </Paper>
                        ) : (
                            <Stack spacing={2}>
                                {workoutLogs.map(log => (
                                    <Paper
                                        key={log.id}
                                        sx={{
                                            p: 2,
                                            borderLeft: '4px solid',
                                            borderColor: 'primary.main',
                                        }}
                                    >
                                        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                                                    {log.exerciseName}
                                                </Typography>
                                                <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
                                                    {log.sets && <Chip label={`${log.sets} sets`} size="small" />}
                                                    {log.reps && <Chip label={`${log.reps} reps`} size="small" />}
                                                    {log.weight && <Chip label={`${log.weight} kg`} size="small" />}
                                                    {log.duration && <Chip label={`${log.duration} min`} size="small" />}
                                                </Stack>
                                                {log.notes && (
                                                    <Typography variant="body2" color="text.secondary">
                                                        {log.notes}
                                                    </Typography>
                                                )}
                                                <Typography variant="caption" color="text.secondary" sx={{ mt: 0.5, display: 'block' }}>
                                                    {new Date(log.date).toLocaleString()}
                                                </Typography>
                                            </Box>
                                            <IconButton
                                                onClick={() => deleteWorkoutLog(log.id)}
                                                color="error"
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Stack>
                                    </Paper>
                                ))}
                            </Stack>
                        )}
                    </Box>
                )}
            </Card>

            {/* Log Workout Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Log Workout</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            select
                            label="Exercise"
                            value={selectedExercise}
                            onChange={(e) => setSelectedExercise(e.target.value)}
                            fullWidth
                        >
                            {exercises.map(exercise => (
                                <MenuItem key={exercise.id} value={exercise.id}>
                                    {exercise.name} ({exercise.category})
                                </MenuItem>
                            ))}
                        </TextField>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <TextField
                                    label="Sets"
                                    type="number"
                                    value={sets}
                                    onChange={(e) => setSets(e.target.value)}
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Reps"
                                    type="number"
                                    value={reps}
                                    onChange={(e) => setReps(e.target.value)}
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                        </Grid>
                        <Grid container spacing={2}>
                            <Grid size={6}>
                                <TextField
                                    label="Weight (kg)"
                                    type="number"
                                    value={weight}
                                    onChange={(e) => setWeight(e.target.value)}
                                    fullWidth
                                    inputProps={{ min: 0, step: 0.5 }}
                                />
                            </Grid>
                            <Grid size={6}>
                                <TextField
                                    label="Duration (min)"
                                    type="number"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    fullWidth
                                    inputProps={{ min: 1 }}
                                />
                            </Grid>
                        </Grid>
                        <TextField
                            label="Notes (optional)"
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                            fullWidth
                            multiline
                            rows={2}
                            placeholder="How did it feel? Any observations?"
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddWorkout} variant="contained" disabled={!selectedExercise}>
                        Log Workout
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
                    bgcolor: 'primary.main',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(99, 102, 241, 0.4)',
                    '&:hover': {
                        bgcolor: 'primary.dark',
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 30px rgba(99, 102, 241, 0.6)'
                    },
                    transition: 'all 0.3s'
                }}
            >
                <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
        </Box>
    );
};

export default ExerciseTracker;
