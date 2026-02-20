
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI)
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('MongoDB connection error:', err));

const authRoutes = require('./auth');
const userRoutes = require('./users');
const bookingRoutes = require('./bookings');
const feedbackRoutes = require('./feedback');
const resourceRoutes = require('./resources');
const waitlistRoutes = require('./waitlist');

app.use('/api', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/bookings', bookingRoutes);
app.use('/api/feedback', feedbackRoutes);
app.use('/api/resources', resourceRoutes);
app.use('/api/waitlist', waitlistRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = app;