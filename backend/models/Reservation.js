import mongoose from 'mongoose';

const reservationSchema = new mongoose.Schema({
  customer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  table: { type: mongoose.Schema.Types.ObjectId, ref: 'Table', required: true },
  reservationDate: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  partySize: { type: Number, required: true, min: 1 },
  status: { type: String, enum: ['confirmed', 'cancelled'], default: 'confirmed' }
}, { timestamps: true });

reservationSchema.index({ table: 1, reservationDate: 1, startTime: 1 });
export default mongoose.model('Reservation', reservationSchema);
