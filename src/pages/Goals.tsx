import { useState } from 'react';
import { useGoal, type Goal as GoalType } from '../context/GoalContext';
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
    MenuItem,
    LinearProgress,
    Divider,
    Checkbox,
    FormControlLabel,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Add as AddIcon,
    EmojiEvents as TrophyIcon,
    Delete as DeleteIcon,
    CheckCircle as CheckIcon,
    Flag as FlagIcon,
} from '@mui/icons-material';

const Goals = () => {
    const {
        goals,
        addGoal,
        updateGoal,
        deleteGoal,
        addMilestone,
        toggleMilestone,
        getActiveGoals,
    } = useGoal();

    const [tabValue, setTabValue] = useState(0);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
    const [selectedGoalId, setSelectedGoalId] = useState('');

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [category, setCategory] = useState<GoalType['category']>('personal');
    const [deadline, setDeadline] = useState('');

    const [milestoneTitle, setMilestoneTitle] = useState('');

    const activeGoals = getActiveGoals();
    const completedGoals = goals.filter(g => g.status === 'completed');

    const handleAddGoal = () => {
        if (!title) return;

        addGoal({
            title,
            description,
            category,
            deadline: deadline || undefined,
            milestones: [],
            progress: 0,
            status: 'active',
        });

        setTitle('');
        setDescription('');
        setCategory('personal');
        setDeadline('');
        setDialogOpen(false);
    };

    const handleAddMilestone = () => {
        if (!milestoneTitle || !selectedGoalId) return;

        addMilestone(selectedGoalId, { title: milestoneTitle });
        setMilestoneTitle('');
        setMilestoneDialogOpen(false);
    };

    const handleCompleteGoal = (goalId: string) => {
        updateGoal(goalId, { status: 'completed', progress: 100 });
    };

    const getCategoryColor = (category: string) => {
        switch (category) {
            case 'career': return '#6366f1';
            case 'health': return '#10b981';
            case 'learning': return '#8b5cf6';
            case 'financial': return '#f59e0b';
            case 'personal': return '#ec4899';
            default: return '#6366f1';
        }
    };

    const getCategoryIcon = (category: string) => {
        switch (category) {
            case 'career': return '💼';
            case 'health': return '💪';
            case 'learning': return '📚';
            case 'financial': return '💰';
            case 'personal': return '🎯';
            default: return '🎯';
        }
    };

    const renderGoalCard = (goal: GoalType) => (
        <Paper
            key={goal.id}
            sx={{
                p: 3,
                borderLeft: '6px solid',
                borderColor: getCategoryColor(goal.category),
                transition: 'all 0.3s',
                '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: 4
                }
            }}
        >
            <Stack spacing={2}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Box sx={{ flex: 1 }}>
                        <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 1 }}>
                            <Typography variant="h4">{getCategoryIcon(goal.category)}</Typography>
                            <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                {goal.title}
                            </Typography>
                        </Stack>
                        <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                            {goal.description}
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <Chip
                                label={goal.category}
                                size="small"
                                sx={{ bgcolor: getCategoryColor(goal.category), color: 'white' }}
                            />
                            {goal.deadline && (
                                <Chip
                                    icon={<FlagIcon />}
                                    label={new Date(goal.deadline).toLocaleDateString()}
                                    size="small"
                                    variant="outlined"
                                />
                            )}
                        </Stack>
                    </Box>
                    <Stack direction="row" spacing={1}>
                        {goal.status === 'active' && (
                            <IconButton
                                size="small"
                                onClick={() => handleCompleteGoal(goal.id)}
                                color="success"
                                title="Mark as completed"
                            >
                                <CheckIcon />
                            </IconButton>
                        )}
                        <IconButton
                            size="small"
                            onClick={() => deleteGoal(goal.id)}
                            color="error"
                        >
                            <DeleteIcon />
                        </IconButton>
                    </Stack>
                </Stack>

                <Box>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 1 }}>
                        <Typography variant="body2" fontWeight={600}>
                            Progress
                        </Typography>
                        <Typography variant="body2" color="primary.main" fontWeight={700}>
                            {goal.progress.toFixed(0)}%
                        </Typography>
                    </Stack>
                    <LinearProgress
                        variant="determinate"
                        value={goal.progress}
                        sx={{
                            height: 10,
                            borderRadius: 5,
                            bgcolor: `${getCategoryColor(goal.category)}22`,
                            '& .MuiLinearProgress-bar': {
                                bgcolor: getCategoryColor(goal.category)
                            }
                        }}
                    />
                </Box>

                {goal.milestones.length > 0 && (
                    <Box>
                        <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                            Milestones ({goal.milestones.filter(m => m.completed).length}/{goal.milestones.length})
                        </Typography>
                        <Stack spacing={0.5}>
                            {goal.milestones.map(milestone => (
                                <FormControlLabel
                                    key={milestone.id}
                                    control={
                                        <Checkbox
                                            checked={milestone.completed}
                                            onChange={() => toggleMilestone(goal.id, milestone.id)}
                                            size="small"
                                        />
                                    }
                                    label={
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                textDecoration: milestone.completed ? 'line-through' : 'none',
                                                color: milestone.completed ? 'text.secondary' : 'text.primary'
                                            }}
                                        >
                                            {milestone.title}
                                        </Typography>
                                    }
                                    sx={{ ml: 0 }}
                                />
                            ))}
                        </Stack>
                    </Box>
                )}

                {goal.status === 'active' && (
                    <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => {
                            setSelectedGoalId(goal.id);
                            setMilestoneDialogOpen(true);
                        }}
                    >
                        Add Milestone
                    </Button>
                )}
            </Stack>
        </Paper>
    );

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #f59e0b 0%, #f97316 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Goals
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Set and achieve your long-term objectives
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
                                <FlagIcon sx={{ fontSize: 40, color: '#6366f1' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {activeGoals.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Active Goals
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
                                <TrophyIcon sx={{ fontSize: 40, color: '#10b981' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {completedGoals.length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Completed
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.1) 0%, rgba(245, 158, 11, 0.05) 100%)',
                        border: '1px solid rgba(245, 158, 11, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" spacing={2}>
                                <CheckIcon sx={{ fontSize: 40, color: '#f59e0b' }} />
                                <Box>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {goals.reduce((sum, g) => sum + g.milestones.filter(m => m.completed).length, 0)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Milestones Hit
                                    </Typography>
                                </Box>
                            </Stack>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Main Content */}
            <Card>
                <Tabs
                    value={tabValue}
                    onChange={(_, newValue) => setTabValue(newValue)}
                    sx={{ borderBottom: 1, borderColor: 'divider' }}
                >
                    <Tab label={`Active (${activeGoals.length})`} />
                    <Tab label={`Completed (${completedGoals.length})`} />
                </Tabs>

                <Box sx={{ p: 3 }}>
                    {tabValue === 0 && (
                        <>
                            {activeGoals.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                                        No active goals yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                                        Start setting SMART goals to achieve your dreams!
                                    </Typography>
                                    <Button
                                        variant="contained"
                                        startIcon={<AddIcon />}
                                        onClick={() => setDialogOpen(true)}
                                        size="large"
                                    >
                                        Create First Goal
                                    </Button>
                                </Paper>
                            ) : (
                                <Stack spacing={3}>
                                    {activeGoals.map(goal => renderGoalCard(goal))}
                                </Stack>
                            )}
                        </>
                    )}

                    {tabValue === 1 && (
                        <>
                            {completedGoals.length === 0 ? (
                                <Paper sx={{ p: 4, textAlign: 'center', bgcolor: 'background.default' }}>
                                    <Typography variant="h6" color="text.secondary">
                                        No completed goals yet
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Keep working towards your active goals!
                                    </Typography>
                                </Paper>
                            ) : (
                                <Stack spacing={3}>
                                    {completedGoals.map(goal => renderGoalCard(goal))}
                                </Stack>
                            )}
                        </>
                    )}
                </Box>
            </Card>

            {/* Add Goal Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Create New Goal</DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Goal Title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            fullWidth
                            autoFocus
                            placeholder="e.g., Learn Python programming"
                        />
                        <TextField
                            label="Description"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            fullWidth
                            multiline
                            rows={3}
                            placeholder="Describe your goal in detail..."
                        />
                        <TextField
                            select
                            label="Category"
                            value={category}
                            onChange={(e) => setCategory(e.target.value as GoalType['category'])}
                            fullWidth
                        >
                            <MenuItem value="career">💼 Career</MenuItem>
                            <MenuItem value="health">💪 Health</MenuItem>
                            <MenuItem value="learning">📚 Learning</MenuItem>
                            <MenuItem value="financial">💰 Financial</MenuItem>
                            <MenuItem value="personal">🎯 Personal</MenuItem>
                        </TextField>
                        <TextField
                            label="Deadline (optional)"
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            fullWidth
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddGoal} variant="contained" disabled={!title}>
                        Create Goal
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Add Milestone Dialog */}
            <Dialog open={milestoneDialogOpen} onClose={() => setMilestoneDialogOpen(false)} maxWidth="xs" fullWidth>
                <DialogTitle>Add Milestone</DialogTitle>
                <DialogContent>
                    <TextField
                        label="Milestone"
                        value={milestoneTitle}
                        onChange={(e) => setMilestoneTitle(e.target.value)}
                        fullWidth
                        autoFocus
                        placeholder="e.g., Complete Python course"
                        sx={{ mt: 1 }}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMilestoneDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleAddMilestone} variant="contained" disabled={!milestoneTitle}>
                        Add
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
                    bgcolor: '#f59e0b',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(245, 158, 11, 0.4)',
                    '&:hover': {
                        bgcolor: '#d97706',
                        transform: 'scale(1.1)',
                        boxShadow: '0 6px 30px rgba(245, 158, 11, 0.6)'
                    },
                    transition: 'all 0.3s'
                }}
            >
                <AddIcon sx={{ fontSize: 32 }} />
            </IconButton>
        </Box>
    );
};

export default Goals;
