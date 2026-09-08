'use client';

export function ProjectGridView({ projects, onSelectProject }: { projects: any[], onSelectProject: (p: any) => void }) {
  const glassBase = "flex flex-col rounded-none border-0 p-6 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),_10px_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all";

  // JIKA DATABASE KOSONG UNTUK KATEGORI INI
  if (!projects || projects.length === 0) {
    return (
      <div className="w-full flex flex-col items-center justify-center p-12 opacity-50 mt-10">
        <div className="w-8 h-8 border border-white/20 mb-4 flex items-center justify-center font-mono text-lg text-white">0</div>
        <p className="font-mono text-[10px] text-white/50 uppercase tracking-widest">NO RECORDS DEPLOYED IN THIS CATEGORY.</p>
      </div>
    );
  }

  return (
    <div className="grid h-auto w-full grid-cols-[repeat(auto-fit,minmax(280px,1fr))] gap-6 pb-10 animate-in fade-in duration-500">
      {projects.map((project: any, idx: number) => (
        <div 
          // PROTEKSI KEY: Membaca _id (MongoDB) atau id (Dummy jika tersisa) atau idx
          key={project._id || project.id || `proj-${idx}`} 
          onClick={() => onSelectProject(project)} 
          className={`${glassBase} bg-white/5 hover:bg-white/10 hover:shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.05),_5px_5px_15px_rgba(0,0,0,0.8)] cursor-pointer group min-h-[200px] flex flex-col justify-between`}
        >
          <div className="relative z-10">
            <p className="mb-2 font-mono text-[9px] tracking-[0.2em] text-white/50 uppercase">
               {project.type}
            </p>
            <h3 className="font-mono text-sm sm:text-base tracking-wide text-white uppercase">{project.title}</h3>
            <p className="mt-4 font-mono text-[10px] tracking-widest text-white/60 uppercase line-clamp-2">{project.metrics}</p>
          </div>
          <div className="relative z-10 mt-6 flex w-full justify-end">
            <span className="font-mono text-[9px] tracking-[0.3em] text-white/30 group-hover:text-cyan-400 transition-colors uppercase">EXECUTE</span>
          </div>
        </div>
      ))}
    </div>
  );
}