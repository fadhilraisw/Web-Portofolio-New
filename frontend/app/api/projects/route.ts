// app/api/projects/route.ts
import { NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Project from '@/models/Project';
import { writeFile } from 'fs/promises';
import path from 'path';

// GET: Mengambil semua data project dan paper untuk ditampilkan di Dashboard
export async function GET() {
  try {
    await dbConnect();
    const projects = await Project.find({}).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, data: projects }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Failed to fetch data' }, { status: 500 });
  }
}

// POST: Menambahkan project atau paper baru (Termasuk upload PDF)
export async function POST(req: Request) {
  try {
    await dbConnect();
    
    // Menangkap data dari multipart/form-data
    const formData = await req.formData();
    
    const title = formData.get('title') as string;
    const category = formData.get('category') as string;
    const type = formData.get('type') as string;
    const metrics = formData.get('metrics') as string;
    const githubUrl = formData.get('githubUrl') as string;
    const liveDemoUrl = formData.get('liveDemoUrl') as string;
    
    // Menangkap File PDF (Jika ada)
    const file = formData.get('pdfFile') as File | null;
    let pdfFileUrl = '';

    // --- LOGIKA FILE HANDLING ---
    if (file && file.name) {
      const bytes = await file.arrayBuffer();
      const buffer = Buffer.from(bytes);
      
      // Bersihkan nama file dari spasi (misal: "skripsi rais.pdf" -> "skripsi_rais.pdf")
      const safeFilename = `${Date.now()}-${file.name.replace(/\s+/g, '_')}`;
      
      // Tentukan lokasi simpan. Di mode lokal, kita simpan di folder public/assets/papers
      // Catatan: Jika nanti deploy ke Vercel/Production, kita akan ganti ini ke Cloud Storage (AWS S3 / Vercel Blob)
      const filepath = path.join(process.cwd(), 'public/assets/papers', safeFilename);
      
      await writeFile(filepath, buffer);
      
      // URL yang akan disimpan ke MongoDB dan bisa diakses publik
      pdfFileUrl = `/assets/papers/${safeFilename}`;
    }

    // Simpan ke Database
    const newProject = await Project.create({
      title,
      category,
      type,
      metrics,
      githubUrl,
      liveDemoUrl,
      pdfFileUrl
    });

    return NextResponse.json({ success: true, data: newProject }, { status: 201 });
  } catch (error) {
    console.error("API INJECTION ERROR:", error);
    return NextResponse.json({ success: false, error: 'Data injection failed' }, { status: 500 });
  }
}