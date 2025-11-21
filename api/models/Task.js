import mongoose from 'mongoose';

const TaskSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    completed: { type: Boolean, default: false },
    dueDate: { type: String },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'medium' },
    createdAt: { type: Number, default: Date.now }
});

export default mongoose.model('Task', TaskSchema);
