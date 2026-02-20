const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },          // keep your custom id style
    studentId: { type: String, required: true },     // ✅ add this
    rating: { type: Number, required: true },
    comment: { type: String, default: "" },
    date: { type: String, required: true }
  },
  { timestamps: true, _id: false }
);

module.exports = mongoose.model('Feedback', feedbackSchema);