import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useFinance } from '../context/FinanceContext';
import QuickAddModal from '../components/dashboard/QuickAddModal';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    LinearProgress,
    Button,
    Stack,
    Avatar,
    Divider,
    Paper
} from '@mui/material';
import {
    Add as AddIcon,
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    TrendingUp as TrendingUpIcon,
    LocalFireDepartment as FireIcon,
    WalletOutlined as WalletIcon,
    CalendarMonth as CalendarIcon,
    ArrowForward as ArrowForwardIcon
} from '@mui/icons-material';

const Dashboard = () => {
    const navigate = useNavigate();
    const { tasks } = useTasks();
    const { habits } = useHabits();
    const { getBalance, transactions } = useFinance();
    const [modalOpen, setModalOpen] = useState(false);
    const [modalTab, setModalTab] = useState(0);

    const userName = localStorage.getItem('tracker_username') || 'User';
    const todayTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);
    const completionRate = tasks.length > 0 ? ((completedTasks.length / tasks.length) * 100).toFixed(0) : 0;

    const totalStreak = habits.reduce((sum, habit) => sum + habit.streak, 0);
    const avgStreak = habits.length > 0 ? (totalStreak / habits.length).toFixed(1) : 0;

    const balance = getBalance();
    const thisMonthTransactions = transactions.filter(t => {
        const date = new Date(t.date);
        const now = new Date();
        return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
    });
    const monthlyExpenses = thisMonthTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return 'Good Morning';
        if (hour < 18) return 'Good Afternoon';
        return 'Good Evening';
    };

    const handleOpenModal = (tab: number = 0) => {
        setModalTab(tab);
        setModalOpen(true);
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
                    {getGreeting()}, {userName}
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Here's your daily overview.
                </Typography>
            </Box>

            {/* Quick Actions - Moved to Top */}
            <Paper sx={{ p: 3, mb: 4, background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)' }}>
                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                    Quick Actions
                </Typography>
                <Grid container spacing={2}>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => handleOpenModal(0)}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #5558e3 0%, #7c3aed 100%)',
                                }
                            }}
                        >
                            Add Task
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<FireIcon />}
                            onClick={() => handleOpenModal(1)}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)',
                                }
                            }}
                        >
                            Track Habit
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<CalendarIcon />}
                            onClick={() => navigate('/planner')}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                                }
                            }}
                        >
                            Plan Week
                        </Button>
                    </Grid>
                    <Grid size={{ xs: 6, sm: 3 }}>
                        <Button
                            fullWidth
                            variant="contained"
                            startIcon={<WalletIcon />}
                            onClick={() => handleOpenModal(2)}
                            sx={{
                                py: 1.5,
                                background: 'linear-gradient(135deg, #f59e0b 0%, #fbbf24 100%)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #d97706 0%, #f59e0b 100%)',
                                }
                            }}
                        >
                            Add Expense
                        </Button>
                    </Grid>
                </Grid>
            </Paper>

            {/* Stats Grid */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                {/* Tasks Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(99, 102, 241, 0.2)'
                        }
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                                    <CheckCircleIcon />
                                </Avatar>
                                <Chip
                                    label={`${completionRate}%`}
                                    color="primary"
                                    size="small"
                                    sx={{ fontWeight: 600 }}
                                />
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {todayTasks.length}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Tasks Pending
                            </Typography>
                            <LinearProgress
                                variant="determinate"
                                value={Number(completionRate)}
                                sx={{ height: 8, borderRadius: 4, mb: 1 }}
                            />
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/tasks')}
                                sx={{ mt: 1 }}
                            >
                                View All
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Habits Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)',
                        border: '1px solid rgba(236, 72, 153, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(236, 72, 153, 0.2)'
                        }
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#ec4899', width: 48, height: 48 }}>
                                    <FireIcon />
                                </Avatar>
                                <Chip
                                    label={`${avgStreak} avg`}
                                    sx={{ bgcolor: '#ec4899', color: 'white', fontWeight: 600 }}
                                    size="small"
                                />
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                {totalStreak}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Day Streak 🔥
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#ec4899', fontWeight: 600 }}>
                                {habits.length} Active Habits
                            </Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/habits')}
                                sx={{ mt: 1 }}
                            >
                                View All
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>

                {/* Finance Card */}
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        height: '100%',
                        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)',
                        border: '1px solid rgba(16, 185, 129, 0.2)',
                        transition: 'all 0.3s',
                        '&:hover': {
                            transform: 'translateY(-4px)',
                            boxShadow: '0 12px 24px rgba(16, 185, 129, 0.2)'
                        }
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Avatar sx={{ bgcolor: '#10b981', width: 48, height: 48 }}>
                                    <WalletIcon />
                                </Avatar>
                                <Chip
                                    icon={<TrendingUpIcon />}
                                    label="This Month"
                                    sx={{ bgcolor: '#10b981', color: 'white', fontWeight: 600 }}
                                    size="small"
                                />
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 0.5 }}>
                                ${balance.toFixed(0)}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Balance
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#10b981', fontWeight: 600 }}>
                                ${monthlyExpenses.toFixed(0)} spent
                            </Typography>
                            <Button
                                size="small"
                                endIcon={<ArrowForwardIcon />}
                                onClick={() => navigate('/finance')}
                                sx={{ mt: 1 }}
                            >
                                View All
                            </Button>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recent Tasks Section */}
            <Paper sx={{ p: 3, mb: 3, borderRadius: 2 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                        Recent Tasks
                    </Typography>
                    <Button size="small" onClick={() => navigate('/tasks')}>
                        See All
                    </Button>
                </Stack>
                <Divider sx={{ mb: 2 }} />
                {todayTasks.slice(0, 5).length > 0 ? (
                    <Stack spacing={1.5}>
                        {todayTasks.slice(0, 5).map(task => (
                            <Stack
                                key={task.id}
                                direction="row"
                                alignItems="center"
                                spacing={2}
                                sx={{
                                    p: 1.5,
                                    borderRadius: 1,
                                    bgcolor: 'background.default',
                                    '&:hover': { bgcolor: 'action.hover' }
                                }}
                            >
                                {task.completed ? (
                                    <CheckCircleIcon sx={{ color: 'success.main' }} />
                                ) : (
                                    <RadioButtonUncheckedIcon sx={{ color: 'text.secondary' }} />
                                )}
                                <Typography sx={{ flex: 1, textDecoration: task.completed ? 'line-through' : 'none' }}>
                                    {task.title}
                                </Typography>
                                <Chip
                                    label={task.priority}
                                    size="small"
                                    color={task.priority === 'high' ? 'error' : task.priority === 'medium' ? 'warning' : 'default'}
                                />
                            </Stack>
                        ))}
                    </Stack>
                ) : (
                    <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                        No pending tasks. Great job! 🎉
                    </Typography>
                )}
            </Paper>

            {/* Quick Add Modal */}
            <QuickAddModal open={modalOpen} onClose={() => setModalOpen(false)} initialTab={modalTab} />

            {/* Floating Action Button */}
            <IconButton
                onClick={() => handleOpenModal(0)}
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

export default Dashboard;
