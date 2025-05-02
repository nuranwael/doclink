const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, // "2025-04-18"
  timeSlots: [String] // ["10:00", "12:00", "15:00"]
});

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;
