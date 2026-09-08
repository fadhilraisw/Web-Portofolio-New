const express = require('express');
const router = express.Router();
const Card = require('../models/Card');

const seedStarterData = async () => {
  try {
    const count = await Card.countDocuments();
    if (count === 0) {
      console.log('🌱 Menyiapkan Starter Pack dengan Sistem Tooltip & Waffle Legend...');
      
      const starterCards = [
        {
          identifier: 'EXEC_SUMMARY', title: 'PROFILE', desc: 'Ringkasan eksekutif yang disesuaikan berdasarkan tipe pengunjung (HR / Tech Lead).', type: 'EXECUTIVE_SUMMARY', colSpan: 8, order: 1, isVisible: true,
          dataPayload: {
            default: "SYSTEMATIC ENGINEER DRIVING INTERSECTION OF AI ARCHITECTURE AND MODERN UI. SPECIALIZING IN NEXT.JS TURBOPACK, PYTHON ML PIPELINES, AND NO-SQL SYSTEMS.",
            hr: "HIGHLY DISCIPLINED TALENT READY FOR IMMEDIATE PLACEMENT. PROVEN ACADEMIC TRACK RECORD WITH STRONG COMMUNICATION SKILLS. FOCUS ON DELIVERING IMPACTFUL BUSINESS SOLUTIONS ON TIME.",
            techLead: "ARCHITECTING ROBUST WORKFLOWS WITH NEXT.JS 16 TURBOPACK AND PYTHON ML PIPELINES. PROFICIENT IN UN-CACHED API AGGREGATION, MONGODB PIPELINES, AND LANGCHAIN AGENTIC SYSTEMS."
          }
        },
        {
          identifier: 'TARGET_ROLE', title: 'TARGET ROLE', desc: 'Tombol Call-to-Action utama untuk mengunduh CV atau portofolio.', type: 'ACTION_BUTTON', colSpan: 4, order: 2, isVisible: true,
          dataPayload: { actionText: "DOWNLOAD MASTER CV" }
        },
        {
          identifier: 'EDU_TIMELINE', title: 'ACADEMIC RECORD', desc: 'Riwayat pendidikan formal dan sertifikasi universitas.', type: 'TIMELINE', colSpan: 4, order: 3, isVisible: true,
          dataPayload: [
            { title: 'CCIT FTUI', desc: 'TI AIDA SPECIALIZATION', color: 'emerald' }, 
            { title: 'ASIA E UNIVERSITY', desc: 'B.ICT DEGREE TRACK', color: 'emerald' }
          ]
        },
        {
          identifier: 'EXP_TIMELINE', title: 'PROFESSIONAL TRACK', desc: 'Riwayat pengalaman kerja dan target penempatan industri.', type: 'TIMELINE', colSpan: 4, order: 4, isVisible: true,
          dataPayload: [
            { title: 'AI UI INTERN', desc: 'TARGET PLACEMENT 2026', color: 'amber' }, 
            { title: 'FREELANCE DEV', desc: 'FULL STACK INTEGRATION', color: 'amber' }
          ]
        },
        {
          identifier: 'VOL_TIMELINE', title: 'COMMUNITY & EXTRAS', desc: 'Aktivitas komunitas, relawan, dan kontribusi Open Source.', type: 'TIMELINE', colSpan: 4, order: 5, isVisible: true,
          dataPayload: [
            { title: 'TECH MENTOR', desc: 'OPEN SOURCE ADVOCATE', color: 'indigo' }
          ]
        },
        {
          identifier: 'PIPELINE', title: 'ACTIVE OPERATIONS PIPELINE', desc: 'Sistem pelacakan lamaran kerja dan proyek *freelance* yang sedang berjalan.', type: 'PIPELINE_TRACKER', colSpan: 12, order: 6, isVisible: false,
          dataPayload: {
            external: [
              { company: 'GOJEK', role: 'DATA ENG', status: 'INTERVIEW', color: 'amber', desc: 'Jadwal wawancara teknis arsitektur data pipeline.' },
              { company: 'TOKOPEDIA', role: 'FRONTEND', status: 'APPLIED', color: 'cyan', desc: 'Menunggu review CV dari tim rekrutmen.' }
            ],
            freelance: [
              { project: 'SYS-DASHBOARD', client: 'BUILD', status: 'IN PROGRESS', color: 'emerald', desc: 'Pengembangan CMS Modular dengan Next.js dan MongoDB.' }
            ]
          }
        },
        {
          identifier: 'TECH_STACK', title: 'TECH STACK (BAR)', desc: 'Distribusi penguasaan bahasa pemrograman dan framework inti.', type: 'CHART_BAR', colSpan: 4, order: 7, isVisible: true,
          dataPayload: [
            { name: 'NEXT.JS & TS', score: 95, desc: 'ENTERPRISE UI & SERVER COMPONENTS' },
            { name: 'PYTHON / FLASK', score: 92, desc: 'BACKEND AUTOMATION & ML PIPELINES' },
            { name: 'TENSORFLOW', score: 88, desc: 'DEEP LEARNING & MODEL TRAINING' },
            { name: 'LANGCHAIN / N8N', score: 85, desc: 'AGENTIC WORKFLOW AUTOMATION' },
            { name: 'MONGODB / MYSQL', score: 85, desc: 'NO-SQL & RELATIONAL DB ARCHITECTURE' }
          ]
        },
        {
          identifier: 'DOMAIN_FOCUS', title: 'DOMAIN (PIE)', desc: 'Distribusi waktu dan fokus spesialisasi dalam ekosistem IT.', type: 'CHART_PIE', colSpan: 4, order: 8, isVisible: true,
          dataPayload: [
            { name: 'SOFTWARE ENG', value: 40, color: '#ffffff', desc: 'FULL-STACK DEVELOPMENT' },
            { name: 'MACHINE LEARNING', value: 35, color: '#cccccc', desc: 'PREDICTIVE MODELS' },
            { name: 'DATA PIPELINES', value: 25, color: '#888888', desc: 'ETL & ENGINEERING' }
          ]
        },
        {
          identifier: 'COMPETENCIES', title: 'COMPETENCIES (RADAR)', desc: 'Evaluasi metrik kemampuan non-teknis (Soft-skills) dan efisiensi kerja.', type: 'CHART_RADAR', colSpan: 4, order: 9, isVisible: true,
          dataPayload: [
            { subject: 'PROBLEM SOLVING', A: 90, fullMark: 100, desc: 'Kecepatan memecahkan bug dan isu sistem.' },
            { subject: 'LEADERSHIP', A: 85, fullMark: 100, desc: 'Kemampuan memimpin inisiatif proyek.' },
            { subject: 'COMMUNICATION', A: 95, fullMark: 100, desc: 'Komunikasi antar tim dan pemangku kepentingan.' },
            { subject: 'ADAPTABILITY', A: 88, fullMark: 100, desc: 'Adaptasi terhadap framework dan teknologi baru.' },
            { subject: 'WORK ETHIC', A: 92, fullMark: 100, desc: 'Disiplin, ketepatan waktu, dan tanggung jawab.' }
          ]
        },
        {
          identifier: 'MAP_BLOCK', title: 'OPERATIONAL TOPOGRAPHY', desc: 'Sistem satelit pelacakan basis operasi saat ini.', type: 'MAP_BLOCK', colSpan: 8, order: 10, isVisible: true,
          dataPayload: {} 
        },
        {
          identifier: 'WAFFLE_RARITY', title: 'HYBRID CAPABILITY', desc: 'Matrix kelangkaan talenta yang menggabungkan kemampuan desain UI dan AI.', type: 'WAFFLE_MATRIX', colSpan: 4, order: 11, isVisible: true,
          // PENAMBAHAN DATA LEGEND AGAR BISA DI-CRUD
          dataPayload: {
            legend: [
              { label: 'STANDARD', colorClass: 'bg-white/10' },
              { label: 'UI EXPERT', colorClass: 'bg-white/30' },
              { label: 'ML ENGINEER', colorClass: 'bg-white/60' },
              { label: 'AI UI HYBRID', colorClass: 'bg-white shadow-[0_0_4px_white]' }
            ]
          } 
        },
        {
          identifier: 'MCU_METRICS', title: 'MEDICAL CLEARANCE', desc: 'Laporan kesehatan dan postur ergonomis dalam bekerja.', type: 'MCU_METRICS', colSpan: 4, order: 12, isVisible: true,
          dataPayload: [
            { label: 'STATUS', value: 'FIT FOR DUTY', desc: '100% OPERATIONAL READINESS.', highlight: true },
            { label: 'VISION', value: '20/20 DARK MODE', desc: 'EYES ADAPTED TO LOW-LIGHT IDE ENVIRONMENTS.', highlight: false },
            { label: 'SPINAL POSTURE', value: '90% ERGONOMIC', desc: 'MAINTAINS CORRECT POSTURE DURING LONG CODING SESSIONS.', highlight: false }
          ]
        },
        {
          identifier: 'DEPLOYMENT_PROTOCOLS', title: 'DEPLOYMENT PROTOCOLS', desc: 'Skenario target pekerjaan yang diincar.', type: 'HOVER_LIST', colSpan: 4, order: 13, isVisible: true,
          dataPayload: { color: 'teal', items: [
            { label: 'JUNIOR AI ENGINEER', desc: 'Ready to build, test, and deploy LLM agents and intelligent workflows.' },
            { label: 'DATA SCIENTIST', desc: 'Capable of extracting insights via Pandas, Tableau, and advanced statistical models.' },
            { label: 'ML ENGINEER', desc: 'Training predictive algorithms and cleaning data pipelines for production.' }
          ]}
        },
        {
          identifier: 'BEHAVIORAL_METRICS', title: 'BEHAVIORAL METRICS', desc: 'Metrik perilaku profesional di lingkungan kerja.', type: 'HOVER_LIST', colSpan: 4, order: 14, isVisible: true,
          dataPayload: { color: 'orange', items: [
            { label: 'ANALYTICAL COMMUNICATION', desc: 'Translating complex technical data into clear stakeholder insights.' },
            { label: 'AGILE PROBLEM SOLVING', desc: 'Adapting rapidly to shifting project requirements without losing momentum.' },
            { label: 'TEAMWORK & LEADERSHIP', desc: 'Taking initiative while ensuring the team operates as a cohesive unit.' }
          ]}
        }
      ];

      await Card.insertMany(starterCards);
      console.log('✅ Starter Pack berhasil di-inject ke Database!');
    }
  } catch (error) {
    console.error("Seeding Error:", error.message);
  }
};

seedStarterData();

router.get('/', async (req, res) => {
  try {
    const cards = await Card.find().sort({ order: 1 });
    res.status(200).json({ success: true, data: cards });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.post('/', async (req, res) => {
  try {
    const newCard = await Card.create(req.body);
    res.status(201).json({ success: true, data: newCard });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.put('/:id', async (req, res) => {
  try {
    const updatedCard = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: updatedCard });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

router.delete('/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Card dihapus' });
  } catch (error) { res.status(500).json({ success: false, message: error.message }); }
});

module.exports = router;