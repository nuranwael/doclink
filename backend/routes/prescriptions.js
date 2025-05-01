// routes/prescriptions.js
const express = require('express');
const router = express.Router();
const Prescription = require('../models/Prescription');

router.post('/', async (req, res) => {
  const { doctorId, patientId, medication, interval, totalPills } = req.body;

  try {
    const prescription = new Prescription({ doctorId, patientId, medication, interval, totalPills });
    await prescription.save();
    res.status(201).json({ message: "Prescription created", prescription });
  } catch (err) {
    console.error("❌ Prescription error:", err);
    res.status(500).json({ error: 'Failed to create prescription' });
  }
});

// routes/prescriptions.js
router.get('/patient/:patientId', async (req, res) => {
    try {
      const prescriptions = await Prescription.find({ patientId: req.params.patientId }).populate('doctorId', 'fullname');
      res.json(prescriptions);
    } catch (err) {
      res.status(500).json({ error: 'Server error' });
    }
  });
  

module.exports = router;
