const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // "2025-04-19"
  time: { type: String, required: true }, // "11:00"
  createdAt: { type: Date, default: Date.now },
  status: { type: String, enum: ['pending', 'confirmed', 'cancelled', 'reviewed'], default: 'pending' }
});

const Booking = mongoose.model('Booking', bookingSchema);
module.exports = Booking;
