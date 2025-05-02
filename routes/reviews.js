// In routes/reviews.js
const mongoose = require('mongoose');
const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const Booking = require('../models/Booking');


// POST - Submit a review (protected route)
router.post('/', async (req, res) => { 
  const { bookingId, attitude, cleanliness, experience } = req.body;

  if (![attitude, cleanliness, experience].every(rating => rating >= 1 && rating <= 5)) {
    return res.status(400).json({ error: 'Ratings must be between 1 and 5.' });
  }

  try {
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ error: 'Booking not found.' });
    }

    

    const review = new Review({
      bookingId,
      doctorId: booking.doctorId,
      patientId: booking.patientId,
      attitude,
      cleanliness,
      experience,
    });

    await review.save();

    // Optionally, update the booking status to 'reviewed'
    booking.status = 'reviewed';
    await booking.save();

    res.status(201).json({ message: 'Review submitted successfully', review });
  } catch (err) {
    console.error('❌ Error submitting review:', err);
    res.status(500).json({ error: 'Failed to submit review' });
  }
});
router.get('/doctor/:doctorId', async (req, res) => {
  const doctorId = req.params.doctorId;

  if (!mongoose.Types.ObjectId.isValid(doctorId)) {
    return res.status(400).json({ error: 'Invalid doctor ID.' });
  }

  try {
    const reviews = await Review.find({ doctorId }).populate('patientId', 'fullname');
    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews.' });
  }
});


module.exports = router;
