'use client';
import React from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar,
  LineChart, Line, AreaChart, Area, ScatterChart, Scatter, ComposedChart, CartesianGrid, Legend
} from 'recharts';

const ResumeMap = dynamic(() => import('@/components/workspace/ResumeMap'), { ssr: false });

const glassBase = "flex flex-col rounded-none border-0 p-6 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),_10px_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[inset_2px_2px_2px_rgba(255,255,255,0.4),_20px_20px_40px_rgba(0,0,0,0.9)] hover:z-20 relative bg-white/5";

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#09090b]/95 border-l-2 border-cyan-400 p-4 shadow-[10px_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in zoom-in-95 duration-200">
        <p className="font-mono text-sm text-white uppercase">{data.name || data.subject}</p>
        {data.desc && <p className="font-mono text-[10px] text-white/60 uppercase mt-1 max-w-[200px] leading-relaxed">{data.desc}</p>}
        <p className="font-mono text-lg text-cyan-400 mt-2">{payload[0].value || data.A || data.score}%</p>
      </div>
    );
  }
  return null;
};

const HoverListItem = ({ label, desc }: { label: string, desc: string }) => (
  <li className="group/item relative flex items-center gap-2 cursor-help w-max">
    <div className="w-1.5 h-1.5 bg-white rounded-none transition-transform group-hover/item:scale-[2] group-hover/item:bg-cyan-400"></div>
    <span className="group-hover/item:text-cyan-200 transition-colors">{label}</span>
    <div className="absolute left-0 bottom-full mb-2 hidden group-hover/item:flex flex-col bg-[#09090b]/95 border-l-2 border-white/50 p-3 shadow-[10px_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl w-56 z-50 animate-in slide-in-from-bottom-2 duration-300">
      <p className="font-mono text-[9px] text-white/80 uppercase leading-relaxed">{desc}</p>
    </div>
  </li>
);

