import { useState } from 'react';
import { usePlanner } from '../context/PlannerContext';
import {
    Box,
    Grid,
    Card,
    CardContent,
    Typography,
    IconButton,
    Chip,
    Stack,
    Paper,
    Tooltip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    TextField,
    MenuItem,
} from '@mui/material';
import {
    Add as AddIcon,
    Delete as DeleteIcon,
} from '@mui/icons-material';

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
const HOURS = Array.from({ length: 15 }, (_, i) => i + 7); // 7 AM to 9 PM

const ACTIVITY_COLORS: Record<string, string> = {
    Work: '#6366f1',
    Personal: '#ec4899',
    Study: '#f59e0b',
    Fitness: '#10b981',
};

const Planner = () => {
    const { blocks, addBlock, deleteBlock } = usePlanner();
    const [openDialog, setOpenDialog] = useState(false);
    const [selectedDay, setSelectedDay] = useState('');
    const [selectedHour, setSelectedHour] = useState(0);
    const [formData, setFormData] = useState({
        title: '',
        category: 'Work' as 'Work' | 'Personal' | 'Study' | 'Fitness',
        duration: 1,
    });

    const handleOpenDialog = (day: string, hour: number) => {
        setSelectedDay(day);
        setSelectedHour(hour);
        setOpenDialog(true);
    };

    const handleAddBlock = () => {
        if (formData.title.trim()) {
            addBlock({
                day: selectedDay,
                startHour: selectedHour,
                duration: formData.duration,
                title: formData.title,
                category: formData.category,
            });
            setOpenDialog(false);
            setFormData({ title: '', category: 'Work', duration: 1 });
        }
    };

    const getBlocksForSlot = (day: string, hour: number) => {
        return blocks.filter(
            block =>
                block.day === day &&
                hour >= block.startHour &&
                hour < block.startHour + block.duration
        );
    };

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            {/* Header */}
            <Box sx={{ mb: 4 }}>
                <Typography variant="h3" sx={{
                    fontWeight: 700,
                    background: 'linear-gradient(135deg, #6366f1 0%, #10b981 100%)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    mb: 1
                }}>
                    Weekly Planner
                </Typography>
                <Typography variant="body1" color="text.secondary">
                    Plan your week with time blocks
                </Typography>
            </Box>

            {/* Legend */}
            <Paper sx={{ p: 2, mb: 3 }}>
                <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap>
                    <Typography variant="body2" color="text.secondary" sx={{ mr: 1 }}>
                        Categories:
                    </Typography>
                    {Object.entries(ACTIVITY_COLORS).map(([category, color]) => (
                        <Chip
                            key={category}
                            label={category}
                            size="small"
                            sx={{
                                bgcolor: color,
                                color: 'white',
                                fontWeight: 600,
                            }}
                        />
                    ))}
                </Stack>
            </Paper>

            {/* Time Grid */}
            <Paper sx={{ p: 2, overflow: 'auto' }}>
                <Box sx={{ minWidth: 900 }}>
                    {/* Header Row - Days */}
                    <Grid container spacing={1}>
                        <Grid sx={{ width: 80 }}>
                            <Box sx={{ height: 40 }} /> {/* Empty corner */}
                        </Grid>
                        {DAYS.map(day => (
                            <Grid key={day} sx={{ flex: 1 }}>
                                <Paper sx={{ p: 1, textAlign: 'center', bgcolor: 'primary.main' }}>
                                    <Typography variant="body2" sx={{ fontWeight: 600, color: 'white' }}>
                                        {day.slice(0, 3)}
                                    </Typography>
                                </Paper>
                            </Grid>
                        ))}
                    </Grid>

                    {/* Time Slots */}
                    {HOURS.map(hour => (
                        <Grid container spacing={1} key={hour} sx={{ mt: 0.5 }}>
                            {/* Time Label */}
                            <Grid sx={{ width: 80 }}>
                                <Paper sx={{ p: 1, textAlign: 'center', height: 60 }}>
                                    <Typography variant="caption" color="text.secondary">
                                        {hour}:00
                                    </Typography>
                                </Paper>
                            </Grid>

                            {/* Day Slots */}
                            {DAYS.map(day => {
                                const blocksInSlot = getBlocksForSlot(day, hour);
                                const block = blocksInSlot.length > 0 ? blocksInSlot[0] : null;
                                const isFirstSlot = block && hour === block.startHour;

                                return (
                                    <Grid key={`${day}-${hour}`} sx={{ flex: 1 }}>
                                        {block ? (
                                            isFirstSlot ? (
                                                <Card
                                                    sx={{
                                                        height: block.duration * 66 - 4,
                                                        bgcolor: ACTIVITY_COLORS[block.category],
                                                        border: '2px solid',
                                                        borderColor: 'divider',
                                                        position: 'relative',
                                                    }}
                                                >
                                                    <CardContent sx={{ p: 1, height: '100%', position: 'relative' }}>
                                                        <Typography
                                                            variant="body2"
                                                            sx={{
                                                                fontWeight: 600,
                                                                color: 'white',
                                                                mb: 0.5,
                                                                overflow: 'hidden',
                                                                textOverflow: 'ellipsis',
                                                            }}
                                                        >
                                                            {block.title}
                                                        </Typography>
                                                        <Chip
                                                            label={`${block.duration}h`}
                                                            size="small"
                                                            sx={{
                                                                bgcolor: 'rgba(255,255,255,0.2)',
                                                                color: 'white',
                                                                height: 20,
                                                                fontSize: '0.7rem',
                                                            }}
                                                        />
                                                        <Tooltip title="Delete block">
                                                            <IconButton
                                                                onClick={() => deleteBlock(block.id)}
                                                                size="small"
                                                                sx={{
                                                                    position: 'absolute',
                                                                    top: 4,
                                                                    right: 4,
                                                                    color: 'white',
                                                                    bgcolor: 'rgba(0,0,0,0.2)',
                                                                    '&:hover': {
                                                                        bgcolor: 'rgba(0,0,0,0.4)',
                                                                    },
                                                                }}
                                                            >
                                                                <DeleteIcon fontSize="small" />
                                                            </IconButton>
                                                        </Tooltip>
                                                    </CardContent>
                                                </Card>
                                            ) : null
                                        ) : (
                                            <Paper
                                                onClick={() => handleOpenDialog(day, hour)}
                                                sx={{
                                                    height: 60,
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    cursor: 'pointer',
                                                    bgcolor: 'background.default',
                                                    border: '1px dashed',
                                                    borderColor: 'divider',
                                                    transition: 'all 0.3s',
                                                    '&:hover': {
                                                        bgcolor: 'action.hover',
                                                        borderColor: 'primary.main',
                                                    },
                                                }}
                                            >
                                                <AddIcon sx={{ color: 'text.secondary', fontSize: 20 }} />
                                            </Paper>
                                        )}
                                    </Grid>
                                );
                            })}
                        </Grid>
                    ))}
                </Box>
            </Paper>

            {/* Add Block Dialog */}
            <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Add Time Block
                    <Typography variant="body2" color="text.secondary">
                        {selectedDay} at {selectedHour}:00
                    </Typography>
                </DialogTitle>
                <DialogContent>
                    <Stack spacing={2} sx={{ mt: 1 }}>
                        <TextField
                            label="Activity Title"
                            fullWidth
                            value={formData.title}
                            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                            autoFocus
                        />
                        <TextField
                            label="Category"
                            select
                            fullWidth
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value as any })}
                        >
                            {Object.keys(ACTIVITY_COLORS).map(category => (
                                <MenuItem key={category} value={category}>
                                    {category}
                                </MenuItem>
                            ))}
                        </TextField>
                        <TextField
                            label="Duration (hours)"
                            type="number"
                            fullWidth
                            value={formData.duration}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 1 })}
                            inputProps={{ min: 1, max: 8 }}
                        />
                    </Stack>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
                    <Button onClick={handleAddBlock} variant="contained">Add Block</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Planner;
