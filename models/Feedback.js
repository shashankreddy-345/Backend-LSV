
const mongoose = require('mongoose');

const feedbackSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  rating: Number,
  comment: String,
  date: String
}, { timestamps: true, _id: false });

module.exports = mongoose.model('Feedback', feedbackSchema);
