const mongoose = require('mongoose');

const LogisticSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Logistic', LogisticSchema);