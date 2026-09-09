'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

const glassInput = "bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-cyan-400 w-full";

export default function ProjectsView() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    title: '', category: 'SOFTWARE DEVELOPMENT', contentKind: 'RUNNABLE_PROJECT', type: 'APP_DEPLOYMENT',
    description: '', environment: '', metrics: '', status: 'STABLE ONLINE', githubUrl: '', liveDemoUrl: ''
  });

  useEffect(() => { fetchProjects(); }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5555/api/projects');
      if (res.ok) {
        const result = await res.json();
        if (result.success) setProjects(result.data);
      }
    } catch (error) { console.error("Gagal mengambil data proyek:", error); } 
    finally { setIsLoading(false); }
  };

  const handleEditClick = (p: any) => {
    setIsEditing(true);
    setEditingId(p._id);
    setFormData({
      title: p.title, category: p.category, type: p.type,
      contentKind: p.contentKind || (p.pdfFileUrl ? 'PAPER_FILE' : 'RUNNABLE_PROJECT'),
      description: p.description || '', environment: p.environment || '', metrics: p.metrics, status: p.status, githubUrl: p.githubUrl || '', liveDemoUrl: p.liveDemoUrl || ''
    });
    setFile(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setEditingId(null);
    setFormData({ title: '', category: 'SOFTWARE DEVELOPMENT', contentKind: 'RUNNABLE_PROJECT', type: 'APP_DEPLOYMENT', description: '', environment: '', metrics: '', status: 'STABLE ONLINE', githubUrl: '', liveDemoUrl: '' });
    setFile(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) setFile(e.target.files[0]);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const payload = new FormData();
    payload.append('title', formData.title); payload.append('category', formData.category);
    payload.append('type', formData.type); payload.append('contentKind', formData.contentKind); payload.append('description', formData.description); payload.append('environment', formData.environment); payload.append('metrics', formData.metrics);
    payload.append('status', formData.status); payload.append('githubUrl', formData.githubUrl);
    payload.append('liveDemoUrl', formData.liveDemoUrl);
    if (file) payload.append('attachmentFile', file);

    try {
      const url = isEditing ? `http://127.0.0.1:5555/api/projects/${editingId}` : 'http://127.0.0.1:5555/api/projects';
      const method = isEditing ? 'PUT' : 'POST';

      const res = await fetch(url, { method, body: payload });
      const result = await res.json();
      
      if (result.success) {
        cancelEdit();
        fetchProjects();
      } else { alert("Gagal menyimpan project: " + result.message); }
    } catch (error) { console.error("Gagal menginjeksi data:", error); } 
    finally { setIsSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah kamu yakin ingin memusnahkan data ini?')) return;
    try {
      await fetch(`http://127.0.0.1:5555/api/projects/${id}`, { method: 'DELETE' });
      fetchProjects();
    } catch (error) { console.error("Gagal menghapus data:", error); }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      <div className={`${glassBase} !bg-cyan-500/10 p-6 flex flex-col border-l-4 border-cyan-400 gap-2`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">COMMAND CENTER (PROJECT INJECTION)</h3>
        <p className="font-mono text-[9px] text-white/50 uppercase leading-relaxed">TAMBAHKAN ATAU EDIT PORTOFOLIO. DATA AKAN LANGSUNG MUNCUL DI DASHBOARD PENGUNJUNG SESUAI KATEGORI.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${glassBase} bg-black/60 relative p-6`}>
        {isEditing && <div className="absolute -top-3 right-6 bg-amber-500 px-4 py-1 text-black font-mono text-[9px] tracking-widest font-bold animate-pulse">EDIT MODE ACTIVE</div>}
        
        <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-6">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">{isEditing ? 'UPDATE DEPLOYMENT PROTOCOL' : 'NEW DEPLOYMENT PROTOCOL'}</h4>
          {isEditing && <button type="button" onClick={cancelEdit} className="text-[10px] text-white/50 hover:text-white uppercase font-mono">CANCEL [X]</button>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-cyan-400 uppercase">PROJECT TITLE</label>
            <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className={glassInput} required placeholder="Misal: AI Image Classifier" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-cyan-400 uppercase">OPERATIONAL CATEGORY</label>
            <input list="category-options" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value.toUpperCase()})} className={glassInput} required placeholder="Pilih atau ketik baru..." />
            <datalist id="category-options">
              <option value="DATA ENGINEERING" /> <option value="SOFTWARE DEVELOPMENT" />
              <option value="MACHINE LEARNING" /> <option value="GEN AI & AGENTIC" />
              <option value="BIOINFORMATICS" />
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">CONTENT TYPE</label>
            <select value={formData.contentKind} onChange={e => setFormData({...formData, contentKind: e.target.value, type: e.target.value === 'PAPER_FILE' ? 'RESEARCH_PAPER' : 'APP_DEPLOYMENT'})} className={glassInput}>
              <option value="RUNNABLE_PROJECT">RUNNABLE PROJECT</option>
              <option value="PAPER_FILE">PAPER / FILE</option>
            </select>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">TYPE LABEL</label>
            <input value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className={glassInput} required placeholder="RESEARCH_PAPER / APP_DEPLOYMENT" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">PRIMARY METRIC</label>
            <input value={formData.metrics} onChange={e => setFormData({...formData, metrics: e.target.value})} className={glassInput} required placeholder="Misal: 98% Accuracy" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">DESCRIPTION</label>
            <input value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} className={glassInput} placeholder="Ringkasan untuk visitor..." />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">STATUS</label>
            <input value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={glassInput} required placeholder="Misal: STABLE ONLINE" />
          </div>

          {formData.contentKind === 'RUNNABLE_PROJECT' && <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-mono text-[9px] text-cyan-400 uppercase">ENVIRONMENT / STACK</label>
            <input value={formData.environment} onChange={e => setFormData({...formData, environment: e.target.value})} className={glassInput} placeholder="Next.js, Node.js, MongoDB..." />
          </div>}

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">GITHUB REPOSITORY URL</label>
            <input value={formData.githubUrl} onChange={e => setFormData({...formData, githubUrl: e.target.value})} className={glassInput} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">LIVE DEMO URL</label>
            <input value={formData.liveDemoUrl} onChange={e => setFormData({...formData, liveDemoUrl: e.target.value})} className={glassInput} />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-emerald-400 uppercase">{formData.contentKind === 'PAPER_FILE' ? 'UPLOAD PAPER / IMAGE' : 'OPTIONAL DOCUMENT'}</label>
            <input type="file" accept={formData.contentKind === 'PAPER_FILE' ? 'application/pdf,image/png,image/jpeg,image/webp' : 'application/pdf'} onChange={handleFileChange} className="font-mono text-[10px] text-white/60 file:mr-4 file:py-2 file:px-4 file:rounded-none file:border-0 file:text-[9px] file:font-mono file:bg-emerald-500/20 file:text-emerald-400 hover:file:bg-emerald-500/30 cursor-pointer" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={`${glassButton} ${isSubmitting ? 'bg-white/10 text-white/30 cursor-not-allowed' : (isEditing ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500' : 'bg-cyan-500/20 text-cyan-400 border-cyan-500/40 hover:bg-cyan-500')} hover:text-black w-full py-4 text-xs font-bold transition-colors`}>
          {isSubmitting ? <>EXECUTING... <span className="animate-pulse">_</span></> : (isEditing ? 'CONFIRM UPDATE PROTOCOL' : 'INITIALIZE DATA INJECTION')}
        </button>
      </form>

      <div className={`${glassBase} p-0 overflow-hidden`}>
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 p-4 bg-white/5">
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">PROJECT TITLE</div>
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">CATEGORY</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">TYPE</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">ATTACHMENT</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase text-right">ACTION</div>
        </div>

        {isLoading && <div className="p-10 flex justify-center items-center"><p className="font-mono text-[10px] text-cyan-400/70 tracking-[0.3em] uppercase">FETCHING DEPLOYMENTS<span className="animate-pulse ml-1">_</span></p></div>}
        {!isLoading && projects.length === 0 && <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase">NO PROJECTS IN DATABASE.</div>}

        {!isLoading && projects.map((p, idx) => (
          <div key={p._id || idx} className="grid grid-cols-12 gap-4 border-b border-white/5 p-4 items-center hover:bg-white/10 transition-colors">
            <div className="col-span-3 font-mono text-xs text-white uppercase truncate pr-4">{p.title}</div>
            <div className="col-span-3 font-mono text-[9px] text-cyan-400 uppercase truncate pr-4">{p.category}</div>
            <div className="col-span-2 font-mono text-[9px] text-white/60 uppercase">{p.type}</div>
            <div className="col-span-2 font-mono text-[9px] uppercase">{p.contentKind === 'PAPER_FILE' ? <span className="text-fuchsia-400">PAPER / FILE</span> : <span className="text-cyan-400">RUNNABLE</span>}<span className="block text-white/30">{p.attachmentFileName || 'NO FILE'}</span></div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => handleEditClick(p)} className="px-3 py-1 bg-amber-500/10 font-mono text-[9px] text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black uppercase transition-colors">EDIT</button>
              <button onClick={() => handleDelete(p._id)} className="px-3 py-1 bg-rose-500/10 font-mono text-[9px] text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black uppercase transition-colors">DEL</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}