
const mongoose = require('mongoose');

const resourceSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  name: String,
  type: String,
  capacity: Number,
  building: String,
  floor: Number
}, { timestamps: true, _id: false });

module.exports = mongoose.model('Resource', resourceSchema);
