
const mongoose = require('mongoose');

const prescriptionSchema = new mongoose.Schema({
  doctorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  patientId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  medication: { type: String, required: true },
  interval: { type: Number, required: true },
  totalPills: { type: Number, required: true },
  startTime: { type: Date, default: Date.now },
  taken: [{ type: Date }]
});

module.exports = mongoose.model('Prescription', prescriptionSchema);
