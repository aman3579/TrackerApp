import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useFinance } from '../context/FinanceContext';
import { format } from 'date-fns';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    Checkbox,
    IconButton,
    Paper,
    Divider,
    Avatar,
    LinearProgress,
} from '@mui/material';
import {
    CheckCircle as CheckCircleIcon,
    RadioButtonUnchecked as RadioButtonUncheckedIcon,
    LocalFireDepartment as FireIcon,
    AttachMoney as MoneyIcon,
    TrendingDown as TrendingDownIcon,
    CheckCircle as CheckIcon,
} from '@mui/icons-material';

const ComboMode = () => {
    const { tasks, toggleTask } = useTasks();
    const { habits, toggleHabitCompletion } = useHabits();
    const { transactions, getBalance } = useFinance();

    const today = new Date();
    const todayStr = format(today, 'yyyy-MM-dd');

    const todayTasks = tasks.filter(t => !t.completed).slice(0, 5);
    const completedToday = tasks.filter(t => t.completed).length;
    const completionRate = tasks.length > 0 ? (completedToday / tasks.length) * 100 : 0;

    const todayTransactions = transactions.filter(t => t.date === todayStr);
    const todaySpending = todayTransactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

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
                    Combo Mode
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Your unified daily view - {format(today, 'EEEE, MMMM d, yyyy')}
                </Typography>
            </Box>

            <Grid container spacing={3}>
                {/* Daily Overview */}
                <Grid size={12}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Today's Overview
                        </Typography>
                        <Grid container spacing={2}>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={1} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'primary.main', width: 56, height: 56 }}>
                                        <CheckCircleIcon />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {completionRate.toFixed(0)}%
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Tasks Complete
                                    </Typography>
                                    <LinearProgress
                                        variant="determinate"
                                        value={completionRate}
                                        sx={{ width: '100%', height: 6, borderRadius: 3 }}
                                    />
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={1} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'secondary.main', width: 56, height: 56 }}>
                                        <FireIcon />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        {habits.filter(h => h.completedDates.includes(todayStr)).length}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Habits Done
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        of {habits.length} total
                                    </Typography>
                                </Stack>
                            </Grid>
                            <Grid size={{ xs: 12, sm: 4 }}>
                                <Stack spacing={1} alignItems="center">
                                    <Avatar sx={{ bgcolor: 'error.main', width: 56, height: 56 }}>
                                        <TrendingDownIcon />
                                    </Avatar>
                                    <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                        ${todaySpending.toFixed(0)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Spent Today
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        Balance: ${getBalance().toFixed(0)}
                                    </Typography>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Paper>
                </Grid>

                {/* Today's Tasks */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Today's Tasks
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {todayTasks.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {todayTasks.map(task => (
                                        <Stack
                                            key={task.id}
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 1,
                                                bgcolor: 'background.default',
                                            }}
                                        >
                                            <Checkbox
                                                checked={task.completed}
                                                onChange={() => toggleTask(task.id)}
                                                icon={<RadioButtonUncheckedIcon />}
                                                checkedIcon={<CheckCircleIcon />}
                                                size="small"
                                            />
                                            <Typography sx={{ flex: 1 }}>
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
                                    No pending tasks 🎉
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Today's Habits */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                Today's Habits
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {habits.length > 0 ? (
                                <Stack spacing={1.5}>
                                    {habits.slice(0, 6).map(habit => {
                                        const isCompleted = habit.completedDates.includes(todayStr);
                                        return (
                                            <Stack
                                                key={habit.id}
                                                direction="row"
                                                alignItems="center"
                                                spacing={2}
                                                sx={{
                                                    p: 1.5,
                                                    borderRadius: 1,
                                                    bgcolor: isCompleted ? 'rgba(236, 72, 153, 0.1)' : 'background.default',
                                                }}
                                            >
                                                <IconButton
                                                    onClick={() => toggleHabitCompletion(habit.id, today)}
                                                    size="small"
                                                    sx={{
                                                        bgcolor: isCompleted ? 'secondary.main' : 'action.hover',
                                                        color: isCompleted ? 'white' : 'text.secondary',
                                                    }}
                                                >
                                                    <CheckIcon fontSize="small" />
                                                </IconButton>
                                                <Typography sx={{ flex: 1 }}>
                                                    {habit.title}
                                                </Typography>
                                                <Chip
                                                    icon={<FireIcon />}
                                                    label={`${habit.streak}`}
                                                    size="small"
                                                    sx={{ bgcolor: 'rgba(245, 158, 11, 0.15)', color: '#f59e0b' }}
                                                />
                                            </Stack>
                                        );
                                    })}
                                </Stack>
                            ) : (
                                <Typography color="text.secondary" align="center" sx={{ py: 3 }}>
                                    No habits yet
                                </Typography>
                            )}
                        </CardContent>
                    </Card>
                </Grid>

                {/* Today's Spending */}
                {todayTransactions.length > 0 && (
                    <Grid size={12}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                                    Today's Transactions
                                </Typography>
                                <Divider sx={{ mb: 2 }} />
                                <Stack spacing={1.5}>
                                    {todayTransactions.map(transaction => (
                                        <Stack
                                            key={transaction.id}
                                            direction="row"
                                            alignItems="center"
                                            spacing={2}
                                            sx={{
                                                p: 1.5,
                                                borderRadius: 1,
                                                bgcolor: 'background.default',
                                            }}
                                        >
                                            <Avatar sx={{
                                                bgcolor: transaction.type === 'income' ? 'primary.main' : 'error.main',
                                                width: 32,
                                                height: 32,
                                            }}>
                                                <MoneyIcon fontSize="small" />
                                            </Avatar>
                                            <Box sx={{ flex: 1 }}>
                                                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                    {transaction.description}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {transaction.category}
                                                </Typography>
                                            </Box>
                                            <Typography
                                                variant="h6"
                                                sx={{
                                                    fontWeight: 700,
                                                    color: transaction.type === 'income' ? 'success.main' : 'error.main',
                                                }}
                                            >
                                                {transaction.type === 'income' ? '+' : '-'}${transaction.amount.toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </CardContent>
                        </Card>
                    </Grid>
                )}
            </Grid>
        </Box>
    );
};

export default ComboMode;
