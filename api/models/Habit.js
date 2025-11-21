import mongoose from 'mongoose';

const HabitSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    frequency: { type: [String], required: true },
    completedDates: { type: [String], default: [] },
    streak: { type: Number, default: 0 },
    createdAt: { type: Number, default: Date.now }
});

export default mongoose.model('Habit', HabitSchema);
