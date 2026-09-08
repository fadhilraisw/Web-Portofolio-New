'use client';

import { useState, useEffect } from 'react';

export function SidebarLeft({ collapsed, setCollapsed, activeCategory, setActiveCategory, visitorName }: any) {
  const [dbCategories, setDbCategories] = useState<string[]>([]);

  // Fetch categories from the database so the public workspace stays data-driven.
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5555/api/projects');
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            // Mengekstrak kategori unik dari data proyek yang ada di DB
            const uniqueCats = Array.from(new Set(result.data.map((p: any) => p.category?.toUpperCase().trim()))).filter(Boolean) as string[];
            setDbCategories(uniqueCats);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil daftar kategori dari database:", error);
      }
    };
    fetchCategories();
  }, []);

  // Keep the existing navigation categories while allowing CMS-created categories.
  const defaultCategories = [
    "DATA ENGINEERING", 
    "SOFTWARE DEVELOPMENT", 
    "MACHINE LEARNING", 
    "GEN AI & AGENTIC", 
    "BIOINFORMATICS"
  ];
  const allCategories = Array.from(new Set([...defaultCategories, ...dbCategories]));

  // Fungsi untuk mengubah teks (misal: "ROBOTICS ENG" -> "robotics-eng")
  const formatKey = (str: string) => str.toLowerCase().replace(/\s+/g, '-');

  return (
    <aside className={`flex flex-col h-full transition-all duration-500 ${collapsed ? 'w-16' : 'w-64'} border-r border-white/10 bg-[#09090b]/80 backdrop-blur-md`}>
      
      {/* HEADER SIDEBAR */}
      <div className="flex items-center justify-between p-6 border-b border-white/10 shrink-0">
        {!collapsed && (
          <div className="flex flex-col">
            <span className="font-mono text-sm tracking-[0.3em] text-white uppercase">RAIS OS</span>
            <span className="font-mono text-[8px] tracking-widest text-cyan-400 uppercase mt-1">USER {visitorName || 'GUEST'}</span>
          </div>
        )}
        <button onClick={() => setCollapsed(!collapsed)} className="text-white/50 hover:text-white transition-colors">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 12h18M3 6h18M3 18h18"/></svg>
        </button>
      </div>

      {/* MENU LIST (SCROLLABLE) */}
      <div className="flex flex-col flex-1 p-4 gap-2 overflow-y-auto custom-scrollbar">
        
        {/* MENU UTAMA: DASHBOARD */}
        <button 
          onClick={() => setActiveCategory('dashboard')}
          className={`flex items-center text-left px-4 py-3 font-mono text-[9px] tracking-widest uppercase transition-all border-l-2 ${activeCategory === 'dashboard' ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'} ${collapsed ? 'justify-center px-0' : ''}`}
        >
          {collapsed ? 'DSH' : '| DASHBOARD'}
        </button>

        <div className="my-2 border-b border-white/5 w-full shrink-0"></div>

        {/* KATEGORI DINAMIS DARI DATABASE */}
        {allCategories.map((cat, idx) => {
          const key = formatKey(cat);
          const isActive = activeCategory === key;
          return (
            <button 
              key={idx}
              onClick={() => setActiveCategory(key)}
              className={`flex items-center text-left px-4 py-3 font-mono text-[9px] tracking-widest uppercase transition-all border-l-2 ${isActive ? 'border-cyan-400 text-cyan-400 bg-cyan-400/10' : 'border-transparent text-white/50 hover:text-white hover:bg-white/5'} ${collapsed ? 'justify-center px-0' : ''}`}
              title={collapsed ? cat : ''}
            >
              {collapsed ? cat.substring(0, 3) : cat}
            </button>
          );
        })}

      </div>
    </aside>
  );
}