export default function DynamicCardRenderer({ card, visitor, visitorGoal, isHR, isTechLead }: any) {
  if (!card.isVisible) return null;

  // Rumus ukuran Grid
  const gridSpan = `md:col-span-${card.colSpan > 6 ? (card.colSpan === 12 ? 'full' : '2') : '1'} xl:col-span-${card.colSpan === 12 ? 'full' : Math.ceil(card.colSpan / 4)}`;

  return (
    <div className={`${gridSpan} ${glassBase} group/cardblock ${card.type === 'MAP_BLOCK' ? '!bg-indigo-500/10' : ''} ${card.type === 'CHART_PIE' ? '!bg-blue-500/10 items-center' : ''} ${card.type === 'CHART_RADAR' ? '!bg-rose-500/10 items-center' : ''} ${card.type === 'WAFFLE_MATRIX' ? '!bg-fuchsia-500/10' : ''}`}>
      
      {/* HEADER CARD UMUM */}
      {card.type !== 'EXECUTIVE_SUMMARY' && card.type !== 'ACTION_BUTTON' && card.type !== 'MAP_BLOCK' && card.type !== 'PIPELINE_TRACKER' && (
        <h3 className={`mb-6 font-mono text-[10px] tracking-[0.2em] text-white uppercase ${card.type === 'CHART_PIE' || card.type === 'CHART_RADAR' ? 'w-full text-left mb-2' : ''}`}>{card.title}</h3>
      )}

      {/* 1. EXECUTIVE SUMMARY */}
      {card.type === 'EXECUTIVE_SUMMARY' && (
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 w-full">
          <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-0 bg-white/10 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.3),_5px_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-110">
            <Image src="/assets/images/profile.png" alt="Rais" fill className="object-cover object-top" />
          </div>
          <div className="flex w-full flex-col text-center sm:text-left mt-4 sm:mt-0">
            <h2 className="font-mono text-2xl tracking-widest text-white uppercase">{visitor?.name || 'FADHIL RAIS WAHYUDI'}</h2>
            <p className="mt-1 font-mono text-xs tracking-[0.2em] text-white/60 uppercase">AI UI DEVELOPER / DATA ENGINEER</p>
            <p className="mt-4 font-mono text-[10px] tracking-wider text-white/80 leading-relaxed uppercase min-h-[40px]">
              {isHR ? card.dataPayload.hr : isTechLead ? card.dataPayload.techLead : card.dataPayload.default}
            </p>
            <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3 font-mono text-[9px] tracking-widest text-white uppercase">
              <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">BEKASI IDN</span>
              <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">{visitor?.email || 'RAIS@EXAMPLE.COM'}</span>
              <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">CCIT FTUI & AEU</span>
            </div>
          </div>
        </div>
      )}

      {/* 2. ACTION BUTTON */}
      {card.type === 'ACTION_BUTTON' && (
        <div className="flex flex-col items-center justify-center h-full w-full">
          <p className="mb-4 text-center font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase">TAILORED FOR {visitorGoal || 'EVALUATION'}</p>
          <button className="w-full rounded-none border-0 px-4 py-3 font-mono text-[10px] tracking-widest text-black bg-white hover:bg-cyan-400 transition-colors uppercase shadow-[inset_2px_2px_2px_rgba(255,255,255,1),_5px_5px_15px_rgba(0,0,0,0.4)]">
            {card.dataPayload?.actionText || 'DOWNLOAD MASTER CV'}
          </button>
        </div>
      )}

      {/* 3. TIMELINE */}
      {card.type === 'TIMELINE' && (
        <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-0.5 before:bg-white/20">
          {card.dataPayload.map((item: any, idx: number) => (
            <div key={idx} className="relative pl-5 group/timeline cursor-default">
              <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-none border-0 bg-white ${idx===0 ? 'shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20'} transition-transform duration-300 group-hover/timeline:scale-150 group-hover/timeline:bg-${item.color || 'cyan'}-400`}></div>
              <h4 className={`font-mono text-xs text-white uppercase group-hover/timeline:text-${item.color || 'cyan'}-300 transition-colors`}>{item.title}</h4>
              <p className="font-mono text-[9px] tracking-widest text-white/60 uppercase mt-1">{item.desc}</p>
            </div>
          ))}
        </div>
      )}

      {/* 4. PIPELINE TRACKER */}
      {card.type === 'PIPELINE_TRACKER' && (
        <div className="flex flex-col w-full -mx-6 -mt-6">
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center w-full">
            <span className="font-mono text-[10px] tracking-[0.2em] text-cyan-400 uppercase">{card.title}</span>
            <div className="h-1.5 w-1.5 bg-cyan-400 animate-pulse shadow-[0_0_5px_cyan]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 w-full">
            <div className="p-4 border-r border-white/5">
               <p className="font-mono text-[8px] text-white/40 uppercase mb-3 tracking-widest">EXTERNAL APPLICATIONS</p>
               <div className="flex flex-col gap-2">
                 {card.dataPayload?.external?.map((job: any, i: number) => (
                   <div key={i} className="flex justify-between items-center p-2 bg-white/5 font-mono text-[9px] group cursor-default">
                     <span className="text-white uppercase">{job.company} <span className="text-white/40">/ {job.role}</span></span>
                     <span className={`text-${job.color}-400 shadow-[0_0_8px_rgba(255,255,255,0.2)] bg-${job.color}-400/10 px-2 py-0.5`}>{job.status}</span>
                   </div>
                 ))}
               </div>
            </div>
            <div className="p-4">
               <p className="font-mono text-[8px] text-white/40 uppercase mb-3 tracking-widest">FREELANCE / GIGS</p>
               <div className="flex flex-col gap-2">
                 {card.dataPayload?.freelance?.map((gig: any, i: number) => (
                   <div key={i} className="flex justify-between items-center p-2 bg-white/5 font-mono text-[9px] group cursor-default">
                     <span className="text-white uppercase">{gig.project} <span className="text-white/40">/ {gig.client}</span></span>
                     <span className={`text-${gig.color}-400 shadow-[0_0_8px_rgba(255,255,255,0.2)] bg-${gig.color}-400/10 px-2 py-0.5`}>{gig.status}</span>
                   </div>
                 ))}
               </div>
            </div>
          </div>
        </div>
      )}

      {/* 5. CHART BAR */}
      {card.type === 'CHART_BAR' && (
        <div className="h-48 w-full transition-transform duration-500 group-hover/cardblock:scale-[1.03]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={card.dataPayload} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
              <XAxis type="number" hide />
              <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 8, fontFamily: 'monospace' }} width={90} />
              <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
              <Bar dataKey="score" fill="#ffffff" radius={[0, 0, 0, 0]} barSize={8} className="transition-all duration-300 hover:fill-cyan-400" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* 6. CHART PIE */}
      {card.type === 'CHART_PIE' && (
        <>
          <div className="h-28 w-full transition-transform duration-500 group-hover/cardblock:scale-[1.1]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={card.dataPayload} innerRadius={35} outerRadius={50} paddingAngle={2} dataKey="value" stroke="none">
                  {card.dataPayload.map((entry: any, index: number) => <Cell key={`cell-${index}`} fill={entry.color} className="hover:opacity-80 transition-opacity" />)}
                </Pie>
                <Tooltip content={<CustomChartTooltip />} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 flex flex-col w-full gap-2 font-mono text-[8px] tracking-widest text-white/60 uppercase">
            {card.dataPayload.map((d: any) => (
              <span key={d.name} className="flex justify-between items-center group/legend cursor-help relative">
                <span className="flex items-center gap-2"><div className="w-1.5 h-1.5" style={{ backgroundColor: d.color }}></div><span className="group-hover/legend:text-white transition-colors">{d.name}</span></span>
                <span>{d.value} PCT</span>
              </span>
            ))}
          </div>
        </>
      )}

      {/* 7. CHART RADAR */}
      {card.type === 'CHART_RADAR' && (
        <div className="h-40 w-full transition-transform duration-500 group-hover/cardblock:scale-[1.1]">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart cx="50%" cy="50%" outerRadius="70%" data={card.dataPayload}>
              <PolarGrid stroke="rgba(255,255,255,0.2)" />
              <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 7, fontFamily: 'monospace' }} />
              <Tooltip content={<CustomChartTooltip />} />
              <Radar name="Score" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} className="hover:fill-cyan-400 hover:stroke-cyan-400 transition-colors" />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Generic chart cards are driven entirely by database payload/configuration. */}
      {['CHART_LINE', 'CHART_AREA', 'CHART_SCATTER', 'CHART_COMPOSED', 'CHART_DONUT'].includes(card.type) && (
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            {card.type === 'CHART_LINE' ? (
              <LineChart data={card.dataPayload || []}><CartesianGrid stroke="rgba(255,255,255,0.1)" /><XAxis dataKey={card.xKey || 'name'} tick={{ fill: '#aaa', fontSize: 8 }} /><YAxis tick={{ fill: '#aaa', fontSize: 8 }} /><Tooltip content={<CustomChartTooltip />} /><Legend /><Line type="monotone" dataKey={card.yKey || 'value'} stroke="#22d3ee" strokeWidth={2} /></LineChart>
            ) : card.type === 'CHART_AREA' ? (
              <AreaChart data={card.dataPayload || []}><CartesianGrid stroke="rgba(255,255,255,0.1)" /><XAxis dataKey={card.xKey || 'name'} tick={{ fill: '#aaa', fontSize: 8 }} /><YAxis tick={{ fill: '#aaa', fontSize: 8 }} /><Tooltip content={<CustomChartTooltip />} /><Area type="monotone" dataKey={card.yKey || 'value'} stroke="#34d399" fill="#34d399" fillOpacity={0.25} /></AreaChart>
            ) : card.type === 'CHART_SCATTER' ? (
              <ScatterChart><CartesianGrid stroke="rgba(255,255,255,0.1)" /><XAxis type="number" dataKey={card.xKey || 'x'} tick={{ fill: '#aaa', fontSize: 8 }} /><YAxis type="number" dataKey={card.yKey || 'y'} tick={{ fill: '#aaa', fontSize: 8 }} /><Tooltip content={<CustomChartTooltip />} /><Scatter data={card.dataPayload || []} fill="#f472b6" /></ScatterChart>
            ) : card.type === 'CHART_COMPOSED' ? (
              <ComposedChart data={card.dataPayload || []}><CartesianGrid stroke="rgba(255,255,255,0.1)" /><XAxis dataKey={card.xKey || 'name'} tick={{ fill: '#aaa', fontSize: 8 }} /><YAxis tick={{ fill: '#aaa', fontSize: 8 }} /><Tooltip content={<CustomChartTooltip />} /><Bar dataKey={card.barKey || 'bar'} fill="#a78bfa" /><Line dataKey={card.lineKey || 'line'} stroke="#22d3ee" /><Area dataKey={card.areaKey || 'area'} fill="#34d399" fillOpacity={0.2} /></ComposedChart>
            ) : (
              <PieChart><Pie data={card.dataPayload || []} innerRadius={card.type === 'CHART_DONUT' ? 38 : 0} outerRadius={58} dataKey={card.yKey || 'value'} stroke="none">{(card.dataPayload || []).map((entry: any, index: number) => <Cell key={index} fill={entry.color || ['#22d3ee', '#a78bfa', '#34d399', '#f472b6'][index % 4]} />)}</Pie><Tooltip content={<CustomChartTooltip />} /></PieChart>
            )}
          </ResponsiveContainer>
        </div>
      )}

      {/* 8. MAP BLOCK */}
      {card.type === 'MAP_BLOCK' && (
        <div className="w-full h-full flex flex-col">
          <div className="flex justify-between items-center mb-4 z-10 relative">
            <h3 className="font-mono text-[10px] tracking-[0.2em] text-white uppercase">{card.title}</h3>
            <span className="font-mono text-[8px] tracking-widest text-cyan-400 uppercase animate-pulse">LIVE MAP DATA</span>
          </div>
          <div className="relative h-64 w-full z-0 opacity-80 transition-opacity duration-500 group-hover/cardblock:opacity-100">
            <ResumeMap />
          </div>
        </div>
      )}

      {/* 9. WAFFLE MATRIX */}
      {card.type === 'WAFFLE_MATRIX' && (
        <div className="flex flex-col w-full items-center relative group/waffle">
          <h3 className="mb-4 font-mono text-[10px] tracking-[0.2em] text-white uppercase w-full text-left">{isHR ? 'CULTURAL FIT & DISCIPLINE' : isTechLead ? 'SYSTEMS ARCHITECTURE' : 'HYBRID CAPABILITY'}</h3>
          <p className="mb-4 font-mono text-[7px] tracking-[0.2em] text-white/40 uppercase text-center">EACH DOT = 1K PROFESSIONALS</p>
          <div className="absolute top-10 left-1/2 -translate-x-1/2 opacity-0 group-hover/waffle:opacity-100 transition-all duration-300 pointer-events-none bg-[#09090b]/95 border-l-2 border-white p-3 shadow-2xl backdrop-blur-xl w-56 z-50">
            <p className="font-mono text-[9px] text-white/80 text-center uppercase leading-relaxed">
              Only 1 in 10,000 developers possess this exact intersection of Enterprise UI and ML architecture.
            </p>
          </div>
          <div className="flex flex-wrap gap-[2px] w-full justify-center content-start max-w-[200px]">
            {Array.from({ length: 400 }).map((_, i) => {
              let dotClass = 'bg-white/10'; 
              if (i > 320 && i <= 370) dotClass = 'bg-white/30'; 
              if (i > 370 && i < 399) dotClass = 'bg-white/60'; 
              if (i === 399) dotClass = 'bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-pulse z-10 relative'; 
              return <div key={i} className={`h-1.5 w-1.5 rounded-none transition-all duration-200 hover:scale-[3] hover:bg-cyan-400 hover:z-20 hover:shadow-[0_0_10px_cyan] cursor-crosshair ${dotClass}`} />;
            })}
          </div>
          <div className="mt-6 w-full grid grid-cols-1 sm:grid-cols-2 gap-y-2 gap-x-2 font-mono text-[7px] tracking-widest text-white/60 uppercase">
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 bg-white/10 rounded-none shrink-0"></div> STANDARD</div>
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 bg-white/30 rounded-none shrink-0"></div> UI EXPERT</div>
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 bg-white/60 rounded-none shrink-0"></div> ML ENGINEER</div>
            <div className="flex items-center gap-2"><div className="h-1.5 w-1.5 bg-white shadow-[0_0_4px_white] rounded-none shrink-0"></div> AI UI HYBRID</div>
          </div>
        </div>
      )}

      {/* 10. MCU METRICS */}
      {card.type === 'MCU_METRICS' && (
        <div className="flex flex-col gap-2 font-mono">
          {card.dataPayload.map((mcu: any, i: number) => (
            <div key={i} className={`flex justify-between ${mcu.highlight ? 'text-xs text-white border-b-2' : 'text-[10px] text-white/70 border-b-2'} border-white/5 py-2 cursor-help group/mcu relative`}>
              <span className="text-white/50">{mcu.label}</span><span className={mcu.highlight ? 'text-white' : ''}>{mcu.value}</span>
              <div className="absolute right-0 bottom-full mb-1 hidden group-hover/mcu:block bg-[#09090b]/90 border border-white/20 p-2 z-50 text-[8px] text-white/80 w-32 text-right">{mcu.desc}</div>
            </div>
          ))}
        </div>
      )}

      {/* 11. HOVER LIST */}
      {card.type === 'HOVER_LIST' && (
        <ul className="flex flex-col gap-3 font-mono text-[10px] tracking-widest text-white/80 uppercase">
          {card.dataPayload?.items?.map((item: any, i: number) => (
            <HoverListItem key={i} label={item.label} desc={item.desc} />
          ))}
        </ul>
      )}

    </div>
  );
}