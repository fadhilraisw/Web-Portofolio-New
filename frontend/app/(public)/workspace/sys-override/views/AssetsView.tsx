import { glassBase, glassButton } from '../page';

export default function AssetsView() {
  return (
    <div className="flex flex-col gap-6 animate-in fade-in duration-500">
      <div className={`${glassBase} bg-amber-500/10 p-6`}><h3 className="font-mono text-[10px] tracking-[0.2em] text-amber-400 uppercase mb-2">CRITICAL OVERWRITE PROTOCOL</h3><p className="font-mono text-xs text-white/70 uppercase">UPLOADING A NEW MASTER CV WILL PERMANENTLY OVERWRITE THE EXISTING FILE.</p></div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className={`${glassBase} bg-white/5 items-center justify-center p-12 min-h-[300px] cursor-pointer`}><h4 className="font-mono text-sm tracking-widest text-white uppercase mb-2">INITIALIZE UPLOAD SEQUENCE</h4><input type="file" accept=".pdf" className="font-mono text-[10px] text-white/50" /></div>
        <div className={`${glassBase} bg-cyan-500/5 p-6 flex flex-col justify-center`}><h3 className="font-mono text-[10px] tracking-[0.2em] text-white/50 uppercase mb-6">CURRENT MASTER RECORD</h3><div className="flex flex-col mb-6"><span className="font-mono text-lg text-white uppercase">RAIS_MASTER_CV.PDF</span></div><button className={`${glassButton} bg-white/10 text-white w-full hover:bg-white hover:text-black`}>DOWNLOAD CURRENT RECORD</button></div>
      </div>
    </div>
  );
}