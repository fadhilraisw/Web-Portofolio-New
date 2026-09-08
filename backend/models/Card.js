const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' }, // <--- KOLOM BARU UNTUK HOVER PENJELASAN
  type: { 
    type: String, 
    required: true,
    enum: [
      'EXECUTIVE_SUMMARY', 'ACTION_BUTTON', 'TIMELINE', 'PIPELINE_TRACKER', 
      'CHART_BAR', 'CHART_PIE', 'CHART_RADAR', 
      'MAP_BLOCK', 'WAFFLE_MATRIX', 'MCU_METRICS', 'HOVER_LIST'
    ] 
  },
  colSpan: { type: Number, default: 12 },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  dataPayload: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);