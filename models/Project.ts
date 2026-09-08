// models/Project.ts
import mongoose from 'mongoose';

const ProjectSchema = new mongoose.Schema({
  title: { type: String, required: true },
  category: { type: String, required: true }, // e.g., 'MACHINE LEARNING', 'DATA ENGINEERING'
  
  // Tipe ini yang membedakan apakah itu kode atau Paper ISAS/Skripsi
  type: { 
    type: String, 
    required: true,
    enum: ['WEB_APP', 'API_SERVICE', 'ML_PIPELINE', 'RESEARCH_PAPER'] 
  },
  
  metrics: { type: String }, // e.g., "98% ACCURACY" atau "PUBLISHED 2026"
  status: { type: String, default: 'ONLINE' },
  
  // URL untuk Project Biasa
  githubUrl: { type: String },
  liveDemoUrl: { type: String },
  
  // URL untuk Research Paper (File Handling)
  pdfFileUrl: { type: String }, 
}, { 
  timestamps: true 
});

export default mongoose.models.Project || mongoose.model('Project', ProjectSchema);