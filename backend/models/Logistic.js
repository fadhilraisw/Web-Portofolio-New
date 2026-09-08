const mongoose = require('mongoose');

const LogisticSchema = new mongoose.Schema({
  itemName: { type: String, required: true },
  recordType: { type: String, enum: ['JOB_APPLICATION', 'TASK', 'ASSET'], default: 'TASK' },
  company: { type: String, default: '' },
  role: { type: String, default: '' },
  deadline: { type: Date },
  priority: { type: String, enum: ['LOW', 'MEDIUM', 'HIGH'], default: 'MEDIUM' },
  category: { type: String, required: true },
  status: { type: String, required: true },
  location: { type: String, required: true },
  notes: { type: String, default: '' }
}, { timestamps: true });

module.exports = mongoose.model('Logistic', LogisticSchema);