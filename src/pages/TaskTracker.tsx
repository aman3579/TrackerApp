import { useState } from 'react';
import { useTasks } from '../context/TaskContext';
import type { Task } from '../context/TaskContext';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    TextField,
    InputAdornment,
    IconButton,
    Chip,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Checkbox,
    Paper,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    Search as SearchIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    CalendarMonth as CalendarIcon,
    FlagOutlined as FlagIcon,
} from '@mui/icons-material';

const TaskTracker = () => {
    const { tasks, toggleTask, deleteTask } = useTasks();
    const [filter, setFilter] = useState<'all' | 'pending' | 'completed'>('all');
    const [search, setSearch] = useState('');

    const filteredTasks = tasks
        .filter(task => {
            if (filter === 'pending') return !task.completed;
            if (filter === 'completed') return task.completed;
            return true;
        })
        .filter(task => task.title.toLowerCase().includes(search.toLowerCase()))
        .sort((a, b) => b.createdAt - a.createdAt);

    const getPriorityColor = (priority: Task['priority']) => {
        switch (priority) {
            case 'high': return 'error';
            case 'medium': return 'warning';
            case 'low': return 'success';
            default: return 'default';
        }
    };

    const stats = {
        total: tasks.length,
        pending: tasks.filter(t => !t.completed).length,
        completed: tasks.filter(t => t.completed).length,
    };

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
                    Tasks
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your to-dos and projects
                </Typography>
            </Box>

            {/* Stats */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'primary.main' }}>
                            {stats.total}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Total Tasks
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'warning.main' }}>
                            {stats.pending}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Pending
                        </Typography>
                    </Paper>
                </Grid>
                <Grid size={{ xs: 12, sm: 4 }}>
                    <Paper sx={{ p: 2, textAlign: 'center' }}>
                        <Typography variant="h4" sx={{ fontWeight: 700, color: 'success.main' }}>
                            {stats.completed}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Completed
                        </Typography>
                    </Paper>
                </Grid>
            </Grid>

            {/* Filters and Search */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} alignItems="center">
                    <TextField
                        fullWidth
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <SearchIcon />
                                </InputAdornment>
                            ),
                        }}
                        sx={{ maxWidth: { sm: 400 } }}
                    />

                    <ToggleButtonGroup
                        value={filter}
                        exclusive
                        onChange={(_, newFilter) => newFilter && setFilter(newFilter)}
                        size="small"
                    >
                        <ToggleButton value="all">All</ToggleButton>
                        <ToggleButton value="pending">Pending</ToggleButton>
                        <ToggleButton value="completed">Done</ToggleButton>
                    </ToggleButtonGroup>
                </Stack>
            </Paper>

            {/* Tasks List */}
            {filteredTasks.length === 0 ? (
                <Paper sx={{ p: 6, textAlign: 'center' }}>
                    <Typography variant="h6" color="text.secondary">
                        {search ? 'No tasks found matching your search' : 'No tasks yet. Start by adding one!'}
                    </Typography>
                </Paper>
            ) : (
                <Stack spacing={2}>
                    {filteredTasks.map((task, index) => (
                        <Fade in timeout={300 + index * 50} key={task.id}>
                            <Card
                                sx={{
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                                    },
                                }}
                            >
                                <CardContent>
                                    <Stack direction="row" alignItems="flex-start" spacing={2}>
                                        {/* Checkbox */}
                                        <Checkbox
                                            checked={task.completed}
                                            onChange={() => toggleTask(task.id)}
                                            icon={<RadioButtonUncheckedIcon />}
                                            checkedIcon={<CheckCircleIcon />}
                                            sx={{ p: 0 }}
                                        />

                                        {/* Task Content */}
                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    textDecoration: task.completed ? 'line-through' : 'none',
                                                    color: task.completed ? 'text.secondary' : 'text.primary',
                                                    wordBreak: 'break-word',
                                                }}
                                            >
                                                {task.title}
                                            </Typography>

                                            <Stack direction="row" spacing={1} sx={{ mt: 1 }} flexWrap="wrap" useFlexGap>
                                                {/* Priority Chip */}
                                                <Chip
                                                    icon={<FlagIcon />}
                                                    label={task.priority.toUpperCase()}
                                                    color={getPriorityColor(task.priority)}
                                                    size="small"
                                                />

                                                {/* Due Date Chip */}
                                                {task.dueDate && (
                                                    <Chip
                                                        icon={<CalendarIcon />}
                                                        label={new Date(task.dueDate).toLocaleDateString()}
                                                        variant="outlined"
                                                        size="small"
                                                    />
                                                )}
                                            </Stack>
                                        </Box>

                                        {/* Delete Button */}
                                        <Tooltip title="Delete task">
                                            <IconButton
                                                onClick={() => deleteTask(task.id)}
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
                    ))}
                </Stack>
            )}
        </Box>
    );
};

export default TaskTracker;
