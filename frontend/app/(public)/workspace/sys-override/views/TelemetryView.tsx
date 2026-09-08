'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

export default function TelemetryView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [emailFilter, setEmailFilter] = useState('');
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5555';

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const query = emailFilter ? `?email=${encodeURIComponent(emailFilter)}&limit=200` : '?limit=200';
      const res = await fetch(`${api}/api/telemetry${query}`);
      if (res.ok) {
        const result = await res.json();
        if (result.success) setLogs(result.data);
      }
    } catch (error) { console.error("Gagal ambil log:", error); } 
    finally { setIsLoading(false); }
  };

  const clearLogs = async () => {
    if (!confirm('Peringatan: Aksi ini akan memusnahkan semua riwayat log pengunjung. Lanjutkan?')) return;
    try {
      await fetch(`${api}/api/telemetry/clear`, { method: 'DELETE' });
      fetchLogs();
    } catch (error) { console.error("Gagal hapus log:", error); }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 pb-10 h-full">
      <div className={`${glassBase} !bg-emerald-500/10 p-6 flex justify-between items-center border-l-4 border-emerald-400`}>
        <div>
          <h3 className="font-mono text-[10px] tracking-[0.2em] text-emerald-400 uppercase">TELEMETRY & LOGS</h3>
          <p className="font-mono text-[9px] text-white/50 uppercase">LIVE TRACKING AKTIVITAS PENGUNJUNG DI DASHBOARD UTAMA.</p>
        </div>
        <div className="flex gap-2">
          <input value={emailFilter} onChange={(event) => setEmailFilter(event.target.value)} placeholder="FILTER EMAIL" className="bg-black/40 border border-white/10 px-3 py-2 font-mono text-[9px] text-white" />
          <button onClick={() => fetchLogs()} className="px-4 py-2 bg-cyan-500/10 text-cyan-400 border border-cyan-500/30 font-mono text-[9px] tracking-widest uppercase">FILTER</button>
          <button onClick={clearLogs} className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-black font-mono text-[9px] tracking-widest uppercase transition-colors">PURGE LOGS</button>
        </div>
      </div>

      <div className={`${glassBase} flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-6 font-mono text-[10px] uppercase border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] relative`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30"></div>
        
        {isLoading && <p className="text-emerald-400/50 animate-pulse">ESTABLISHING CONNECTION TO TERMINAL...</p>}
        {!isLoading && logs.length === 0 && <p className="text-emerald-400/50">NO INCOMING CONNECTIONS DETECTED.</p>}
        
        <div className="flex flex-col gap-3 relative z-10">
          {!isLoading && logs.map((log, i) => (
            <div key={i} className="grid grid-cols-1 xl:grid-cols-[180px_1.4fr_1.2fr_1fr_2fr] gap-2 border-b border-emerald-500/10 pb-3 hover:bg-emerald-500/5 transition-colors">
              <span className="text-white/40">[{new Date(log.timestamp).toLocaleString()}]</span>
              <span className="text-emerald-300">USER: {log.visitorName || log.identity?.name || 'GUEST'}<br /><span className="text-[9px] text-white/50">{log.visitorEmail || log.identity?.email || 'NO EMAIL'} | {log.identity?.company || 'NO COMPANY'}</span></span>
              <span className="text-cyan-400">IP: {log.ipAddress || 'UNKNOWN'}<br /><span className="text-[9px] text-white/50">{log.userAgent?.slice(0, 40) || 'NO USER AGENT'}</span></span>
              <span className="text-amber-300">[{log.action}]<br /><span className="text-[9px] text-white/50">{log.sessionId || 'NO SESSION'}</span></span>
              <span className="text-white/80">{log.details}<br /><span className="text-[9px] text-white/50">{log.identity?.position || ''} {log.identity?.goal ? `| GOAL: ${log.identity.goal}` : ''}</span></span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}