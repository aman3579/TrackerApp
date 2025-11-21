import { useState } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
    Box,
    Drawer,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemButton,
    ListItemIcon,
    ListItemText,
    IconButton,
    Typography,
    Avatar,
    Divider,
    useMediaQuery,
    useTheme,
    Stack,
} from '@mui/material';
import {
    Menu as MenuIcon,
    Home as HomeIcon,
    CheckCircle as TasksIcon,
    LocalFireDepartment as HabitsIcon,
    CalendarMonth as PlannerIcon,
    AccountBalanceWallet as FinanceIcon,
    GridView as ComboIcon,
    BarChart as AnalyticsIcon,
    Settings as SettingsIcon,
} from '@mui/icons-material';

const drawerWidth = 260;

const navItems = [
    { label: 'Home', path: '/', icon: HomeIcon },
    { label: 'Tasks', path: '/tasks', icon: TasksIcon },
    { label: 'Habits', path: '/habits', icon: HabitsIcon },
    { label: 'Planner', path: '/planner', icon: PlannerIcon },
    { label: 'Finance', path: '/finance', icon: FinanceIcon },
    { label: 'Combo', path: '/combo', icon: ComboIcon },
    { label: 'Analytics', path: '/analytics', icon: AnalyticsIcon },
    { label: 'Settings', path: '/settings', icon: SettingsIcon },
];

const Layout = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));
    const [mobileOpen, setMobileOpen] = useState(false);

    const userName = localStorage.getItem('tracker_username') || 'User';

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const handleNavigation = (path: string) => {
        navigate(path);
        if (isMobile) {
            setMobileOpen(false);
        }
    };

    const drawer = (
        <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            {/* Logo/Brand */}
            <Box sx={{ p: 3, background: 'linear-gradient(135deg, #6366f1 0%, #ec4899 100%)' }}>
                <Stack direction="row" spacing={2} alignItems="center">
                    <Avatar sx={{ bgcolor: 'rgba(255,255,255,0.2)', width: 48, height: 48 }}>
                        {userName.charAt(0).toUpperCase()}
                    </Avatar>
                    <Box>
                        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700 }}>
                            Tracker
                        </Typography>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                            Welcome, {userName}
                        </Typography>
                    </Box>
                </Stack>
            </Box>

            <Divider />

            {/* Navigation List */}
            <List sx={{ flex: 1, px: 1, pt: 2 }}>
                {navItems.map((item) => {
                    const Icon = item.icon;
                    const isActive = location.pathname === item.path;

                    return (
                        <ListItem key={item.path} disablePadding sx={{ mb: 0.5 }}>
                            <ListItemButton
                                onClick={() => handleNavigation(item.path)}
                                sx={{
                                    borderRadius: 2,
                                    py: 1.5,
                                    backgroundColor: isActive ? 'primary.main' : 'transparent',
                                    color: isActive ? 'white' : 'text.primary',
                                    '&:hover': {
                                        backgroundColor: isActive ? 'primary.dark' : 'action.hover',
                                    },
                                    transition: 'all 0.3s',
                                }}
                            >
                                <ListItemIcon sx={{ color: isActive ? 'white' : 'text.secondary', minWidth: 40 }}>
                                    <Icon />
                                </ListItemIcon>
                                <ListItemText
                                    primary={item.label}
                                    primaryTypographyProps={{
                                        fontWeight: isActive ? 600 : 400,
                                    }}
                                />
                            </ListItemButton>
                        </ListItem>
                    );
                })}
            </List>

            <Divider />

            {/* Footer */}
            <Box sx={{ p: 2 }}>
                <Typography variant="caption" color="text.secondary" align="center" display="block">
                    © 2024 Tracker App
                </Typography>
            </Box>
        </Box>
    );

    return (
        <Box sx={{ display: 'flex', minHeight: '100vh' }}>
            {/* App Bar for Mobile */}
            {isMobile && (
                <AppBar
                    position="fixed"
                    sx={{
                        background: 'rgba(20, 24, 41, 0.95)',
                        backdropFilter: 'blur(20px)',
                        borderBottom: '1px solid rgba(255, 255, 255, 0.1)',
                    }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            edge="start"
                            onClick={handleDrawerToggle}
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 700 }}>
                            Tracker
                        </Typography>
                    </Toolbar>
                </AppBar>
            )}

            {/* Drawer - Permanent on desktop, temporary on mobile */}
            <Box
                component="nav"
                sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
            >
                {isMobile ? (
                    <Drawer
                        variant="temporary"
                        open={mobileOpen}
                        onClose={handleDrawerToggle}
                        ModalProps={{ keepMounted: true }}
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                background: 'rgba(20, 24, 41, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                        }}
                    >
                        {drawer}
                    </Drawer>
                ) : (
                    <Drawer
                        variant="permanent"
                        sx={{
                            '& .MuiDrawer-paper': {
                                width: drawerWidth,
                                boxSizing: 'border-box',
                                background: 'rgba(20, 24, 41, 0.95)',
                                backdropFilter: 'blur(20px)',
                                borderRight: '1px solid rgba(255, 255, 255, 0.1)',
                            },
                        }}
                        open
                    >
                        {drawer}
                    </Drawer>
                )}
            </Box>

            {/* Main Content */}
            <Box
                component="main"
                sx={{
                    flexGrow: 1,
                    width: { md: `calc(100% - ${drawerWidth}px)` },
                    minHeight: '100vh',
                    pt: { xs: 8, md: 0 },
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={location.pathname}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        transition={{ duration: 0.3 }}
                    >
                        <Outlet />
                    </motion.div>
                </AnimatePresence>
            </Box>
        </Box>
    );
};

export default Layout;
