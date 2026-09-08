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
    category: 'HARDWARE ASSET',
    status: 'ACTIVE / DEPLOYED',
    location: 'BEKASI HQ',
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
        setFormData({ itemName: '', category: 'HARDWARE ASSET', status: 'ACTIVE / DEPLOYED', location: 'BEKASI HQ', notes: '' });
        setEditingId(null);
        fetchItems();
      }
    } catch (error) { console.error("Gagal menyimpan data:", error); } 
    finally { setIsSubmitting(false); }
  };

  const handleEdit = (item: any) => {
    setEditingId(item._id);
    setFormData({ itemName: item.itemName || '', category: item.category || '', status: item.status || '', location: item.location || '', notes: item.notes || '' });
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
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-amber-400 uppercase">LOGISTICS & TRACKING MATRIX</h3>
        <p className="font-mono text-[9px] text-white/50 uppercase leading-relaxed">
          PEMANTAUAN ASET FISIK, LISENSI PERANGKAT LUNAK, DAN INVENTARIS OPERASIONAL.
        </p>
      </div>

      <form onSubmit={handleSubmit} className={`${glassBase} bg-black/60`}>
        <div className="flex justify-between border-b border-white/10 pb-4 mb-6">
          <h4 className="font-mono text-xs text-white uppercase tracking-widest">{editingId ? 'UPDATE ASSET' : 'REGISTER NEW ASSET'}</h4>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setFormData({ itemName: '', category: 'HARDWARE ASSET', status: 'ACTIVE / DEPLOYED', location: 'BEKASI HQ', notes: '' }); }} className="font-mono text-[9px] text-white/50 uppercase">CANCEL [X]</button>}
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-amber-400 uppercase">ITEM / ASSET NAME</label>
            <input value={formData.itemName} onChange={e => setFormData({...formData, itemName: e.target.value})} className={glassInput} required placeholder="Misal: MacBook Pro M2" />
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-amber-400 uppercase">ASSET CATEGORY</label>
            <input list="log-categories" value={formData.category} onChange={e => setFormData({...formData, category: e.target.value.toUpperCase()})} className={glassInput} required />
            <datalist id="log-categories">
              <option value="HARDWARE ASSET" />
              <option value="SOFTWARE LICENSE" />
              <option value="MERCHANDISE" />
              <option value="OFFICE SUPPLY" />
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">CURRENT STATUS</label>
            <input list="log-status" value={formData.status} onChange={e => setFormData({...formData, status: e.target.value.toUpperCase()})} className={glassInput} required />
            <datalist id="log-status">
              <option value="ACTIVE / DEPLOYED" />
              <option value="IN TRANSIT" />
              <option value="IN MAINTENANCE" />
              <option value="ARCHIVED" />
            </datalist>
          </div>

          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">LOCATION ID</label>
            <input value={formData.location} onChange={e => setFormData({...formData, location: e.target.value.toUpperCase()})} className={glassInput} required />
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
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">ITEM NAME</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">CATEGORY</div>
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">STATUS / LOCATION</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">NOTES</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase text-right">ACTION</div>
        </div>

        {isLoading && <div className="p-10 flex justify-center items-center"><p className="font-mono text-[10px] text-amber-400/70 tracking-[0.3em] uppercase">FETCHING ASSETS<span className="animate-pulse ml-1">_</span></p></div>}
        {!isLoading && items.length === 0 && <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase">NO LOGISTIC DATA FOUND.</div>}

        {!isLoading && items.map((item, idx) => (
          <div key={item._id || idx} className="grid grid-cols-12 gap-4 border-b border-white/5 p-4 items-center hover:bg-white/10 transition-colors">
            <div className="col-span-3 font-mono text-xs text-white uppercase truncate pr-4">{item.itemName}</div>
            <div className="col-span-2 font-mono text-[9px] text-amber-400 uppercase truncate pr-4">{item.category}</div>
            <div className="col-span-3 flex flex-col gap-1">
              <span className="font-mono text-[9px] text-white/80 uppercase truncate">{item.status}</span>
              <span className="font-mono text-[8px] text-white/40 uppercase truncate">LOC: {item.location}</span>
            </div>
            <div className="col-span-2 font-mono text-[9px] text-white/50 truncate pr-2">{item.notes || '-'}</div>
            <div className="col-span-2 flex justify-end">
              <button onClick={() => handleEdit(item)} className="px-3 py-1 bg-amber-500/10 font-mono text-[9px] text-amber-400 border border-amber-500/20 hover:bg-amber-500 hover:text-black uppercase transition-colors">EDIT</button>
              <button onClick={() => handleDelete(item._id)} className="px-3 py-1 bg-rose-500/10 font-mono text-[9px] text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black uppercase transition-colors">DEL</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}