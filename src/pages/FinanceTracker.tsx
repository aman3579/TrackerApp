import { useFinance } from '../context/FinanceContext';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip } from 'recharts';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    Stack,
    Chip,
    IconButton,
    Paper,
    Divider,
    Avatar,
    Tooltip,
    Fade,
} from '@mui/material';
import {
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
    Delete as DeleteIcon,
    ShoppingCart as ShoppingIcon,
    Restaurant as FoodIcon,
    DirectionsCar as TransportIcon,
    Home as BillsIcon,
    Movie as EntertainmentIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';

const COLORS = ['#6366f1', '#ec4899', '#f59e0b', '#10b981', '#8b5cf6'];

const categoryIcons: Record<string, any> = {
    Food: FoodIcon,
    Transport: TransportIcon,
    Shopping: ShoppingIcon,
    Bills: BillsIcon,
    Entertainment: EntertainmentIcon,
};

const FinanceTracker = () => {
    const { transactions, getBalance, deleteTransaction, getCategoryTotals } = useFinance();

    const balance = getBalance();
    const categoryData = getCategoryTotals();

    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0);

    const pieData = Object.entries(categoryData).map(([name, value]) => ({
        name,
        value: Math.abs(value),
    }));

    const recentTransactions = [...transactions]
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, 10);

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #10b981 0%, #6366f1 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Finance
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Track your income and expenses
                </Typography>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} sx={{ mb: 4 }}>
                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        background: balance >= 0
                            ? 'linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)'
                            : 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: `1px solid ${balance >= 0 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(239, 68, 68, 0.2)'}`,
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Current Balance
                                </Typography>
                                <Avatar sx={{ bgcolor: balance >= 0 ? 'success.main' : 'error.main' }}>
                                    <MoneyIcon />
                                </Avatar>
                            </Stack>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: balance >= 0 ? 'success.main' : 'error.main' }}>
                                ${Math.abs(balance).toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)',
                        border: '1px solid rgba(99, 102, 241, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Income
                                </Typography>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>
                                    <TrendingUpIcon />
                                </Avatar>
                            </Stack>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                ${totalIncome.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                    <Card sx={{
                        background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)',
                        border: '1px solid rgba(239, 68, 68, 0.2)',
                    }}>
                        <CardContent>
                            <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mb: 2 }}>
                                <Typography variant="body2" color="text.secondary">
                                    Total Expenses
                                </Typography>
                                <Avatar sx={{ bgcolor: 'error.main' }}>
                                    <TrendingDownIcon />
                                </Avatar>
                            </Stack>
                            <Typography variant="h3" sx={{ fontWeight: 700, color: 'error.main' }}>
                                ${totalExpense.toFixed(2)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            <Grid container spacing={3}>
                {/* Expense Breakdown Chart */}
                <Grid size={{ xs: 12, md: 5 }}>
                    <Paper sx={{ p: 3, height: '100%' }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 3 }}>
                            Expense Breakdown
                        </Typography>
                        {pieData.length > 0 ? (
                            <>
                                <ResponsiveContainer width="100%" height={250}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={60}
                                            outerRadius={100}
                                            paddingAngle={5}
                                            dataKey="value"
                                        >
                                            {pieData.map((_, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <RechartsTooltip
                                            contentStyle={{
                                                backgroundColor: 'rgba(20, 24, 41, 0.95)',
                                                border: '1px solid rgba(255,255,255,0.1)',
                                                borderRadius: 8,
                                            }}
                                        />
                                    </PieChart>
                                </ResponsiveContainer>
                                <Stack spacing={1} sx={{ mt: 2 }}>
                                    {pieData.map((entry, index) => (
                                        <Stack key={entry.name} direction="row" alignItems="center" spacing={1}>
                                            <Box sx={{ width: 12, height: 12, borderRadius: 1, bgcolor: COLORS[index % COLORS.length] }} />
                                            <Typography variant="body2" sx={{ flex: 1 }}>
                                                {entry.name}
                                            </Typography>
                                            <Typography variant="body2" sx={{ fontWeight: 600 }}>
                                                ${entry.value.toFixed(2)}
                                            </Typography>
                                        </Stack>
                                    ))}
                                </Stack>
                            </>
                        ) : (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                No expense data yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>

                {/* Recent Transactions */}
                <Grid size={{ xs: 12, md: 7 }}>
                    <Paper sx={{ p: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                            Recent Transactions
                        </Typography>
                        <Divider sx={{ mb: 2 }} />
                        {recentTransactions.length > 0 ? (
                            <Stack spacing={1.5} sx={{ maxHeight: 400, overflow: 'auto' }}>
                                {recentTransactions.map((transaction, index) => {
                                    const Icon = categoryIcons[transaction.category] || MoneyIcon;

                                    return (
                                        <Fade in timeout={300 + index * 50} key={transaction.id}>
                                            <Card variant="outlined">
                                                <CardContent sx={{ p: 2, '&:last-child': { pb: 2 } }}>
                                                    <Stack direction="row" alignItems="center" spacing={2}>
                                                        <Avatar sx={{
                                                            bgcolor: transaction.type === 'income' ? 'primary.main' : 'error.main',
                                                            width: 40,
                                                            height: 40,
                                                        }}>
                                                            <Icon fontSize="small" />
                                                        </Avatar>

                                                        <Box sx={{ flex: 1, minWidth: 0 }}>
                                                            <Typography variant="body1" sx={{ fontWeight: 600 }}>
                                                                {transaction.description}
                                                            </Typography>
                                                            <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                                                                <Chip
                                                                    label={transaction.category}
                                                                    size="small"
                                                                    variant="outlined"
                                                                />
                                                                <Typography variant="caption" color="text.secondary">
                                                                    {new Date(transaction.date).toLocaleDateString()}
                                                                </Typography>
                                                            </Stack>
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

                                                        <Tooltip title="Delete">
                                                            <IconButton
                                                                onClick={() => deleteTransaction(transaction.id)}
                                                                color="error"
                                                                size="small"
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </Stack>
                                                </CardContent>
                                            </Card>
                                        </Fade>
                                    );
                                })}
                            </Stack>
                        ) : (
                            <Typography color="text.secondary" align="center" sx={{ py: 4 }}>
                                No transactions yet
                            </Typography>
                        )}
                    </Paper>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FinanceTracker;
