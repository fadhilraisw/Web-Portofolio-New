'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

export default function DashboardCmsView() {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  // State untuk form Add & Edit
  const [isAdding, setIsAdding] = useState(false);
  const [editingCard, setEditingCard] = useState<any | null>(null);
  const [formData, setFormData] = useState({ identifier: '', title: '', type: 'CHART_BAR', desc: '', colSpan: 12, order: 0, rawPayload: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => { 
    fetchCards(); 
  }, []);

  const fetchCards = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5555/api/cards');
      if (res.ok) {
        const result = await res.json();
        if (result.success) setCards(result.data);
      }
    } catch (error) { 
      console.error("Gagal mengambil data Cards:", error); 
    } finally { 
      setIsLoading(false); 
    }
  };

  const toggleVisibility = async (id: string, currentStatus: boolean) => {
    try {
      await fetch(`http://127.0.0.1:5555/api/cards/${id}`, { 
        method: 'PUT', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ isVisible: !currentStatus }) 
      });
      fetchCards();
    } catch (error) { 
      console.error("Gagal update visibility:", error); 
    }
  };

  // Fungsi Buka Form Tambah Kartu Baru
  const openAddForm = () => {
    setEditingCard(null);
    setFormData({ 
      identifier: 'NEW_COMPONENT', 
      title: 'NEW TITLE', 
      type: 'CHART_BAR', 
      desc: '', 
      colSpan: 4, 
      order: cards.length + 1, 
      rawPayload: '[\n  {"name": "Item A", "score": 80},\n  {"name": "Item B", "score": 90}\n]' 
    });
    setIsAdding(true);
  };

  // Fungsi Buka Form Edit Kartu
  const handleEditClick = (card: any) => {
    setIsAdding(false);
    setEditingCard(card);
    setFormData({
      identifier: card.identifier,
      title: card.title || '',
      type: card.type || 'CHART_BAR',
      desc: card.desc || '',
      colSpan: card.colSpan || 12,
      order: card.order || 0,
      rawPayload: typeof card.dataPayload === 'object' ? JSON.stringify(card.dataPayload, null, 2) : card.dataPayload
    });
  };

  // Handle Submit (Bisa untuk CREATE baru, atau UPDATE yang ada)
  const handleSubmitCard = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    let parsedPayload = formData.rawPayload;
    try { parsedPayload = JSON.parse(formData.rawPayload); } catch (err) {}

    const payloadData = {
      identifier: formData.identifier,
      title: formData.title,
      type: formData.type,
      desc: formData.desc,
      colSpan: Number(formData.colSpan),
      order: Number(formData.order),
      dataPayload: parsedPayload,
      isVisible: true
    };

    try {
      const url = isAdding ? 'http://127.0.0.1:5555/api/cards' : `http://127.0.0.1:5555/api/cards/${editingCard._id}`;
      const method = isAdding ? 'POST' : 'PUT';

      const res = await fetch(url, { 
        method, 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify(payloadData) 
      });
      const result = await res.json();
      if (result.success) {
        setIsAdding(false);
        setEditingCard(null);
        fetchCards();
      }
    } catch (error) { 
      console.error("Gagal menyimpan kartu:", error); 
    } finally { 
      setIsSubmitting(false); 
    }
  };

  const handleDeleteCard = async (id: string) => {
    if (!confirm('Hapus komponen ini secara permanen dari dashboard?')) return;
    try {
      await fetch(`http://127.0.0.1:5555/api/cards/${id}`, { method: 'DELETE' });
      fetchCards();
    } catch (error) { 
      console.error("Gagal menghapus kartu:", error); 
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      
      {/* HEADER CMS DENGAN TOMBOL ADD NEW */}
      <div className={`${glassBase} bg-fuchsia-500/10 p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-fuchsia-400 gap-4`}>
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-fuchsia-400 uppercase mb-2">LAYOUT ENGINE & CARD CMS</h3>
          <p className="font-mono text-[9px] text-white/50 uppercase max-w-2xl leading-relaxed">TAMBAH CHART BARU, EDIT MAP PINPOINT, DAN PUBLISH KE DASHBOARD PENGUNJUNG SECARA LIVE.</p>
        </div>
        <button onClick={openAddForm} className="px-4 py-2 bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 hover:bg-fuchsia-500 hover:text-black font-mono text-[10px] uppercase tracking-widest transition-colors shrink-0">
          + ADD NEW COMPONENT
        </button>
      </div>

      {/* FORM EDITOR / CREATOR */}
      {(isAdding || editingCard) && (
        <form onSubmit={handleSubmitCard} className={`${glassBase} bg-black/80 border border-fuchsia-500/40 p-6 animate-in slide-in-from-top-4`}>
          <div className="flex justify-between items-center border-b border-white/10 pb-4 mb-4">
            <h4 className="font-mono text-xs text-fuchsia-400 uppercase tracking-widest">{isAdding ? 'CREATE NEW COMPONENT' : `EDITING: ${editingCard.identifier}`}</h4>
            <button type="button" onClick={() => { setIsAdding(false); setEditingCard(null); }} className="font-mono text-xs text-white/50 hover:text-white">CLOSE [X]</button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-4">
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="font-mono text-[9px] text-white/50 uppercase">IDENTIFIER ID</label>
              <input value={formData.identifier} onChange={e => setFormData({...formData, identifier: e.target.value})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400 uppercase" required disabled={!isAdding} />
            </div>
            <div className="flex flex-col gap-1 md:col-span-2">
              <label className="font-mono text-[9px] text-white/50 uppercase">CARD TITLE</label>
              <input value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400 uppercase" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="font-mono text-[9px] text-white/50 uppercase">GRID SPAN (1-12)</label>
              <input type="number" min="1" max="12" value={formData.colSpan} onChange={e => setFormData({...formData, colSpan: Number(e.target.value)})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400" required />
            </div>
            <div className="flex flex-col gap-1 md:col-span-1">
              <label className="font-mono text-[9px] text-white/50 uppercase">ORDER</label>
              <input type="number" value={formData.order} onChange={e => setFormData({...formData, order: Number(e.target.value)})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400" required />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-white/50 uppercase">COMPONENT TYPE</label>
              <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400 uppercase">
                <option value="CHART_BAR">CHART BAR</option>
                <option value="CHART_PIE">CHART PIE</option>
                <option value="CHART_RADAR">CHART RADAR</option>
                <option value="CHART_LINE">CHART LINE</option>
                <option value="CHART_AREA">CHART AREA</option>
                <option value="CHART_SCATTER">CHART SCATTER</option>
                <option value="CHART_COMPOSED">CHART COMPOSED</option>
                <option value="CHART_DONUT">CHART DONUT</option>
                <option value="MAP_BLOCK">MAP BLOCK</option>
                <option value="HOVER_LIST">HOVER LIST</option>
                <option value="TIMELINE">TIMELINE</option>
                <option value="PIPELINE_TRACKER">PIPELINE TRACKER</option>
                <option value="EXECUTIVE_SUMMARY">EXECUTIVE SUMMARY</option>
              </select>
            </div>
            <div className="flex flex-col gap-1">
              <label className="font-mono text-[9px] text-white/50 uppercase">CARD HOVER DESC (TOOLTIP)</label>
              <input value={formData.desc} onChange={e => setFormData({...formData, desc: e.target.value})} className="bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-fuchsia-400" placeholder="Biarkan kosong jika tidak perlu..." />
            </div>
          </div>

          <div className="flex flex-col gap-1 mb-4">
            <div className="flex justify-between">
              <label className="font-mono text-[9px] text-white/50 uppercase">DATA PAYLOAD (JSON)</label>
              <label className="font-mono text-[8px] text-cyan-400 uppercase">MAP PINS: {`{"pins": [{"lat": -6.2, "lng": 106.9, "title": "...", "desc": "..."}]}`}</label>
            </div>
            <textarea rows={8} value={formData.rawPayload} onChange={e => setFormData({...formData, rawPayload: e.target.value})} className="bg-black/40 border border-white/10 p-3 font-mono text-xs text-cyan-300 outline-none focus:border-fuchsia-400 custom-scrollbar" required />
          </div>

          <button type="submit" disabled={isSubmitting} className={`${glassButton} bg-fuchsia-500/20 text-fuchsia-400 border border-fuchsia-500/40 hover:bg-fuchsia-500 hover:text-black w-full py-3 text-xs`}>
            {isSubmitting ? (
              <>UPDATING DATABASE<span className="animate-pulse ml-1">_</span></>
            ) : (isAdding ? 'PUBLISH NEW COMPONENT' : 'SIMPAN PERUBAHAN')}
          </button>
        </form>
      )}

      {/* TABEL DAFTAR KARTU */}
      <div className={`${glassBase} bg-white/5 p-0 overflow-hidden`}>
        
        {/* HEADER TABEL */}
        <div className="grid grid-cols-12 gap-4 border-b-2 border-white/10 p-4 bg-white/5">
          <div className="col-span-1 font-mono text-[10px] text-white/50 uppercase text-center">ORDER</div>
          <div className="col-span-4 font-mono text-[10px] text-white/50 uppercase">CARD IDENTIFIER</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">TYPE</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase">GRID SIZE</div>
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase text-right">ACTIONS / STATUS</div>
        </div>

        {/* LOADING ANIMATION */}
        {isLoading && (
          <div className="p-10 flex justify-center items-center">
            <p className="font-mono text-[10px] text-fuchsia-400/70 tracking-[0.3em] uppercase">
              FETCHING CMS DATA<span className="animate-pulse ml-1">_</span>
            </p>
          </div>
        )}

        {/* PESAN KOSONG */}
        {!isLoading && cards.length === 0 && (
          <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase">
            NO CARDS IN DATABASE. FALLBACK ACTIVE.
          </div>
        )}

        {/* LOOPING DATA KARTU */}
        {!isLoading && cards.map((card, idx) => (
          <div key={card._id || idx} className={`grid grid-cols-12 gap-4 border-b border-white/5 p-4 items-center transition-colors ${!card.isVisible ? 'opacity-40 grayscale' : 'hover:bg-white/10'}`}>
            <div className="col-span-1 font-mono text-xs text-white/50 text-center">{card.order}</div>
            <div className="col-span-4 flex flex-col gap-1">
              <span className="font-mono text-xs text-white uppercase truncate">{card.identifier}</span>
              <span className="font-mono text-[8px] text-white/40 truncate">{card.title}</span>
            </div>
            <div className="col-span-2 font-mono text-[9px] text-cyan-400 uppercase bg-cyan-900/20 px-2 py-1 w-max border border-cyan-500/20 truncate">{card.type}</div>
            <div className="col-span-2 font-mono text-[9px] text-emerald-400 uppercase">{card.colSpan}/12 COL</div>
            <div className="col-span-3 flex justify-end items-center gap-2">
              <button onClick={() => handleEditClick(card)} className="px-3 py-1 bg-cyan-500/10 font-mono text-[9px] text-cyan-400 border border-cyan-500/20 hover:bg-cyan-500 hover:text-black uppercase transition-colors">EDIT</button>
              <button onClick={() => toggleVisibility(card._id, card.isVisible)} className={`px-3 py-1 font-mono text-[9px] uppercase border transition-colors ${card.isVisible ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20 hover:bg-emerald-500 hover:text-black' : 'bg-amber-500/10 text-amber-400 border-amber-500/20 hover:bg-amber-500 hover:text-black'}`}>
                {card.isVisible ? 'ON' : 'OFF'}
              </button>
              <button onClick={() => handleDeleteCard(card._id)} className="px-2 py-1 bg-rose-500/10 font-mono text-[9px] text-rose-400 border border-rose-500/20 hover:bg-rose-500 hover:text-black uppercase transition-colors">DEL</button>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}