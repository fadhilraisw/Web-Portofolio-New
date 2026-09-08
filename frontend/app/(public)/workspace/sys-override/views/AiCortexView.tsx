import { useEffect, useState } from 'react';
import { glassBase, glassButton } from '../page';

export default function AiCortexView() {
  const [records, setRecords] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', prompt: '', strategy: '' });
  const api = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5555';
  const loadRecords = async () => {
    const response = await fetch(`${api}/api/ai-cortex`);
    const result = await response.json();
    if (response.ok && result.success) setRecords(result.data);
  };
  useEffect(() => { loadRecords().catch((error) => console.error('Gagal mengambil strategi AI:', error)); }, [api]);

  const saveRecord = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(`${api}/api/ai-cortex`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const result = await response.json();
      if (!response.ok || !result.success) throw new Error(result.message || 'Strategy save failed');
      setForm({ name: '', prompt: '', strategy: '' });
      await loadRecords();
    } catch (error) { console.error('Gagal menyimpan strategi AI:', error); }
  };

  const deleteRecord = async (id: string) => {
    await fetch(`${api}/api/ai-cortex/${id}`, { method: 'DELETE' });
    await loadRecords();
  };

  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500 h-[600px]">
      <div className={`${glassBase} bg-purple-500/10 p-6 flex-1 relative overflow-hidden flex flex-col justify-between`}>
        <div className="flex justify-between items-center mb-4 border-b border-purple-500/20 pb-4"><div><h3 className="font-mono text-[10px] tracking-[0.2em] text-purple-400 uppercase">AI ANALYTICS ENGINE</h3></div></div>
        <div className="flex-1 overflow-y-auto custom-scrollbar flex flex-col gap-4 p-2">
          {records.map((record) => <div key={record._id} className="bg-purple-900/20 border border-purple-500/30 p-4 text-white/80 font-mono text-xs uppercase flex justify-between gap-4"><span><b>{record.name}</b><br />{record.strategy}<br /><span className="text-white/50">{record.prompt}</span></span><button onClick={() => deleteRecord(record._id)} className="text-rose-400">DEL</button></div>)}
          {!records.length && <div className="text-white/50 font-mono text-xs uppercase">NO STRATEGIES IN DATABASE.</div>}
        </div>
        <form onSubmit={saveRecord} className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-2"><input required value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="STRATEGY NAME" className="bg-white/5 border border-white/10 px-4 py-3 font-mono text-white text-xs" /><input required value={form.strategy} onChange={(e) => setForm({ ...form, strategy: e.target.value })} placeholder="STRATEGY" className="bg-white/5 border border-white/10 px-4 py-3 font-mono text-white text-xs" /><input required value={form.prompt} onChange={(e) => setForm({ ...form, prompt: e.target.value })} placeholder="PROMPT" className="bg-white/5 border border-white/10 px-4 py-3 font-mono text-white text-xs" /><button className={`${glassButton} bg-white/10 text-white hover:bg-white hover:text-black md:col-span-3`}>SAVE STRATEGY</button></form>
      </div>
    </div>
  );
}