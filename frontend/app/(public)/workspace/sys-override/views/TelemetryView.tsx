'use client';

import { useState, useEffect } from 'react';
import { glassBase, glassButton } from '../page';

export default function TelemetryView() {
  const [logs, setLogs] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => { fetchLogs(); }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch('http://127.0.0.1:5555/api/telemetry');
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
      await fetch('http://127.0.0.1:5555/api/telemetry/clear', { method: 'DELETE' });
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
        <button onClick={clearLogs} className="px-4 py-2 bg-rose-500/10 text-rose-400 border border-rose-500/30 hover:bg-rose-500 hover:text-black font-mono text-[9px] tracking-widest uppercase transition-colors">
          PURGE LOGS
        </button>
      </div>

      <div className={`${glassBase} flex-1 overflow-y-auto custom-scrollbar bg-[#050505] p-6 font-mono text-[10px] uppercase border-emerald-500/20 shadow-[inset_0_0_20px_rgba(16,185,129,0.1)] relative`}>
        <div className="absolute top-0 left-0 w-full h-full pointer-events-none bg-[linear-gradient(rgba(16,185,129,0.05)_1px,transparent_1px)] bg-[size:100%_4px] opacity-30"></div>
        
        {isLoading && <p className="text-emerald-400/50 animate-pulse">ESTABLISHING CONNECTION TO TERMINAL...</p>}
        {!isLoading && logs.length === 0 && <p className="text-emerald-400/50">NO INCOMING CONNECTIONS DETECTED.</p>}
        
        <div className="flex flex-col gap-3 relative z-10">
          {!isLoading && logs.map((log, i) => (
            <div key={i} className="flex flex-col sm:flex-row gap-2 sm:gap-6 border-b border-emerald-500/10 pb-2 hover:bg-emerald-500/5 transition-colors">
              <span className="text-white/40 w-32 shrink-0">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className="text-emerald-300 w-56 shrink-0">USER: {log.visitorName || log.email || 'GUEST'} {log.visitorEmail && `(${log.visitorEmail})`}</span>
              <span className="text-cyan-400 w-24 shrink-0">[{log.action}]</span>
              <span className="text-white/80">{log.details}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}