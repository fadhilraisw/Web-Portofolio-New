'use client';

import { useState, useEffect } from 'react';
import { DashboardView } from './views/DashboardView';
import { ProjectGridView } from './views/ProjectGridView';
import { ProjectDetailView } from './views/ProjectDetailView';

export function CenterPanel({ activeCategory, isLoading, visitorGoal, visitor }: any) {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isFetchingDB, setIsFetchingDB] = useState(true);

  // 1. FETCH SEMUA PROJECT DARI MONGODB
  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5555/api/projects');
        if (res.ok) {
          const result = await res.json();
          if (result.success) setProjects(result.data);
        }
      } catch (error) {
        console.error("Gagal mengambil data projects dari database:", error);
      } finally {
        setIsFetchingDB(false);
      }
    };
    fetchProjects();
  }, []);

  // 2. RESET TAMPILAN DETAIL & CATAT KE TELEMETRY
  useEffect(() => {
    setSelectedProject(null);
    
    // --- SKRIP PEREKAM TELEMETRY ---
    const recordTelemetry = async () => {
      try {
        await fetch('http://127.0.0.1:5555/api/telemetry', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            visitorName: visitor?.name || 'GUEST',
            action: 'NAVIGATION',
            details: `Akses direktori: ${activeCategory.toUpperCase()}`
          })
        });
      } catch (e) { /* Abaikan jika gagal agar tidak mengganggu UX */ }
    };
    
    recordTelemetry();
    // --------------------------------
    
  }, [activeCategory, visitor]);

  // ANIMASI LOADING SAAT PINDAH MENU ATAU FETCHING DATABASE
  if (isLoading || isFetchingDB) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center h-full">
        <p className="font-mono text-xs text-white/50 uppercase tracking-[0.4em]">
          ACCESSING DATABASE<span className="animate-pulse text-cyan-400">...</span>
        </p>
      </div>
    );
  }

  // 3. JIKA MENU YANG DIPILIH ADALAH "DASHBOARD"
  if (activeCategory === 'dashboard') {
    return (
      <div className="flex-1 overflow-y-auto custom-scrollbar h-full pr-2">
        <DashboardView visitor={visitor} visitorGoal={visitorGoal} />
      </div>
    );
  }

  // 4. JIKA MENU YANG DIPILIH ADALAH KATEGORI PROYEK
  const filteredProjects = projects.filter((p: any) => {
    if (!p.category) return false;
    const dbCategory = p.category.toUpperCase().trim();
    const menuCategory = activeCategory.toUpperCase().replace(/-/g, ' ').trim();
    return dbCategory === menuCategory;
  });

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar h-full pr-2">
      <div className="mb-8 border-b border-white/10 pb-4">
        <h2 className="font-mono text-xl tracking-[0.3em] text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]">
          {activeCategory.replace(/-/g, ' ')} DIRECTORY
        </h2>
        <p className="mt-2 font-mono text-[9px] tracking-widest text-white/50 uppercase">
          {filteredProjects.length} RECORDS FOUND IN DATABASE
        </p>
      </div>

      {selectedProject ? (
        <>
          <button
            onClick={() => setSelectedProject(null)}
            className="mb-6 font-mono text-[10px] text-white/50 hover:text-white hover:border-white/30 uppercase px-4 py-2 border border-white/10 bg-white/5 transition-colors"
          >
            &lt; BACK TO DIRECTORY
          </button>
          <ProjectDetailView project={selectedProject} />
        </>
      ) : (
        <ProjectGridView projects={filteredProjects} onSelectProject={setSelectedProject} />
      )}
    </div>
  );
}