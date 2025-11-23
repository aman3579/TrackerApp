import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
    Box,
    Card,
    CardContent,
    TextField,
    Button,
    Typography,
    Stack,
    InputAdornment,
    IconButton,
    Tabs,
    Tab,
} from '@mui/material';
import {
    Visibility,
    VisibilityOff,
    Person,
    Lock,
    Login as LoginIcon,
    PersonAdd as RegisterIcon,
} from '@mui/icons-material';

const Login = () => {
    const navigate = useNavigate();
    const { login, register } = useAuth();

    const [mode, setMode] = useState<'login' | 'register'>('login');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        if (mode === 'register') {
            if (password !== confirmPassword) {
                alert('Passwords do not match');
                return;
            }

            const success = register(username, password);
            if (success) {
                navigate('/');
            }
        } else {
            const success = login(username, password);
            if (success) {
                navigate('/');
            }
        }
    };

    const handleModeChange = (_: React.SyntheticEvent, newValue: 'login' | 'register') => {
        setMode(newValue);
        setUsername('');
        setPassword('');
        setConfirmPassword('');
    };

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background: 'linear-gradient(135deg, #1a1f3a 0%, #2d1b4e 100%)',
                p: 2,
            }}
        >
            <Card
                sx={{
                    maxWidth: 450,
                    width: '100%',
                    background: 'rgba(20, 24, 41, 0.95)',
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.4)',
                }}
            >
                <CardContent sx={{ p: 4 }}>
                    {/* Header */}
                    <Box sx={{ textAlign: 'center', mb: 4 }}>
                        <Typography
                            variant="h3"
                            sx={{
                                fontWeight: 700,
                                background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                mb: 1,
                            }}
                        >
                            Tracker
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Your all-in-one productivity companion
                        </Typography>
                    </Box>

                    {/* Tabs */}
                    <Tabs
                        value={mode}
                        onChange={handleModeChange}
                        centered
                        sx={{
                            mb: 3,
                            '& .MuiTab-root': {
                                textTransform: 'none',
                                fontSize: '1rem',
                                fontWeight: 600,
                            },
                        }}
                    >
                        <Tab label="Login" value="login" />
                        <Tab label="Register" value="register" />
                    </Tabs>

                    {/* Form */}
                    <form onSubmit={handleSubmit}>
                        <Stack spacing={3}>
                            <TextField
                                label="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                fullWidth
                                required
                                autoFocus
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person />
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            <TextField
                                label="Password"
                                type={showPassword ? 'text' : 'password'}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                fullWidth
                                required
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Lock />
                                        </InputAdornment>
                                    ),
                                    endAdornment: (
                                        <InputAdornment position="end">
                                            <IconButton
                                                onClick={() => setShowPassword(!showPassword)}
                                                edge="end"
                                            >
                                                {showPassword ? <VisibilityOff /> : <Visibility />}
                                            </IconButton>
                                        </InputAdornment>
                                    ),
                                }}
                            />

                            {mode === 'register' && (
                                <TextField
                                    label="Confirm Password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    fullWidth
                                    required
                                    InputProps={{
                                        startAdornment: (
                                            <InputAdornment position="start">
                                                <Lock />
                                            </InputAdornment>
                                        ),
                                    }}
                                />
                            )}

                            <Button
                                type="submit"
                                variant="contained"
                                size="large"
                                fullWidth
                                startIcon={mode === 'login' ? <LoginIcon /> : <RegisterIcon />}
                                sx={{
                                    py: 1.5,
                                    background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)',
                                    '&:hover': {
                                        background: 'linear-gradient(135deg, #5558e3 0%, #db2777 100%)',
                                    },
                                }}
                            >
                                {mode === 'login' ? 'Login' : 'Create Account'}
                            </Button>
                        </Stack>
                    </form>

                    {/* Footer */}
                    <Box sx={{ mt: 3, textAlign: 'center' }}>
                        <Typography variant="caption" color="text.secondary">
                            {mode === 'login' ? (
                                <>
                                    Don't have an account?{' '}
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
                                        onClick={() => setMode('register')}
                                    >
                                        Register here
                                    </Typography>
                                </>
                            ) : (
                                <>
                                    Already have an account?{' '}
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        sx={{ color: 'primary.main', cursor: 'pointer', fontWeight: 600 }}
                                        onClick={() => setMode('login')}
                                    >
                                        Login here
                                    </Typography>
                                </>
                            )}
                        </Typography>
                    </Box>

                    {/* Security Notice */}
                    <Box
                        sx={{
                            mt: 3,
                            p: 2,
                            borderRadius: 2,
                            background: 'rgba(245, 158, 11, 0.1)',
                            border: '1px solid rgba(245, 158, 11, 0.3)',
                        }}
                    >
                        <Typography variant="caption" color="warning.main">
                            ⚠️ Demo Mode: Data is stored locally in your browser. For production use, implement proper backend authentication.
                        </Typography>
                    </Box>
                </CardContent>
            </Card>
        </Box>
    );
};

export default Login;
