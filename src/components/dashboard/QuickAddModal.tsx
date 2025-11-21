import { useState, useEffect } from 'react';
import { useTasks } from '../../context/TaskContext';
import { useHabits } from '../../context/HabitContext';
import { useFinance } from '../../context/FinanceContext';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
    Tabs,
    Tab,
    Box,
    Stack,
    ToggleButtonGroup,
    ToggleButton,
    Chip,
    IconButton,
    Typography,
} from '@mui/material';
import {
    Close as CloseIcon,
    CheckCircle as TaskIcon,
    LocalFireDepartment as HabitIcon,
    AttachMoney as MoneyIcon,
} from '@mui/icons-material';

interface QuickAddModalProps {
    open: boolean;
    onClose: () => void;
    initialTab?: number;
}

const QuickAddModal = ({ open, onClose, initialTab = 0 }: QuickAddModalProps) => {
    const [activeTab, setActiveTab] = useState(initialTab);
    const { addTask } = useTasks();
    const { addHabit } = useHabits();
    const { addTransaction } = useFinance();

    // Task State
    const [taskTitle, setTaskTitle] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskPriority, setTaskPriority] = useState<'low' | 'medium' | 'high'>('medium');

    // Habit State
    const [habitTitle, setHabitTitle] = useState('');
    const [habitFrequency, setHabitFrequency] = useState<string[]>(['Daily']);

    // Finance State
    const [financeAmount, setFinanceAmount] = useState('');
    const [financeCategory, setFinanceCategory] = useState('Food');
    const [financeType, setFinanceType] = useState<'income' | 'expense'>('expense');
    const [financeDesc, setFinanceDesc] = useState('');
    const [financeDate, setFinanceDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        if (open && initialTab !== undefined) {
            setActiveTab(initialTab);
        }
    }, [open, initialTab]);

    const handleAddTask = () => {
        if (!taskTitle.trim()) return;
        addTask(taskTitle, taskDate || undefined, taskPriority);
        setTaskTitle('');
        setTaskDate('');
        setTaskPriority('medium');
        onClose();
    };

    const handleAddHabit = () => {
        if (!habitTitle.trim()) return;
        addHabit(habitTitle, habitFrequency);
        setHabitTitle('');
        setHabitFrequency(['Daily']);
        onClose();
    };

    const handleAddFinance = () => {
        if (!financeAmount) return;
        addTransaction({
            amount: parseFloat(financeAmount),
            category: financeCategory,
            type: financeType,
            description: financeDesc,
            date: financeDate,
        });
        setFinanceAmount('');
        setFinanceCategory('Food');
        setFinanceType('expense');
        setFinanceDesc('');
        setFinanceDate(new Date().toISOString().split('T')[0]);
        onClose();
    };

    const handleTabChange = (_: any, newValue: number) => {
        setActiveTab(newValue);
    };

    const toggleFrequency = (day: string) => {
        if (day === 'Daily') {
            setHabitFrequency(['Daily']);
        } else {
            const newFreq = habitFrequency.includes('Daily')
                ? [day]
                : habitFrequency.includes(day)
                    ? habitFrequency.filter(d => d !== day)
                    : [...habitFrequency, day];
            setHabitFrequency(newFreq.length ? newFreq : ['Daily']);
        }
    };

    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 3,
                    backdropFilter: 'blur(20px)',
                }
            }}
        >
            <DialogTitle sx={{ pb: 0 }}>
                <Stack direction="row" alignItems="center" justifyContent="space-between">
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        Quick Add
                    </Typography>
                    <IconButton onClick={onClose} size="small">
                        <CloseIcon />
                    </IconButton>
                </Stack>
            </DialogTitle>

            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs
                    value={activeTab}
                    onChange={handleTabChange}
                    variant="fullWidth"
                >
                    <Tab icon={<TaskIcon />} label="Task" />
                    <Tab icon={<HabitIcon />} label="Habit" />
                    <Tab icon={<MoneyIcon />} label="Finance" />
                </Tabs>
            </Box>

            <DialogContent sx={{ pt: 3 }}>
                {/* Task Tab */}
                {activeTab === 0 && (
                    <Stack spacing={2.5}>
                        <TextField
                            label="Task Title"
                            fullWidth
                            value={taskTitle}
                            onChange={(e) => setTaskTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                        />
                        <Stack direction="row" spacing={2}>
                            <TextField
                                label="Due Date"
                                type="date"
                                fullWidth
                                value={taskDate}
                                onChange={(e) => setTaskDate(e.target.value)}
                                InputLabelProps={{ shrink: true }}
                            />
                            <TextField
                                label="Priority"
                                select
                                fullWidth
                                value={taskPriority}
                                onChange={(e) => setTaskPriority(e.target.value as any)}
                            >
                                <MenuItem value="low">Low</MenuItem>
                                <MenuItem value="medium">Medium</MenuItem>
                                <MenuItem value="high">High</MenuItem>
                            </TextField>
                        </Stack>
                    </Stack>
                )}

                {/* Habit Tab */}
                {activeTab === 1 && (
                    <Stack spacing={2.5}>
                        <TextField
                            label="Habit Title"
                            fullWidth
                            value={habitTitle}
                            onChange={(e) => setHabitTitle(e.target.value)}
                            placeholder="e.g., Drink Water, Read Book"
                            autoFocus
                            onKeyPress={(e) => e.key === 'Enter' && handleAddHabit()}
                        />
                        <Box>
                            <Typography variant="body2" color="text.secondary" sx={{ mb: 1.5 }}>
                                Frequency
                            </Typography>
                            <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                                {['Daily', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(day => (
                                    <Chip
                                        key={day}
                                        label={day}
                                        onClick={() => toggleFrequency(day)}
                                        color={habitFrequency.includes(day) ? 'secondary' : 'default'}
                                        variant={habitFrequency.includes(day) ? 'filled' : 'outlined'}
                                    />
                                ))}
                            </Stack>
                        </Box>
                    </Stack>
                )}

                {/* Finance Tab */}
                {activeTab === 2 && (
                    <Stack spacing={2.5}>
                        <ToggleButtonGroup
                            value={financeType}
                            exclusive
                            onChange={(_, newType) => newType && setFinanceType(newType)}
                            fullWidth
                        >
                            <ToggleButton value="expense" sx={{ py: 1.5 }}>
                                Expense
                            </ToggleButton>
                            <ToggleButton value="income" sx={{ py: 1.5 }}>
                                Income
                            </ToggleButton>
                        </ToggleButtonGroup>

                        <TextField
                            label="Amount"
                            type="number"
                            fullWidth
                            value={financeAmount}
                            onChange={(e) => setFinanceAmount(e.target.value)}
                            placeholder="0.00"
                            autoFocus
                            InputProps={{
                                startAdornment: <Typography sx={{ mr: 1 }}>$</Typography>,
                            }}
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFinance()}
                        />

                        <TextField
                            label="Category"
                            select
                            fullWidth
                            value={financeCategory}
                            onChange={(e) => setFinanceCategory(e.target.value)}
                            SelectProps={{
                                native: false,
                                MenuProps: {
                                    PaperProps: {
                                        style: {
                                            maxHeight: 300,
                                        },
                                    },
                                    anchorOrigin: {
                                        vertical: 'bottom',
                                        horizontal: 'left',
                                    },
                                    transformOrigin: {
                                        vertical: 'top',
                                        horizontal: 'left',
                                    },
                                },
                            }}
                        >
                            {financeType === 'expense' ? (
                                <>
                                    <MenuItem value="Food">Food</MenuItem>
                                    <MenuItem value="Transport">Transport</MenuItem>
                                    <MenuItem value="Shopping">Shopping</MenuItem>
                                    <MenuItem value="Bills">Bills</MenuItem>
                                    <MenuItem value="Entertainment">Entertainment</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </>
                            ) : (
                                <>
                                    <MenuItem value="Salary">Salary</MenuItem>
                                    <MenuItem value="Freelance">Freelance</MenuItem>
                                    <MenuItem value="Gift">Gift</MenuItem>
                                    <MenuItem value="Other">Other</MenuItem>
                                </>
                            )}
                        </TextField>

                        <TextField
                            label="Description (Optional)"
                            fullWidth
                            value={financeDesc}
                            onChange={(e) => setFinanceDesc(e.target.value)}
                            placeholder="Add a note"
                            onKeyPress={(e) => e.key === 'Enter' && handleAddFinance()}
                        />

                        <TextField
                            label="Date"
                            type="date"
                            fullWidth
                            value={financeDate}
                            onChange={(e) => setFinanceDate(e.target.value)}
                            InputLabelProps={{ shrink: true }}
                        />
                    </Stack>
                )}
            </DialogContent>

            <DialogActions sx={{ px: 3, pb: 3 }}>
                <Button onClick={onClose} variant="outlined">
                    Cancel
                </Button>
                <Button
                    onClick={activeTab === 0 ? handleAddTask : activeTab === 1 ? handleAddHabit : handleAddFinance}
                    variant="contained"
                    disabled={
                        (activeTab === 0 && !taskTitle.trim()) ||
                        (activeTab === 1 && !habitTitle.trim()) ||
                        (activeTab === 2 && !financeAmount)
                    }
                    sx={{
                        background: activeTab === 0
                            ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                            : activeTab === 1
                                ? 'linear-gradient(135deg, #ec4899 0%, #f472b6 100%)'
                                : 'linear-gradient(135deg, #10b981 0%, #34d399 100%)',
                        '&:hover': {
                            background: activeTab === 0
                                ? 'linear-gradient(135deg, #5558e3 0%, #7c3aed 100%)'
                                : activeTab === 1
                                    ? 'linear-gradient(135deg, #db2777 0%, #ec4899 100%)'
                                    : 'linear-gradient(135deg, #059669 0%, #10b981 100%)',
                        }
                    }}
                >
                    {activeTab === 0 ? 'Add Task' : activeTab === 1 ? 'Start Habit' : 'Add Transaction'}
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default QuickAddModal;
