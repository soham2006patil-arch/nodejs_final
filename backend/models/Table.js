import mongoose from 'mongoose';

const tableSchema = new mongoose.Schema({
  tableNumber: { type: Number, required: true, unique: true, min: 1 },
  capacity: { type: Number, required: true, min: 1 },
  location: { type: String, required: true, trim: true },
  isAvailable: { type: Boolean, default: true }
}, { timestamps: true });

export default mongoose.model('Table', tableSchema);
