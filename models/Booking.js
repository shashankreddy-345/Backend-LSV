
const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  resourceId: { type: String, ref: 'Resource', required: true },
  date: String,
  startTime: String,
  endTime: String,
  status: { type: String, default: 'upcoming' }
}, { timestamps: true, _id: false });

module.exports = mongoose.model('Booking', bookingSchema);
