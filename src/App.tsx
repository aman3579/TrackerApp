import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, createTheme, CssBaseline } from '@mui/material';
import Dashboard from './pages/Dashboard';
import TaskTracker from './pages/TaskTracker';
import HabitTracker from './pages/HabitTracker';
import Planner from './pages/Planner';
import FinanceTracker from './pages/FinanceTracker';
import ComboMode from './pages/ComboMode';
import Analytics from './pages/Analytics';
import Settings from './pages/Settings';
import Onboarding from './pages/Onboarding';
import Layout from './components/layout/Layout';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import { PlannerProvider } from './context/PlannerContext';
import { FinanceProvider } from './context/FinanceContext';
import './styles/index.css';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#6366f1',
    },
    secondary: {
      main: '#ec4899',
    },
    success: {
      main: '#10b981',
    },
    warning: {
      main: '#f59e0b',
    },
    error: {
      main: '#ef4444',
    },
    background: {
      default: '#0a0e1a',
      paper: 'rgba(20, 24, 41, 0.7)',
    },
    text: {
      primary: '#f8fafc',
      secondary: '#94a3b8',
    },
  },
  typography: {
    fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
    h1: {
      fontWeight: 700,
    },
    h2: {
      fontWeight: 700,
    },
    h3: {
      fontWeight: 700,
    },
    h4: {
      fontWeight: 600,
    },
    h5: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 12,
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          backdropFilter: 'blur(20px)',
          backgroundImage: 'none',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
  },
});

function App() {
  const [isOnboarded, setIsOnboarded] = useState(() => localStorage.getItem('tracker_onboarded') === 'true');

  const handleOnboardingComplete = () => {
    setIsOnboarded(true);
  };

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <TaskProvider>
        <HabitProvider>
          <FinanceProvider>
            <PlannerProvider>
              <Router>
                {!isOnboarded ? (
                  <Routes>
                    <Route path="/" element={<Onboarding onComplete={handleOnboardingComplete} />} />
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                ) : (
                  <Routes>
                    <Route path="/" element={<Layout />}>
                      <Route index element={<Dashboard />} />
                      <Route path="tasks" element={<TaskTracker />} />
                      <Route path="habits" element={<HabitTracker />} />
                      <Route path="planner" element={<Planner />} />
                      <Route path="finance" element={<FinanceTracker />} />
                      <Route path="combo" element={<ComboMode />} />
                      <Route path="analytics" element={<Analytics />} />
                      <Route path="settings" element={<Settings />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                  </Routes>
                )}
              </Router>
            </PlannerProvider>
          </FinanceProvider>
        </HabitProvider>
      </TaskProvider>
    </ThemeProvider>
  );
}

export default App;
