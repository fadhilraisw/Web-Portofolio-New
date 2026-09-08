const express = require('express');
const router = express.Router();
const Logistic = require('../models/Logistic');

// Dapatkan semua data logistik
router.get('/', async (req, res) => {
  try {
    const items = await Logistic.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: items });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// Tambah logistik baru
router.post('/', async (req, res) => {
  try {
    const newItem = await Logistic.create(req.body);
    res.status(201).json({ success: true, data: newItem });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// Update logistik
router.put('/:id', async (req, res) => {
  try {
    const updatedItem = await Logistic.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedItem });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

// Hapus logistik
router.delete('/:id', async (req, res) => {
  try {
    await Logistic.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Item dihapus' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;