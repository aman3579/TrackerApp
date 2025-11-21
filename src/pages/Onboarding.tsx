import { useState } from 'react';
import {
    Box,
    Container,
    Typography,
    TextField,
    Button,
    Stack,
    Card,
    CardContent,
    Grid,
    Paper,
    Switch,
    Avatar,
    Fade,
    Stepper,
    Step,
    StepLabel,
} from '@mui/material';
import {
    CheckCircle as TasksIcon,
    LocalFireDepartment as HabitsIcon,
    CalendarMonth as PlannerIcon,
    AccountBalanceWallet as FinanceIcon,
    ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';

const modules = [
    { id: 'tasks', label: 'Tasks', icon: TasksIcon, color: '#6366f1', description: 'Track to-dos and projects' },
    { id: 'habits', label: 'Habits', icon: HabitsIcon, color: '#ec4899', description: 'Build daily routines' },
    { id: 'planner', label: 'Weekly Planner', icon: PlannerIcon, color: '#10b981', description: 'Plan your week' },
    { id: 'finance', label: 'Finance', icon: FinanceIcon, color: '#f59e0b', description: 'Track income & expenses' },
];

const Onboarding = ({ onComplete }: { onComplete: () => void }) => {
    const [step, setStep] = useState(1);
    const [name, setName] = useState('');
    const [selectedModules, setSelectedModules] = useState<string[]>(['tasks', 'habits']);

    const handleModuleToggle = (moduleId: string) => {
        setSelectedModules(prev =>
            prev.includes(moduleId)
                ? prev.filter(id => id !== moduleId)
                : [...prev, moduleId]
        );
    };

    const handleComplete = () => {
        if (step === 1 && name.trim()) {
            setStep(2);
        } else if (step === 2) {
            localStorage.setItem('tracker_username', name);
            localStorage.setItem('tracker_modules', JSON.stringify(selectedModules));
            localStorage.setItem('tracker_onboarded', 'true');
            onComplete();
        }
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #0a0e1a 0%, #1a1f3a 50%, #0a0e1a 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Animated Background Blobs */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '-20%',
                    left: '-10%',
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(99, 102, 241, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'pulse 8s ease-in-out infinite',
                    '@keyframes pulse': {
                        '0%, 100%': { transform: 'scale(1)' },
                        '50%': { transform: 'scale(1.1)' },
                    },
                }}
            />
            <Box
                sx={{
                    position: 'absolute',
                    bottom: '-20%',
                    right: '-10%',
                    width: 500,
                    height: 500,
                    background: 'radial-gradient(circle, rgba(236, 72, 153, 0.15) 0%, transparent 70%)',
                    borderRadius: '50%',
                    filter: 'blur(60px)',
                    animation: 'pulse 8s ease-in-out infinite 4s',
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Fade in timeout={600}>
                    <Paper elevation={24} sx={{ p: { xs: 3, md: 5 }, borderRadius: 4, backdropFilter: 'blur(20px)' }}>
                        {/* Stepper */}
                        <Stepper activeStep={step - 1} sx={{ mb: 4 }}>
                            <Step>
                                <StepLabel>Welcome</StepLabel>
                            </Step>
                            <Step>
                                <StepLabel>Customize</StepLabel>
                            </Step>
                        </Stepper>

                        {step === 1 ? (
                            /* Step 1: Name Input */
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography
                                    variant="h2"
                                    sx={{
                                        fontWeight: 700,
                                        background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                        WebkitBackgroundClip: 'text',
                                        WebkitTextFillColor: 'transparent',
                                        mb: 2,
                                    }}
                                >
                                    Welcome to Tracker
                                </Typography>
                                <Typography variant="h6" color="text.secondary" sx={{ mb: 4 }}>
                                    Your all-in-one productivity companion
                                </Typography>

                                <Stack spacing={3} sx={{ maxWidth: 400, mx: 'auto' }}>
                                    <TextField
                                        label="What's your name?"
                                        variant="outlined"
                                        fullWidth
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        onKeyPress={(e) => e.key === 'Enter' && handleComplete()}
                                        autoFocus
                                        sx={{
                                            '& .MuiOutlinedInput-root': {
                                                fontSize: '1.25rem',
                                            },
                                        }}
                                    />
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleComplete}
                                        disabled={!name.trim()}
                                        sx={{
                                            py: 1.5,
                                            fontSize: '1.1rem',
                                            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5558e3 0%, #d63384 100%)',
                                            },
                                        }}
                                    >
                                        Continue
                                    </Button>
                                </Stack>
                            </Box>
                        ) : (
                            /* Step 2: Module Selection */
                            <Box>
                                <Typography variant="h4" sx={{ fontWeight: 700, mb: 1, textAlign: 'center' }}>
                                    Choose Your Modules
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 4, textAlign: 'center' }}>
                                    Select the tracking modules you want to use
                                </Typography>

                                <Grid container spacing={2} sx={{ mb: 4 }}>
                                    {modules.map((module, index) => {
                                        const Icon = module.icon;
                                        const isSelected = selectedModules.includes(module.id);

                                        return (
                                            <Grid size={{ xs: 12, sm: 6 }} key={module.id}>
                                                <Fade in timeout={400 + index * 100}>
                                                    <Card
                                                        onClick={() => handleModuleToggle(module.id)}
                                                        sx={{
                                                            cursor: 'pointer',
                                                            border: '2px solid',
                                                            borderColor: isSelected ? module.color : 'divider',
                                                            bgcolor: isSelected ? `${module.color}15` : 'background.paper',
                                                            transition: 'all 0.3s',
                                                            '&:hover': {
                                                                transform: 'translateY(-4px)',
                                                                boxShadow: `0 8px 24px ${module.color}40`,
                                                            },
                                                        }}
                                                    >
                                                        <CardContent>
                                                            <Stack direction="row" alignItems="center" spacing={2}>
                                                                <Avatar
                                                                    sx={{
                                                                        bgcolor: module.color,
                                                                        width: 48,
                                                                        height: 48,
                                                                    }}
                                                                >
                                                                    <Icon />
                                                                </Avatar>
                                                                <Box sx={{ flex: 1 }}>
                                                                    <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                                                        {module.label}
                                                                    </Typography>
                                                                    <Typography variant="body2" color="text.secondary">
                                                                        {module.description}
                                                                    </Typography>
                                                                </Box>
                                                                <Switch
                                                                    checked={isSelected}
                                                                    sx={{
                                                                        '& .MuiSwitch-thumb': {
                                                                            bgcolor: isSelected ? module.color : undefined,
                                                                        },
                                                                    }}
                                                                />
                                                            </Stack>
                                                        </CardContent>
                                                    </Card>
                                                </Fade>
                                            </Grid>
                                        );
                                    })}
                                </Grid>

                                <Stack direction="row" spacing={2} justifyContent="center">
                                    <Button
                                        variant="outlined"
                                        size="large"
                                        onClick={() => setStep(1)}
                                        sx={{ minWidth: 120 }}
                                    >
                                        Back
                                    </Button>
                                    <Button
                                        variant="contained"
                                        size="large"
                                        endIcon={<ArrowForwardIcon />}
                                        onClick={handleComplete}
                                        disabled={selectedModules.length === 0}
                                        sx={{
                                            minWidth: 120,
                                            background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                            '&:hover': {
                                                background: 'linear-gradient(135deg, #5558e3 0%, #d63384 100%)',
                                            },
                                        }}
                                    >
                                        Get Started
                                    </Button>
                                </Stack>
                            </Box>
                        )}
                    </Paper>
                </Fade>
            </Container>
        </Box>
    );
};

export default Onboarding;
