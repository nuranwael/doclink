const express = require('express');
const Booking = require('../models/Booking');
const Availability = require('../models/Availability');
const router = express.Router();

// Create booking
router.post('/', async (req, res) => {
  const { doctorId, patientId, date, time } = req.body;

  if (!doctorId || !patientId || !date || !time) {
    return res.status(400).json({ error: 'Missing booking details.' });
  }

  try {
   
    const existingBooking = await Booking.findOne({ doctorId, date, time });
    if (existingBooking) {
      return res.status(409).json({ error: 'This time slot is already booked.' });
    }

    
    const booking = new Booking({ doctorId, patientId, date, time });
    await booking.save();

   
    await Availability.updateOne(
      { doctorId, date },
      { $pull: { timeSlots: time } }
    );

    res.status(201).json({ message: 'Booking created successfully', booking });
  } catch (err) {
    console.error('❌ Booking error:', err);
    res.status(500).json({ error: 'Could not create booking' });
  }
});

// display bookings for a doctor
router.get('/doctor/:doctorId', async (req, res) => {
  try {
    const bookings = await Booking.find({ doctorId: req.params.doctorId })
      .populate('patientId', 'fullname email');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

// Display bookings for a patient
router.get('/patient/:patientId', async (req, res) => {
  try {
    const bookings = await Booking.find({ patientId: req.params.patientId })
      .populate('doctorId', 'fullname email');
    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to load bookings' });
  }
});

module.exports = router;
