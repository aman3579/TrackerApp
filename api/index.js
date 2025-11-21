import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

// Connect to MongoDB
const connectDB = async () => {
    if (mongoose.connections[0].readyState) return;
    try {
        await mongoose.connect(process.env.MONGODB_URI);
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
    }
};

connectDB();

// Models
import Task from './models/Task.js';
import Transaction from './models/Transaction.js';
import TimeBlock from './models/TimeBlock.js';
import Habit from './models/Habit.js';

// Helper to get userId from headers or generate one
const getUserId = (req) => {
    return req.headers['x-user-id'] || 'default-user';
};

// Root route
app.get('/', (req, res) => {
    res.json({ message: 'Tracker API is running', version: '2.0' });
});

// ==================== TASK ENDPOINTS ====================

app.get('/api/tasks', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const tasks = await Task.find({ userId });
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const taskData = { ...req.body, userId };
        const task = new Task(taskData);
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/tasks/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const task = await Task.findOneAndUpdate(
            { id: req.params.id, userId },
            req.body,
            { new: true }
        );
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json(task);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/tasks/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const task = await Task.findOneAndDelete({ id: req.params.id, userId });
        if (!task) return res.status(404).json({ error: 'Task not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== HABIT ENDPOINTS ====================

app.get('/api/habits', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const habits = await Habit.find({ userId });
        res.json(habits);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/habits', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const habitData = { ...req.body, userId };
        const habit = new Habit(habitData);
        await habit.save();
        res.status(201).json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.put('/api/habits/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const habit = await Habit.findOneAndUpdate(
            { id: req.params.id, userId },
            req.body,
            { new: true }
        );
        if (!habit) return res.status(404).json({ error: 'Habit not found' });
        res.json(habit);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/habits/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const habit = await Habit.findOneAndDelete({ id: req.params.id, userId });
        if (!habit) return res.status(404).json({ error: 'Habit not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== FINANCE ENDPOINTS ====================

app.get('/api/finance', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const transactions = await Transaction.find({ userId });
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/finance', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const transactionData = { ...req.body, userId };
        const transaction = new Transaction(transactionData);
        await transaction.save();
        res.status(201).json(transaction);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/finance/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const transaction = await Transaction.findOneAndDelete({ id: req.params.id, userId });
        if (!transaction) return res.status(404).json({ error: 'Transaction not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// ==================== PLANNER ENDPOINTS ====================

app.get('/api/planner', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const blocks = await TimeBlock.find({ userId });
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/planner', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const blockData = { ...req.body, userId };
        const block = new TimeBlock(blockData);
        await block.save();
        res.status(201).json(block);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.delete('/api/planner/:id', async (req, res) => {
    await connectDB();
    try {
        const userId = getUserId(req);
        const block = await TimeBlock.findOneAndDelete({ id: req.params.id, userId });
        if (!block) return res.status(404).json({ error: 'Time block not found' });
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Start server if running locally
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
