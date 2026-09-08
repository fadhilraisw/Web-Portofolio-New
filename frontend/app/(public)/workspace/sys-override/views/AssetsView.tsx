import { useEffect, useState } from 'react';
import { glassBase, glassButton } from '../page';

export default function AssetsView() {
  const [asset, setAsset] = useState<any>(null);
  const [file, setFile] = useState<File | null>(null);
  const [profile, setProfile] = useState({ name: '', title: '', email: '' });
  const [isSaving, setIsSaving] = useState(false);
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5555';

  useEffect(() => {
    fetch(`${api}/api/assets`).then(async (response) => {
      const result = await response.json();
      if (response.ok && result.success) {
        setAsset(result.data);
        setProfile({ name: result.data?.name || '', title: result.data?.title || '', email: result.data?.email || '' });
      }
    }).catch((error) => console.error('Gagal mengambil assets:', error));
  }, [api]);

  const saveAsset = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsSaving(true);
    try {
      const payload = new FormData();
      Object.entries(profile).forEach(([key, value]) => payload.append(key, value));
      if (file) payload.append('cvFile', file);
      const response = await fetch(`${api}/api/assets`, { method: 'PUT', body: payload });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Asset update failed');
      setAsset(result.data);
    } catch (error) {
      console.error('Gagal menyimpan assets:', error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className={`${glassBase} bg-amber-500/10 p-6`}><h3 className="font-mono text-[10px] tracking-[0.2em] text-amber-400 uppercase mb-2">CRITICAL OVERWRITE PROTOCOL</h3><p className="font-mono text-xs text-white/70 uppercase">UPLOADING A NEW MASTER CV WILL PERMANENTLY OVERWRITE THE EXISTING FILE.</p></div>
      <form onSubmit={saveAsset} className={`${glassBase} bg-black/60 p-6 flex flex-col gap-4`}>
        <h3 className="font-mono text-xs text-cyan-400 uppercase tracking-widest">PROFILE IDENTITY RECORD</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input value={profile.name} onChange={(e) => setProfile({ ...profile, name: e.target.value })} placeholder="FULL NAME" className="bg-black/40 border border-white/10 px-3 py-2 font-mono text-xs text-white" required />
          <input value={profile.title} onChange={(e) => setProfile({ ...profile, title: e.target.value })} placeholder="TITLE" className="bg-black/40 border border-white/10 px-3 py-2 font-mono text-xs text-white" required />
          <input value={profile.email} onChange={(e) => setProfile({ ...profile, email: e.target.value })} placeholder="EMAIL" type="email" className="bg-black/40 border border-white/10 px-3 py-2 font-mono text-xs text-white" required />
        </div>
        <button disabled={isSaving} className={`${glassButton} bg-cyan-500/20 text-cyan-400`}>{isSaving ? 'UPLOADING...' : 'SAVE IDENTITY & CV'}</button>
      </form>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${glassBase} bg-white/5 items-center justify-center p-12 min-h-[300px]`}><h4 className="font-mono text-sm tracking-widest text-white uppercase mb-2">INITIALIZE UPLOAD SEQUENCE</h4><input onChange={(e) => setFile(e.target.files?.[0] || null)} type="file" accept=".pdf" className="font-mono text-[10px] text-white/50" /></div>
        <div className={`${glassBase} bg-cyan-500/5 p-6 flex flex-col justify-center`}><h3 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-6">CURRENT MASTER RECORD</h3><div className="flex flex-col mb-6"><span className="font-mono text-lg text-white uppercase">{asset?.cvFileUrl || 'NO CV UPLOADED'}</span></div>{asset?.cvFileUrl && <a href={asset.cvFileUrl} target="_blank" rel="noreferrer" className={`${glassButton} bg-white/10 text-white w-full text-center hover:bg-white hover:text-black`}>DOWNLOAD CURRENT RECORD</a>}</div>
      </div>
    </div>
  );
}