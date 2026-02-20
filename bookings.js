const express = require('express');
const router = express.Router();
const Booking = require('./models/Booking');

// GET all
router.get('/', async (req, res) => {
  try {
    const bookings = await Booking.find();
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET by studentId
router.get('/:studentId', async (req, res) => {
  try {
    const bookings = await Booking.find({ studentId: req.params.studentId });
    res.json(bookings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST create
router.post('/', async (req, res) => {
  try {
    const booking = new Booking(req.body);
    await booking.save();
    res.status(201).json(booking);
  } catch (error) {
    res.status(400).json({ message: error.message }); // 400 is better for validation errors
  }
});

module.exports = router;