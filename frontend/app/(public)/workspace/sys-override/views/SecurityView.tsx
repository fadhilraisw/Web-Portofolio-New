'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

const glassInput = "bg-black/40 border border-white/10 px-3 py-2 text-xs font-mono text-white outline-none focus:border-rose-400 w-full";

export default function SecurityView() {
  const [rules, setRules] = useState<any[]>([]); // Nanti disambung DB di Part 2
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ipAddress: '', status: 'BANNED', reason: '' });

  useEffect(() => { fetchRules(); }, []);

  const fetchRules = async () => {
    try {
      const response = await fetch('http://127.0.0.1:5555/api/security');
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to load rules');
      setRules(result.data);
    } catch (error) {
      console.error('Gagal mengambil aturan keamanan:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const response = await fetch('http://127.0.0.1:5555/api/security', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Failed to save rule');
      setFormData({ ipAddress: '', status: 'BANNED', reason: '' });
      fetchRules();
    } catch (error) {
      console.error('Gagal menyimpan aturan keamanan:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`http://127.0.0.1:5555/api/security/${id}`, { method: 'DELETE' });
      if (!response.ok) throw new Error('Failed to revoke rule');
      fetchRules();
    } catch (error) {
      console.error('Gagal mencabut aturan keamanan:', error);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10">
      
      <div className={`${glassBase} !bg-rose-500/10 p-6 flex flex-col border-l-4 border-rose-400 gap-2`}>
        <h3 className="font-mono text-[10px] tracking-[0.2em] text-rose-400 uppercase">FIREWALL & ACCESS CONTROLS</h3>
        <p className="font-mono text-[9px] text-white/50 uppercase leading-relaxed">KONTROL PENUH ATAS LALU LINTAS JARINGAN, BLOKIR IP MENCURIGAKAN, ATAU WHITELIST PENGUNJUNG PRIORITAS.</p>
      </div>

      <form onSubmit={handleSubmit} className={`${glassBase} bg-black/60 p-6`}>
        <h4 className="font-mono text-xs text-white uppercase tracking-widest mb-6 border-b border-white/10 pb-4">ADD NEW SECURITY DIRECTIVE</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-rose-400 uppercase">IP ADDRESS / IDENTIFIER</label>
            <input value={formData.ipAddress} onChange={e => setFormData({...formData, ipAddress: e.target.value})} className={glassInput} required placeholder="Cth: 192.168.1.100" />
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-rose-400 uppercase">DIRECTIVE STATUS</label>
            <select value={formData.status} onChange={e => setFormData({...formData, status: e.target.value})} className={glassInput}>
              <option value="BANNED">RESTRICT (BANNED)</option>
              <option value="WHITELISTED">ALLOW (WHITELISTED)</option>
              <option value="MONITOR">MONITOR THREAT</option>
            </select>
          </div>
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[9px] text-white/50 uppercase">REASON / NOTES</label>
            <input value={formData.reason} onChange={e => setFormData({...formData, reason: e.target.value})} className={glassInput} required placeholder="Cth: Brute force attempt" />
          </div>
        </div>

        <button type="submit" disabled={isSubmitting} className={`${glassButton} ${isSubmitting ? 'bg-white/10 text-white/30' : 'bg-rose-500/20 text-rose-400 border-rose-500/40 hover:bg-rose-500 hover:text-black'} w-full py-4 text-xs font-bold transition-colors`}>
          {isSubmitting ? <>ENFORCING PROTOCOL<span className="animate-pulse ml-1">_</span></> : 'EXECUTE DIRECTIVE'}
        </button>
      </form>

      <div className={`${glassBase} p-0 overflow-hidden`}>
        <div className="grid grid-cols-12 gap-4 border-b border-white/10 p-4 bg-white/5">
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">IP ADDRESS</div>
          <div className="col-span-3 font-mono text-[10px] text-white/50 uppercase">STATUS</div>
          <div className="col-span-4 font-mono text-[10px] text-white/50 uppercase">REASON</div>
          <div className="col-span-2 font-mono text-[10px] text-white/50 uppercase text-right">ACTION</div>
        </div>

        {isLoading && <div className="p-10 flex justify-center items-center"><p className="font-mono text-[10px] text-rose-400/70 tracking-[0.3em] uppercase">FETCHING PROTOCOLS<span className="animate-pulse ml-1">_</span></p></div>}
        {!isLoading && rules.length === 0 && <div className="p-8 text-center font-mono text-[10px] text-white/40 uppercase">NO ACTIVE RESTRICTIONS. SYSTEM SECURE.</div>}

        {!isLoading && rules.map((r, idx) => (
          <div key={r._id || idx} className="grid grid-cols-12 gap-4 border-b border-white/5 p-4 items-center hover:bg-white/10 transition-colors">
            <div className="col-span-3 font-mono text-xs text-white uppercase truncate">{r.ipAddress}</div>
            <div className="col-span-3 font-mono text-[9px] uppercase"><span className={`px-2 py-1 ${r.status === 'BANNED' ? 'bg-rose-500/20 text-rose-400' : r.status === 'WHITELISTED' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'}`}>{r.status}</span></div>
            <div className="col-span-4 font-mono text-[9px] text-white/60 uppercase truncate">{r.reason}</div>
            <div className="col-span-2 flex justify-end">
              <button onClick={() => handleDelete(r._id)} className="px-3 py-1 bg-white/5 font-mono text-[9px] text-white/50 border border-white/20 hover:bg-white hover:text-black uppercase transition-colors">REVOKE</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}