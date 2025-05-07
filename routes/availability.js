const express = require('express');
const router = express.Router();
const Availability = require('../models/Availability');


// Create or update availability for a doctor
router.post('/', async (req, res) => {
  const { doctorId, date, timeSlots } = req.body;


  try {
    let availability = await Availability.findOne({ doctorId, date });

    if (availability) {
      availability.timeSlots = timeSlots;
    } else {
      availability = new Availability({ doctorId, date, timeSlots });
    }

    await availability.save();
    res.json({ message: 'Availability saved', availability });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error saving availability' });
  }
});



// Get availability by doctor ID
router.get('/:doctorId', async (req, res) => {
  try {
    const availabilities = await Availability.find({ doctorId: req.params.doctorId });
    res.json(availabilities);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error fetching availability' });
  }
});

module.exports = router;
