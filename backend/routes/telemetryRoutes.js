const express = require('express');
const router = express.Router();
const Telemetry = require('../models/Telemetry');

// Menerima data dari Frontend (User)
router.post('/', async (req, res) => {
  try {
    const log = await Telemetry.create(req.body);
    res.status(201).json({ success: true, data: log });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// Menampilkan log di Admin Panel
router.get('/', async (req, res) => {
  try {
    const logs = await Telemetry.find().sort({ timestamp: -1 }).limit(100);
    res.status(200).json({ success: true, data: logs });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// Menghapus semua log (Clear History)
router.delete('/clear', async (req, res) => {
  try {
    await Telemetry.deleteMany({});
    res.status(200).json({ success: true, message: 'Log dibersihkan' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;