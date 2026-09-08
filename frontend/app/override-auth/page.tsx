'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OverrideAuth() {
  const [passcode, setPasscode] = useState('');
  const [status, setStatus] = useState('AWAITING INPUT...');
  const [isError, setIsError] = useState(false);
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('VERIFYING CLEARANCE...');
    setIsError(false);

    // Simulasi verifikasi (Nanti diganti dengan panggilan API NextAuth / sesi)
    setTimeout(() => {
      // Ganti 'RAIS2026' dengan sandi rahasiamu nanti
      if (passcode === 'RAIS2026') {
        setStatus('CLEARANCE ACCEPTED. REDIRECTING...');
        // Simulasi set cookie (Di tahap backend, ini dilakukan oleh server)
        document.cookie = "admin_session=true; path=/"; 
        setTimeout(() => router.push('/workspace/sys-override'), 1000);
      } else {
        setStatus('ACCESS DENIED. INVALID CREDENTIALS.');
        setIsError(true);
        setPasscode('');
      }
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center p-4 relative overflow-hidden">
      {/* Efek Garis Scanline Radar */}
      <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px] pointer-events-none z-0"></div>
      
      <div className="relative z-10 w-full max-w-md flex flex-col gap-6 p-8 border border-white/10 bg-[#09090b]/80 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1),_10px_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-md rounded-none">
        
        <div className="flex flex-col items-center text-center gap-2 border-b border-white/10 pb-6">
          <div className="w-12 h-12 bg-rose-500/20 border border-rose-500/50 flex items-center justify-center mb-2 shadow-[0_0_15px_rgba(244,63,94,0.3)]">
            <span className="font-mono text-rose-500 text-xl font-bold animate-pulse">!</span>
          </div>
          <h1 className="font-mono text-xl tracking-[0.3em] text-white uppercase">RESTRICTED AREA</h1>
          <p className="font-mono text-[9px] tracking-widest text-white/40 uppercase">
            LEVEL 5 AUTHORIZATION REQUIRED
          </p>
        </div>

        <form onSubmit={handleLogin} className="flex flex-col gap-6">
          <div className="flex flex-col gap-2">
            <label className="font-mono text-[10px] tracking-widest text-cyan-400 uppercase">
              ENTER OVERRIDE PASSCODE
            </label>
            <input 
              type="password" 
              value={passcode}
              onChange={(e) => setPasscode(e.target.value)}
              className="w-full bg-white/5 border border-white/20 px-4 py-3 font-mono text-white text-center tracking-[0.5em] focus:outline-none focus:border-cyan-400 focus:bg-cyan-500/10 transition-colors rounded-none"
              autoFocus
            />
          </div>

          <div className="flex flex-col items-center gap-4">
            <p className={`font-mono text-[9px] tracking-widest uppercase ${isError ? 'text-rose-500' : 'text-white/50'}`}>
              STATUS: {status}
            </p>
            <button 
              type="submit"
              className="w-full px-4 py-4 bg-white/10 text-white font-mono text-[10px] tracking-widest uppercase hover:bg-white hover:text-black transition-colors rounded-none border-0 shadow-[inset_1px_1px_1px_rgba(255,255,255,0.2)]"
            >
              INITIALIZE OVERRIDE
            </button>
          </div>
        </form>

      </div>
    </div>
  );
}