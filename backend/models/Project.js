const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true, trim: true },
  contentKind: { type: String, enum: ['RUNNABLE_PROJECT', 'PAPER_FILE'], default: 'RUNNABLE_PROJECT', index: true },
  type: { type: String, required: true, trim: true },
  description: { type: String, default: '' },
  metrics: { type: String },
  status: { type: String, default: 'ONLINE' },
  environment: { type: String, default: '' },
  imageFileUrl: { type: String, default: '' },
  imageFileName: { type: String, default: '' },
  attachmentFileName: { type: String, default: '' },
  githubUrl: { type: String },
  liveDemoUrl: { type: String },
  pdfFileUrl: { type: String }, 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Project', ProjectSchema);