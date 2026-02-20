const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    studentId: { type: String, required: true },
    resourceId: { type: String, required: true },
    date: { type: String, required: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    status: { type: String, default: 'upcoming' }
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model('Booking', bookingSchema);