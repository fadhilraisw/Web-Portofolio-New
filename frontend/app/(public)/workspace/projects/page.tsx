'use client';

import { useState, useEffect } from 'react';
import { ProjectGridView } from '@/components/workspace/views/ProjectGridView';
import { ProjectDetailView } from '@/components/workspace/views/ProjectDetailView';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedProject, setSelectedProject] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // FETCH DATA DARI BACKEND SAAT HALAMAN DIBUKA PENGUNJUNG
  useEffect(() => {
    const fetchPublicProjects = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5555/api/projects');
        if (res.ok) {
          const result = await res.json();
          if (result.success) {
            setProjects(result.data);
          }
        }
      } catch (error) {
        console.error("Gagal mengambil data proyek publik:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchPublicProjects();
  }, []);

  return (
    <div className="min-h-screen p-4 sm:p-8 flex flex-col items-center">
      <div className="w-full max-w-6xl">
        <header className="mb-12 flex items-center justify-between border-b border-white/10 pb-6">
          <div>
            <h1 className="font-mono text-2xl tracking-[0.3em] text-cyan-400 uppercase drop-shadow-[0_0_5px_rgba(6,182,212,0.4)]">
              OPERATIONAL DIRECTORY
            </h1>
            <p className="mt-2 font-mono text-[10px] tracking-widest text-white/50 uppercase">
              {projects.length} PROJECTS & PAPERS ACCESSIBLE
            </p>
          </div>
          {selectedProject && (
             <button 
                onClick={() => setSelectedProject(null)}
                className="font-mono text-[10px] text-white/50 hover:text-white uppercase px-4 py-2 border border-white/10 bg-white/5"
             >
               BACK TO DIRECTORY
             </button>
          )}
        </header>

        {isLoading ? (
          <div className="w-full h-64 flex flex-col items-center justify-center">
             <div className="w-2 h-2 bg-cyan-400 animate-ping"></div>
             <p className="font-mono text-[10px] text-white/40 uppercase mt-4 tracking-widest">FETCHING CORTEX DATABASE...</p>
          </div>
        ) : (
          <>
            {/* LOGIKA TAMPILAN: Grid vs Detail */}
            {selectedProject ? (
              <ProjectDetailView project={selectedProject} />
            ) : (
              <ProjectGridView projects={projects} onSelectProject={setSelectedProject} />
            )}
          </>
        )}
      </div>
    </div>
  );
}