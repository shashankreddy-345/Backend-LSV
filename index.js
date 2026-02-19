const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectDB = require('./db');

const app = express();

app.use(cors());
app.use(express.json());

// Optional: reduce “buffering timed out” on slow cold starts
mongoose.set("bufferTimeoutMS", 30000);

const Resource = require('./models/Resource');
const User = require('./models/User');

// ✅ Always ensure DB is connected inside routes (serverless-safe)
app.get('/api/resources', async (req, res) => {
  try {
    await connectDB();
    const resources = await Resource.find().lean();
    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.post('/api/login', async (req, res) => {
  try {
    await connectDB();
    const { email, password } = req.body;
    const user = await User.findOne({ email, password });
    if (user) res.json(user);
    else res.status(401).json({ message: 'Invalid credentials' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = app;