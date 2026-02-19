const express = require('express');
const router = express.Router();
const Resource = require('./models/Resource');

// GET /api/resources
router.get('/', async (req, res) => {
  try {
    const resources = await Resource.find().lean();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST /api/resources
router.post('/', async (req, res) => {
  try {
    const resource = new Resource(req.body);
    await resource.save();
    res.status(201).json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;