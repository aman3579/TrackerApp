import { useState } from 'react';
import { useHabits } from '../context/HabitContext';
import { format, startOfWeek, addDays, isSameDay, subDays } from 'date-fns';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Stack,
    Paper,
    ToggleButton,
    ToggleButtonGroup,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    Delete as DeleteIcon,
    LocalFireDepartment as FireIcon,
} from '@mui/icons-material';

const HabitTracker = () => {
    const { habits, toggleHabitCompletion, deleteHabit } = useHabits();
    const [selectedDate, setSelectedDate] = useState(new Date());

    const weekStart = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const weekDays = Array.from({ length: 7 }).map((_, i) => addDays(weekStart, i));

    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Stack direction="row" alignItems="center" spacing={2}>
                    <Box sx={{ flex: 1 }}>
                        <Typography variant="h3" sx={{
                            fontWeight: 700,
                            background: 'linear-gradient(135deg, #ec4899 0%, #f59e0b 100%)',
                            WebkitBackgroundClip: 'text',
                            WebkitTextFillColor: 'transparent',
                            mb: 1
                        }}>
                            Habits
                        </Typography>
                        <Typography variant="body1" color="text.secondary">
                            Build consistency, one day at a time
                        </Typography>
                    </Box>
                    <Paper sx={{ p: 2, textAlign: 'center', minWidth: 120 }}>
                        <Stack direction="row" alignItems="center" justifyContent="center" spacing={1}>
                            <FireIcon sx={{ color: '#f59e0b', fontSize: 32 }} />
                            <Typography variant="h4" sx={{ fontWeight: 700, color: '#f59e0b' }}>
                                {totalStreak}
                            </Typography>
                        </Stack>
                        <Typography variant="caption" color="text.secondary">
                            Total Streak Days
                        </Typography>
                    </Paper>
                </Stack>
            </Box>

            {/* Weekly Calendar Strip */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <ToggleButtonGroup
                    value={selectedDate.toDateString()}
                    exclusive
                    onChange={(_, newDate) => newDate && setSelectedDate(new Date(newDate))}
                    fullWidth
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: 1,
                        '& .MuiToggleButton-root': {
                            border: 'none',
                            borderRadius: 2,
                        }
                    }}
                >
                    {weekDays.map(day => {
                        const isToday = isSameDay(day, new Date());
                        const isSelected = isSameDay(day, selectedDate);

                        return (
                            <ToggleButton
                                key={day.toString()}
                                value={day.toDateString()}
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    py: 2,
                                    border: '1px solid rgba(255,255,255,0.1) !important',
                                    bgcolor: isSelected ? 'secondary.main' : 'transparent',
                                    color: isSelected ? 'white' : isToday ? 'secondary.main' : 'text.primary',
                                    '&:hover': {
                                        bgcolor: isSelected ? 'secondary.dark' : 'action.hover',
                                    },
                                }}
                            >
                                <Typography variant="caption" sx={{ fontWeight: 600 }}>
                                    {format(day, 'EEE')}
                                </Typography>
                                <Typography variant="h6" sx={{ fontWeight: 700 }}>
                                    {format(day, 'd')}
                                </Typography>
                                {isToday && !isSelected && (
                                    <Box sx={{ width: 4, height: 4, borderRadius: '50%', bgcolor: 'secondary.main', mt: 0.5 }} />
                                )}
                            </ToggleButton>
                        );
                    })}
                </ToggleButtonGroup>
            </Paper>

            {/* Habits List */}
            {habits.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        No habits yet. Start by adding one!
                    </Typography>
                </Paper>
            ) : (
                <Grid container spacing={2}>
                    {habits.map((habit, index) => {
                        const isCompleted = habit.completedDates.includes(format(selectedDate, 'yyyy-MM-dd'));

                        return (
                            <Grid size={12} key={habit.id}>
                                <Fade in timeout={300 + index * 50}>
                                    <Card sx={{
                                        transition: 'all 0.3s',
                                        border: isCompleted ? '2px solid' : '1px solid',
                                        borderColor: isCompleted ? 'secondary.main' : 'divider',
                                        '&:hover': {
                                            transform: 'translateY(-4px)',
                                            boxShadow: '0 8px 24px rgba(236, 72, 153, 0.2)',
                                        },
                                    }}>
                                        <CardContent>
                                            <Stack direction="row" alignItems="flex-start" spacing={2}>
                                                {/* Completion Checkbox */}
                                                <IconButton
                                                    onClick={() => toggleHabitCompletion(habit.id, selectedDate)}
                                                    sx={{
                                                        bgcolor: isCompleted ? 'secondary.main' : 'action.hover',
                                                        color: isCompleted ? 'white' : 'text.secondary',
                                                        '&:hover': {
                                                            bgcolor: isCompleted ? 'secondary.dark' : 'action.selected',
                                                        },
                                                    }}
                                                >
                                                    <CheckIcon />
                                                </IconButton>

                                                {/* Habit Info */}
                                                <Box sx={{ flex: 1 }}>
                                                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                                                        {habit.title}
                                                    </Typography>

                                                    <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                                        {/* Streak Chip */}
                                                        <Chip
                                                            icon={<FireIcon />}
                                                            label={`${habit.streak} day streak`}
                                                            sx={{
                                                                bgcolor: 'rgba(245, 158, 11, 0.15)',
                                                                color: '#f59e0b',
                                                                fontWeight: 600,
                                                            }}
                                                            size="small"
                                                        />

                                                        {/* Frequency Chips */}
                                                        {habit.frequency.slice(0, 3).map((day, idx) => (
                                                            <Chip
                                                                key={idx}
                                                                label={day}
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        ))}
                                                        {habit.frequency.length > 3 && (
                                                            <Chip
                                                                label={`+${habit.frequency.length - 3}`}
                                                                variant="outlined"
                                                                size="small"
                                                            />
                                                        )}
                                                    </Stack>

                                                    {/* Mini Heatmap */}
                                                    <Stack direction="row" spacing={0.5} sx={{ mt: 2 }}>
                                                        {[6, 5, 4, 3, 2, 1, 0].map(daysAgo => {
                                                            const date = subDays(new Date(), daysAgo);
                                                            const dateStr = format(date, 'yyyy-MM-dd');
                                                            const done = habit.completedDates.includes(dateStr);

                                                            return (
                                                                <Tooltip key={daysAgo} title={format(date, 'MMM d')} arrow>
                                                                    <Box
                                                                        sx={{
                                                                            width: 24,
                                                                            height: 32,
                                                                            borderRadius: 1,
                                                                            bgcolor: done ? 'secondary.main' : 'action.hover',
                                                                            transition: 'all 0.3s',
                                                                            '&:hover': {
                                                                                transform: 'scale(1.1)',
                                                                            },
                                                                        }}
                                                                    />
                                                                </Tooltip>
                                                            );
                                                        })}
                                                    </Stack>
                                                </Box>

                                                {/* Delete Button */}
                                                <Tooltip title="Delete habit">
                                                    <IconButton
                                                        onClick={() => deleteHabit(habit.id)}
                                                        color="error"
                                                        size="small"
                                                    >
                                                        <DeleteIcon />
                                                    </IconButton>
                                                </Tooltip>
                                            </Stack>
                                        </CardContent>
                                    </Card>
                                </Fade>
                            </Grid>
                        );
                    })}
                </Grid>
            )}
        </Box>
    );
};

export default HabitTracker;
