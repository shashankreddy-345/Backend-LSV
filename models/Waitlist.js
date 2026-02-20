const mongoose = require('mongoose');

const waitlistSchema = new mongoose.Schema({
  studentId: { type: String, required: true },
  resourceId: { type: String, required: true },
  date: { type: String, required: true },
  startTime: { type: String, required: true },
  endTime: { type: String, required: true },
  status: { type: String, default: 'pending' }
}, { timestamps: true });

module.exports = mongoose.model('Waitlist', waitlistSchema);