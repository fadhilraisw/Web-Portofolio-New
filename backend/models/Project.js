const mongoose = require('mongoose');

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // Bebas diisi apa saja
  type: { type: String, required: true },     // Bebas diisi (WEB_APP, FREELANCE_GIG, dll)
  metrics: { type: String }, 
  status: { type: String, default: 'ONLINE' },
  githubUrl: { type: String },
  liveDemoUrl: { type: String },
  pdfFileUrl: { type: String }, 
}, { 
  timestamps: true 
});

module.exports = mongoose.model('Project', ProjectSchema);