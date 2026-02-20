const express = require('express');
const router = express.Router();
const Waitlist = require('./models/Waitlist');

// GET /api/waitlist
router.get('/', async (req, res) => {
  try {
    const waitlist = await Waitlist.find();
    res.json(waitlist);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/waitlist
router.post('/', async (req, res) => {
  try {
    const waitlistEntry = new Waitlist(req.body);
    await waitlistEntry.save();
    res.status(201).json(waitlistEntry);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;