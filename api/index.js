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

// Routes

// Tasks
app.get('/api/tasks', async (req, res) => {
    await connectDB();
    try {
        const tasks = await Task.find();
        res.json(tasks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/tasks', async (req, res) => {
    await connectDB();
    try {
        // The frontend sends the entire array, but for MongoDB we should ideally sync changes.
        // For simplicity to match previous behavior: Delete all and insert all (inefficient but works for small data)
        // OR better: The frontend should ideally send individual create/update/delete actions.
        // BUT, the current frontend sends the WHOLE state.
        // So we will replace the collection content.

        await Task.deleteMany({});
        await Task.insertMany(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Finance
app.get('/api/finance', async (req, res) => {
    await connectDB();
    try {
        const transactions = await Transaction.find();
        res.json(transactions);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/finance', async (req, res) => {
    await connectDB();
    try {
        await Transaction.deleteMany({});
        await Transaction.insertMany(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Planner
app.get('/api/planner', async (req, res) => {
    await connectDB();
    try {
        const blocks = await TimeBlock.find();
        res.json(blocks);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

app.post('/api/planner', async (req, res) => {
    await connectDB();
    try {
        await TimeBlock.deleteMany({});
        await TimeBlock.insertMany(req.body);
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Root route for testing
app.get('/', (req, res) => {
    res.send('Tracker API is running');
});

// Start server if running directly
// In ES modules, require.main === module is not available. 
// We can check if the file is being run directly by comparing import.meta.url
// However, for simplicity in this setup, we'll just listen if not imported (Vercel imports it).
// But Vercel expects the app to be exported.
// A common pattern for Vercel + Local:
if (process.env.NODE_ENV !== 'production') {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}

export default app;
