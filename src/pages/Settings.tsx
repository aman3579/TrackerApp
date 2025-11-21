import { useState } from 'react';
import {
    Box,
    Typography,
    Paper,
    Button,
    Stack,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Alert,
    Card,
    CardContent,
} from '@mui/material';
import {
    Download as DownloadIcon,
    Delete as DeleteIcon,
    Info as InfoIcon,
} from '@mui/icons-material';

const Settings = () => {
    const [openClearDialog, setOpenClearDialog] = useState(false);

    const handleExportData = () => {
        const data = {
            tasks: JSON.parse(localStorage.getItem('tracker_tasks') || '[]'),
            habits: JSON.parse(localStorage.getItem('tracker_habits') || '[]'),
            planner: JSON.parse(localStorage.getItem('tracker_planner') || '[]'),
            finance: JSON.parse(localStorage.getItem('tracker_finance') || '[]'),
            username: localStorage.getItem('tracker_username'),
        };

        const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `tracker-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
    };

    const handleClearData = () => {
        localStorage.clear();
        window.location.href = '/';
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Settings
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Manage your app preferences
                </Typography>
            </Box>

            <Stack spacing={3} sx={{ maxWidth: 800 }}>
                {/* Data Management */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        Data Management
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={2}>
                        {/* Export Data */}
                        <Card variant="outlined">
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <DownloadIcon sx={{ fontSize: 40, color: 'primary.main' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                                            Export Data
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Download all your data as a JSON file
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="contained"
                                        startIcon={<DownloadIcon />}
                                        onClick={handleExportData}
                                    >
                                        Export
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>

                        {/* Clear Data */}
                        <Card variant="outlined" sx={{ borderColor: 'error.main' }}>
                            <CardContent>
                                <Stack direction="row" alignItems="center" spacing={2}>
                                    <DeleteIcon sx={{ fontSize: 40, color: 'error.main' }} />
                                    <Box sx={{ flex: 1 }}>
                                        <Typography variant="h6" sx={{ fontWeight: 600, color: 'error.main' }}>
                                            Clear All Data
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Permanently delete all your data and reset the app
                                        </Typography>
                                    </Box>
                                    <Button
                                        variant="outlined"
                                        color="error"
                                        startIcon={<DeleteIcon />}
                                        onClick={() => setOpenClearDialog(true)}
                                    >
                                        Clear
                                    </Button>
                                </Stack>
                            </CardContent>
                        </Card>
                    </Stack>
                </Paper>

                {/* App Info */}
                <Paper sx={{ p: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                        App Information
                    </Typography>
                    <Divider sx={{ mb: 3 }} />

                    <Stack spacing={2}>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Version</Typography>
                            <Typography sx={{ fontWeight: 600 }}>1.0.0</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Last Updated</Typography>
                            <Typography sx={{ fontWeight: 600 }}>November 2024</Typography>
                        </Stack>
                        <Stack direction="row" justifyContent="space-between">
                            <Typography color="text.secondary">Framework</Typography>
                            <Typography sx={{ fontWeight: 600 }}>React + Material UI</Typography>
                        </Stack>
                    </Stack>

                    <Alert icon={<InfoIcon />} severity="info" sx={{ mt: 3 }}>
                        All your data is stored locally on your device. Nothing is sent to external servers.
                    </Alert>
                </Paper>
            </Stack>

            {/* Clear Data Confirmation Dialog */}
            <Dialog
                open={openClearDialog}
                onClose={() => setOpenClearDialog(false)}
            >
                <DialogTitle>Clear All Data?</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        This will permanently delete all your tasks, habits, planner entries, and finance data.
                        This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenClearDialog(false)}>
                        Cancel
                    </Button>
                    <Button onClick={handleClearData} color="error" variant="contained" autoFocus>
                        Clear All Data
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Settings;
