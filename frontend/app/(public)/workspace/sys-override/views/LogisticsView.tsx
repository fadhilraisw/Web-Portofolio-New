'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

const glassInput = "bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-amber-400 w-full";

export default function LogisticsView() {
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const [formData, setFormData] = useState({
    itemName: '',
    recordType: 'JOB_APPLICATION',
    company: '',
    role: '',
    category: 'GENERAL',
    status: 'TODO',
    location: '',
    deadline: '',
    priority: 'MEDIUM',
    notes: ''
  });

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5555/api/logistics');
      if (res.ok) {
        const result = await res.json();
        if (result.success) setItems(result.data);
      }
    } catch (error) { console.error("Gagal mengambil data logistik:", error); } 
    finally { setIsLoading(false); }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch(`http://127.0.0.1:5555/api/logistics${editingId ? `/${editingId}` : ''}`, {
        method: editingId ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (res.ok) {
        setFormData({ itemName: '', recordType: 'JOB_APPLICATION', company: '', role: '', category: 'GENERAL', status: 'TODO', location: '', deadline: '', priority: 'MEDIUM', notes: '' });
        setEditingId(null);
        fetchItems();
      }
    } catch (error) { console.error("Gagal menyimpan data:", error); } 
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({ itemName: item.itemName || '', recordType: item.recordType || 'TASK', company: item.company || '', role: item.role || '', category: item.category || 'GENERAL', status: item.status || 'TODO', location: item.location || '', deadline: item.deadline ? item.deadline.slice(0, 10) : '', priority: item.priority || 'MEDIUM', notes: item.notes || '' });
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Hapus aset ini dari database logistik?')) return;
    try {
      await fetch(`http://127.0.0.1:5555/api/logistics/${id}`, { method: 'DELETE' });
      fetchItems();
    } catch (error) { console.error("Gagal menghapus data:", error); }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      <div className={`${glassBase} !bg-amber-500/10 p-6 flex flex-col border-l-4 border-amber-400 gap-2`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-amber-400 uppercase">JOB APPLICATION & TASK TRACKING</h3>
        <p className="font-mono text-[9px] text-white/50 uppercase leading-relaxed">
          JOB APPLICATIONS DAN PERSONAL TASKS DIPISAH BERDASARKAN TIPE RECORD. DATA INI HANYA UNTUK ADMIN.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`${glassBase} bg-black/60 p-6`}>
        <div className="flex justify-between border-b border-white/10 pb-4 mb-6">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">{editingId ? 'UPDATE RECORD' : 'NEW TRACKING RECORD'}</h4>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ itemName: '', recordType: 'JOB_APPLICATION', company: '', role: '', category: 'GENERAL', status: 'TODO', location: '', deadline: '', priority: 'MEDIUM', notes: '' }); }} className="font-mono text-[9px] text-white/50 uppercase">CANCEL [X]</button>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-amber-400 uppercase">TRACKING TYPE</label>
            <select value={formData.recordType} onChange={e => setFormData({...formData, recordType: e.target.value})} className={glassInput}>
              <option value="JOB_APPLICATION">JOB APPLICATION</option><option value="TASK">TASK / TODO</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-amber-400 uppercase">{formData.recordType === 'TASK' ? 'TASK TITLE' : 'APPLICATION LABEL'}</label>
            <input value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className={glassInput} required placeholder={formData.recordType === 'TASK' ? 'Misal: Finish portfolio case study' : 'Misal: Senior Data Engineer application'} />
          </div>
          {formData.recordType === 'JOB_APPLICATION' && <><div className="flex flex-col gap-2"><label className="font-mono text-[9px] text-amber-400 uppercase">COMPANY</label><input value={formData.company} onChange={e => setFormData({...formData, company: e.target.value})} className={glassInput} required /></div><div className="flex flex-col gap-2"><label className="font-mono text-[9px] text-amber-400 uppercase">ROLE</label><input value={formData.role} onChange={e => setFormData({...formData, role: e.target.value})} className={glassInput} required /></div></>}

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-amber-400 uppercase">CATEGORY</label>
            <input list="log-categories" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value.toUpperCase()})} className={glassInput} required />
            <datalist id="log-categories">
              <option value="GENERAL" />
              <option value="INTERVIEW" />
              <option value="FOLLOW UP" />
            </datalist>
          </div>
          <div className="flex flex-col gap-2"><label className="font-mono text-[9px] text-white/50 uppercase">DEADLINE</label><input type="date" value={formData.deadline} onChange={e => setFormData({...formData, deadline: e.target.value})} className={glassInput} /></div>
          <div className="flex flex-col gap-2"><label className="font-mono text-[9px] text-white/50 uppercase">PRIORITY</label><select value={formData.priority} onChange={e => setFormData({...formData, priority: e.target.value})} className={glassInput}><option>LOW</option><option>MEDIUM</option><option>HIGH</option></select></div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">CURRENT STATUS</label>
            <input list="log-status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value.toUpperCase()})} className={glassInput} required />
            <datalist id="log-status">
              <option value="TODO" />
              <option value="APPLIED" />
              <option value="INTERVIEW" />
              <option value="REJECTED" />
              <option value="DONE" />
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">REFERENCE / LOCATION</label>
            <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} className={glassInput} />
          </div>

          <div className="flex flex-col gap-2 md:col-span-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">ADDITIONAL NOTES / SERIAL NUMBER</label>
            <input value={formData.notes} onChange={e => setFormData({...formData, notes: e.target.value})} className={glassInput} placeholder="Opsional..." />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={`${glassButton} ${isSubmitting ? 'bg-white/10 text-white/30' : 'bg-amber-500/20 text-amber-400 border-amber-500/40 hover:bg-amber-500 hover:text-black'} w-full py-4 text-xs font-bold transition-colors`}>
          {isSubmitting ? <>EXECUTING LOG<span className="animate-pulse ml-1">_</span></> : editingId ? 'UPDATE LOGISTIC ITEM' : 'REGISTER LOGISTIC ITEM'}
        </button>
      </form>

      {/* TABEL LOGISTIK */}
      <div className={`${glassBase} p-0 overflow-hidden`}>
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 p-4 bg-white/5">
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">RECORD / COMPANY</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">TYPE / ROLE</div>
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">STATUS / LOCATION</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">NOTES</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase text-right">ACTION</div>
        </div>

        {isLoading && <div className="p-10 flex justify-center items-center"><p className="font-mono text-[10px] text-amber-400/70 tracking-[0.3em] uppercase">FETCHING ASSETS<span className="animate-pulse ml-1">_</span></p></div>}
        {!isLoading && items.length === 0 && <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase">NO LOGISTIC DATA FOUND.</div>}

        {!isLoading && items.map((item, idx) => (
          <div key={item._id || idx} className="grid grid-cols-12 gap-4 border-b border-white/5 p-4 items-center hover:bg-white/10 transition-colors">
            <div className="col-span-3 font-mono text-xs text-white uppercase truncate pr-4">{item.company || item.itemName}<span className="block text-[8px] text-white/40">{item.itemName}</span></div>
            <div className="col-span-2 font-mono text-[9px] text-amber-400 uppercase truncate pr-4">{item.recordType}<span className="block text-white/50">{item.role || item.category}</span></div>
            <div className="col-span-3 flex flex-col gap-1">
              <span className="font-mono text-[9px] text-white/80 uppercase truncate">{item.status}</span>
              <span className="font-mono text-[8px] text-white/40 uppercase truncate">LOC: {item.location}</span>
            </div>
            <div className="col-span-2 font-mono text-[9px] text-white/50 truncate pr-2">{item.notes || '-'}</div>
            <div className="col-span-2 flex justify-end gap-2">
              <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-amber-500/10 font-mono text-[9px] text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black uppercase transition-colors">EDIT</button>
              <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-rose-500/10 font-mono text-[9px] text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black uppercase transition-colors">DEL</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}