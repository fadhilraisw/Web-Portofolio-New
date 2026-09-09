'use client';

export function ProjectDetailView({ project }: { project: any }) {
  const glassBase = "flex flex-col rounded-none border-0 p-6 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),_10px_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all";
  
  const buttonStyle = `${glassBase} bg-white/5 hover:bg-white/10 flex-1 items-center justify-center text-center px-4 py-4 font-mono text-xs tracking-[0.2em] text-white hover:shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2),_5px_5px_10px_rgba(0,0,0,0.8)] cursor-pointer uppercase no-underline block`;
  const disabledButtonStyle = `${glassBase} bg-black/40 flex-1 items-center justify-center text-center px-4 py-4 font-mono text-xs tracking-[0.2em] text-white/20 uppercase no-underline block cursor-not-allowed`;

  return (
    <div className="flex flex-col animate-in fade-in duration-500 pb-10">
      <h2 className="mb-2 font-mono text-2xl tracking-widest text-white uppercase">{project.title}</h2>
      <p className="mb-8 font-mono text-xs tracking-[0.2em] text-white/60 uppercase">TYPE {project.type}</p>
      {project.description && <p className="mb-8 max-w-3xl font-mono text-xs leading-relaxed text-white/70">{project.description}</p>}
      {project.imageFileUrl && <img src={project.imageFileUrl} alt={project.title} className="mb-8 max-h-96 w-full object-contain border border-white/10 bg-black/30" />}
      
      <div className="mb-8 grid grid-cols-1 sm:grid-cols-2 gap-4 border-y border-white/5 py-6">
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-white/40 uppercase">PRIMARY METRIC / CATEGORY</p>
          <p className="font-mono text-sm tracking-wide text-white uppercase">{project.metrics || project.category}</p>
        </div>
        <div>
          <p className="mb-2 font-mono text-[10px] tracking-widest text-white/40 uppercase">STATUS</p>
          <p className="font-mono text-sm tracking-wide text-white uppercase">{project.status || 'STABLE ONLINE'}</p>
        </div>
      </div>
      
      {/* AREA AKSI DINAMIS */}
      <div className="flex flex-col sm:flex-row gap-4">
        {/* LOGIKA UNTUK DOKUMEN / PAPER PDF */}
        {project.contentKind === 'PAPER_FILE' || project.type === 'RESEARCH_PAPER' || project.type === 'ISAS_REPORT' ? (
          <>
            {project.pdfFileUrl ? (
              <>
                 <a href={project.pdfFileUrl} target="_blank" rel="noopener noreferrer" className={buttonStyle}>
                   READ PAPER IN BROWSER
                 </a>
                 <a href={project.pdfFileUrl} download className={buttonStyle}>
                   DOWNLOAD PDF
                 </a>
              </>
            ) : (
              <span className={disabledButtonStyle}>NO PDF PAYLOAD ATTACHED</span>
            )}
          </>
        ) : (
          /* LOGIKA UNTUK APLIKASI / KODE */
          <>
            {project.githubUrl ? (
              <a href={project.githubUrl} target="_blank" rel="noopener noreferrer" className={buttonStyle}>
                INSPECT SOURCE CODE
              </a>
            ) : (
              <span className={disabledButtonStyle}>NO REPOSITORY AVAILABLE</span>
            )}

            {project.liveDemoUrl ? (
              <a href={project.liveDemoUrl} target="_blank" rel="noopener noreferrer" className={buttonStyle}>
                INITIALIZE LIVE DEMO
              </a>
            ) : (
              <span className={disabledButtonStyle}>NO LIVE DEPLOYMENT</span>
            )}
          </>
        )}
      </div>
    </div>
  );
}