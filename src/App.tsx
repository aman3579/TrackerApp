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
import StudyHacks from './pages/StudyHacks';
import ExerciseTracker from './pages/ExerciseTracker';
import Wellness from './pages/Wellness';
import MoodJournal from './pages/MoodJournal';
import Goals from './pages/Goals';
import Login from './pages/Login';
import Layout from './components/layout/Layout';
import { AuthProvider, useAuth } from './context/AuthContext';
import { TaskProvider } from './context/TaskContext';
import { HabitProvider } from './context/HabitContext';
import { PlannerProvider } from './context/PlannerContext';
import { FinanceProvider } from './context/FinanceContext';
import { StudyProvider } from './context/StudyContext';
import { ExerciseProvider } from './context/ExerciseContext';
import { WellnessProvider } from './context/WellnessContext';
import { MoodProvider } from './context/MoodContext';
import { GoalProvider } from './context/GoalContext';
import './styles/index.css';

// Protected Route Component
const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" replace />;
};

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
  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <AuthProvider>
        <TaskProvider>
          <HabitProvider>
            <FinanceProvider>
              <PlannerProvider>
                <StudyProvider>
                  <ExerciseProvider>
                    <WellnessProvider>
                      <MoodProvider>
                        <GoalProvider>
                          <Router>
                            <Routes>
                              {/* Public Route */}
                              <Route path="/login" element={<Login />} />

                              {/* Protected Routes */}
                              <Route path="/" element={
                                <ProtectedRoute>
                                  <Layout />
                                </ProtectedRoute>
                              }>
                                <Route index element={<Dashboard />} />
                                <Route path="tasks" element={<TaskTracker />} />
                                <Route path="habits" element={<HabitTracker />} />
                                <Route path="planner" element={<Planner />} />
                                <Route path="finance" element={<FinanceTracker />} />
                                <Route path="study" element={<StudyHacks />} />
                                <Route path="exercise" element={<ExerciseTracker />} />
                                <Route path="wellness" element={<Wellness />} />
                                <Route path="mood" element={<MoodJournal />} />
                                <Route path="goals" element={<Goals />} />
                                <Route path="combo" element={<ComboMode />} />
                                <Route path="analytics" element={<Analytics />} />
                                <Route path="settings" element={<Settings />} />
                              </Route>

                              {/* Catch all */}
                              <Route path="*" element={<Navigate to="/login" replace />} />
                            </Routes>
                          </Router>
                        </GoalProvider>
                      </MoodProvider>
                    </WellnessProvider>
                  </ExerciseProvider>
                </StudyProvider>
              </PlannerProvider>
            </FinanceProvider>
          </HabitProvider>
        </TaskProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
