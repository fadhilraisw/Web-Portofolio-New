const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
  identifier: { type: String, required: true },
  title: { type: String, required: true },
  desc: { type: String, default: '' }, // <--- KOLOM BARU UNTUK HOVER PENJELASAN
  // Kept open so CMS cards can introduce new renderer types without a migration.
  type: { type: String, required: true, trim: true },
  colSpan: { type: Number, default: 12 },
  order: { type: Number, default: 0 },
  isVisible: { type: Boolean, default: true },
  dataPayload: { type: mongoose.Schema.Types.Mixed, required: true }
}, { timestamps: true });

module.exports = mongoose.model('Card', CardSchema);