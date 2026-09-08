require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();

// --- MIDDLEWARE ---
// Mengizinkan frontend (Next.js) mengakses backend ini
app.use(cors()); 
// Mengizinkan Express membaca payload berformat JSON dari frontend
app.use(express.json()); 

// Buka folder 'uploads' ke publik agar file PDF bisa diakses langsung via URL
app.use('/uploads', express.static('uploads'));

// --- KONEKSI MONGODB ---
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ DATABASE CORTEX ONLINE (MongoDB Connected)');
  })
  .catch((err) => {
    console.error('❌ MONGODB CONNECTION FAILED:', err.message);
  });

// --- IMPORT ROUTER ---
const projectRoutes = require('./routes/projectRoutes');
const cardRoutes = require('./routes/cardRoutes');
const logisticRoutes = require('./routes/logisticRoutes'); // Diimport dengan rapi

// --- DAFTARKAN RUTE API ---
app.use('/api/projects', projectRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/logistics', logisticRoutes);
app.use('/api/telemetry', require('./routes/telemetryRoutes'));

// Tes Rute Dasar (Mengecek apakah server hidup)
app.get('/', (req, res) => {
  res.send('SYS-OVERRIDE BACKEND API IS RUNNING...');
});

// --- JALANKAN SERVER ---
const PORT = process.env.PORT || 5555;
app.listen(PORT, '0.0.0.0', () => {
  console.log(`🚀 Server berjalan di http://127.0.0.1:${PORT}`);
});