const mongoose = require('mongoose');

const TelemetrySchema = new mongoose.Schema({
  visitorName: { type: String, default: 'GUEST' },
  action: { type: String, required: true }, // Cth: "VIEW_PAGE", "CLICK_PROJECT"
  details: { type: String, required: true }, // Cth: "Melihat kategori SOFTWARE DEVELOPMENT"
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Telemetry', TelemetrySchema);