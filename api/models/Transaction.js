import mongoose from 'mongoose';

const TransactionSchema = new mongoose.Schema({
    id: { type: String, required: true, unique: true },
    amount: { type: Number, required: true },
    category: { type: String, required: true },
    date: { type: String, required: true },
    type: { type: String, enum: ['income', 'expense'], required: true },
    description: { type: String },
    createdAt: { type: Number, default: Date.now }
});

export default mongoose.model('Transaction', TransactionSchema);
