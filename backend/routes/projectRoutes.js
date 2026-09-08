const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs'); // Tambahkan modul File System
const Project = require('../models/Project');

// --- SISTEM PINTAR: BUAT FOLDER OTOMATIS JIKA BELUM ADA ---
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('📁 Folder "uploads" otomatis dibuat!');
}

// --- KONFIGURASI MULTER (MESIN PENGUNGGAH FILE) ---
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    // Simpan file di folder 'uploads' yang sudah dipastikan ada
    cb(null, 'uploads/'); 
  },
  filename: function (req, file, cb) {
    // Bersihkan spasi dari nama file dan tambahkan timestamp agar tidak duplikat
    const safeName = file.originalname.replace(/\s+/g, '_');
    cb(null, Date.now() + '-' + safeName);
  }
});

// Batasi hanya bisa upload PDF
const fileFilter = (req, file, cb) => {
  if (file.mimetype === 'application/pdf') {
    cb(null, true);
  } else {
    cb(new Error('Hanya file PDF yang diizinkan!'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

// ==========================================
// ENDPOINT 1: AMBIL SEMUA DATA (GET)
// ==========================================
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: projects });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// ==========================================
// ENDPOINT 2: TAMBAH DATA & UPLOAD PDF (POST)
// ==========================================
router.post('/', upload.single('pdfFile'), async (req, res) => {
  try {
    const { title, category, type, metrics, githubUrl, liveDemoUrl, status } = req.body;
    
    let pdfFileUrl = '';
    
    // Jika ada file yang diupload, buatkan URL publiknya
    if (req.file) {
      // Ingat: Backend kita jalan di Port 5555
      pdfFileUrl = `http://127.0.0.1:5555/uploads/${req.file.filename}`;
    }

    const newProject = await Project.create({
      title,
      category,
      type,
      metrics,
      status,
      githubUrl,
      liveDemoUrl,
      pdfFileUrl
    });

    res.status(201).json({ success: true, data: newProject });
  } catch (error) {
    console.error("Gagal menyimpan project:", error);
    res.status(500).json({ success: false, message: 'Gagal menginjeksi data' });
  }
});

// ==========================================
// ENDPOINT 3: HAPUS DATA (DELETE)
// ==========================================
router.delete('/:id', async (req, res) => {
  try {
    const deletedProject = await Project.findByIdAndDelete(req.params.id);
    if (!deletedProject) {
      return res.status(404).json({ success: false, message: 'Data tidak ditemukan' });
    }
    res.status(200).json({ success: true, message: 'Data berhasil dihapus' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;