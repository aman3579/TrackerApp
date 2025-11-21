import mongoose from 'mongoose';

const TimeBlockSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    userId: { type: String, required: true, index: true },
    title: { type: String, required: true },
    day: { type: String, required: true },
    startHour: { type: Number, required: true },
    duration: { type: Number, required: true },
    category: { type: String, enum: ['Work', 'Personal', 'Study', 'Fitness'], required: true }
});

export default mongoose.model('TimeBlock', TimeBlockSchema);
