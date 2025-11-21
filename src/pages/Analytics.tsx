import { useTasks } from '../context/TaskContext';
import { useHabits } from '../context/HabitContext';
import { useFinance } from '../context/FinanceContext';
import { BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { subDays, format } from 'date-fns';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Paper,
    Stack,
    LinearProgress,
    Avatar,
} from '@mui/material';
import {
    CheckCircle as CheckIcon,
    LocalFireDepartment as FireIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const Analytics = () => {
    const { tasks } = useTasks();
    const { habits } = useHabits();
    const { transactions } = useFinance();

    // Task analytics
    const completedTasks = tasks.filter(t => t.completed).length;
    const completionRate = tasks.length > 0 ? (completedTasks / tasks.length) * 100 : 0;

    // Habit analytics
    const habitStreakData = habits.map(habit => ({
        name: habit.title.slice(0, 15),
        streak: habit.streak,
    }));

    // Spending trend
    const spendingTrend = Array.from({ length: 7 }).map((_, i) => {
        const date = subDays(new Date(), 6 - i);
        const dateStr = format(date, 'yyyy-MM-dd');
        const dayTotal = transactions
            .filter(t => t.type === 'expense' && t.date.startsWith(dateStr))
            .reduce((sum, t) => sum + t.amount, 0);

        return {
            date: format(date, 'EEE'),
            amount: dayTotal,
        };
    });

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #8b5cf6 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Analytics
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Insights and statistics
                </Typography>
            </Box>

            {/* Overview Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Task Completion
                                </Typography>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 40, height: 40 }}>
                                    <CheckIcon fontSize="small" />
                                </Avatar>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700, mb: 1 }}>
                                {completionRate.toFixed(0)}%
                            </Typography>
                            <LinearProgress variant="determinate" value={completionRate} sx={{ height: 6, borderRadius: 3 }} />
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Active Habits
                                </Typography>
                                <Avatar sx={{ bgcolor: 'secondary.main', width: 40, height: 40 }}>
                                    <FireIcon fontSize="small" />
                                </Avatar>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {habits.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Streak
                                </Typography>
                                <Avatar sx={{ bgcolor: 'warning.main', width: 40, height: 40 }}>
                                    <FireIcon fontSize="small" />
                                </Avatar>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {habits.reduce((sum, h) => sum + h.streak, 0)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, sm: 6, md: 3 }}>
                    <Card>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Transactions
                                </Typography>
                                <Avatar sx={{ bgcolor: 'success.main', width: 40, height: 40 }}>
                                    <MoneyIcon fontSize="small" />
                                </Avatar>
                            </Stack>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                {transactions.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Charts */}
            <Grid container spacing={3}>
                {/* Habit Streaks */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Habit Streaks
                        </Typography>
                        {habitStreakData.length > 0 ? (
                            <ResponsiveContainer width="100%" height={300}>
                                <BarChart data={habitStreakData}>
                                    <XAxis dataKey="name" stroke="#94a3b8" />
                                    <YAxis stroke="#94a3b8" />
                                    <RechartsTooltip
                                        contentStyle={{
                                            backgroundColor: 'rgba(20, 24, 41, 0.95)',
                                            border: '1px solid rgba(255,255,255,0.1)',
                                            borderRadius: 8,
                                        }}
                                    />
                                    <Bar dataKey="streak" fill="#ec4899" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        ) : (
                            <Typography color="text.secondary" align="center" sx={{ py: 6 }}>
                                No habit data yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Spending Trend */}
                <Grid size={{ xs: 12, md: 6 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            7-Day Spending Trend
                        </Typography>
                        <ResponsiveContainer width="100%" height={300}>
                            <LineChart data={spendingTrend}>
                                <XAxis dataKey="date" stroke="#94a3b8" />
                                <YAxis stroke="#94a3b8" />
                                <RechartsTooltip
                                    contentStyle={{
                                        backgroundColor: 'rgba(20, 24, 41, 0.95)',
                                        border: '1px solid rgba(255,255,255,0.1)',
                                        borderRadius: 8,
                                    }}
                                />
                                <Line
                                    type="monotone"
                                    dataKey="amount"
                                    stroke="#6366f1"
                                    strokeWidth={3}
                                    dot={{ fill: '#6366f1', r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            </LineChart>
                        </ResponsiveContainer>
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default Analytics;
