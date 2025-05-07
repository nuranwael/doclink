const mongoose = require('mongoose');

const availabilitySchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  date: { type: String, required: true }, 
  timeSlots: [String]
});

const Availability = mongoose.model('Availability', availabilitySchema);
module.exports = Availability;
