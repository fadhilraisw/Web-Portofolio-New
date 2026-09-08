'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import dynamic from 'next/dynamic';
import { 
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, 
  PieChart, Pie, Cell, 
  RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar 
} from 'recharts';
import DynamicCardRenderer from '@/components/DynamicCardRenderer';

const ResumeMap = dynamic(() => import('@/components/workspace/ResumeMap'), { ssr: false });

const defaultTechData = [{ name: 'NEXT.JS & TS', score: 95, desc: 'ENTERPRISE UI & SERVER COMPONENTS' }, { name: 'PYTHON / FLASK', score: 92, desc: 'BACKEND AUTOMATION & ML PIPELINES' }, { name: 'TENSORFLOW', score: 88, desc: 'DEEP LEARNING & MODEL TRAINING' }, { name: 'LANGCHAIN / N8N', score: 85, desc: 'AGENTIC WORKFLOW AUTOMATION' }, { name: 'MONGODB / MYSQL', score: 85, desc: 'NO-SQL & RELATIONAL DB ARCHITECTURE' }];
const defaultDomainData = [{ name: 'SOFTWARE ENG', value: 40, color: '#ffffff', desc: 'FULL-STACK DEVELOPMENT' }, { name: 'MACHINE LEARNING', value: 35, color: '#cccccc', desc: 'PREDICTIVE MODELS' }, { name: 'DATA PIPELINES', value: 25, color: '#888888', desc: 'ETL & ENGINEERING' }];
const defaultRadarData = [{ subject: 'PROBLEM SOLVING', A: 90, fullMark: 100, desc: 'Mampu memecahkan masalah arsitektur kompleks.' }, { subject: 'LEADERSHIP', A: 85, fullMark: 100, desc: 'Memimpin inisiatif proyek.' }, { subject: 'COMMUNICATION', A: 95, fullMark: 100, desc: 'Komunikasi lintas tim.' }, { subject: 'ADAPTABILITY', A: 88, fullMark: 100, desc: 'Cepat belajar teknologi baru.' }, { subject: 'WORK ETHIC', A: 92, fullMark: 100, desc: 'Tanggung jawab tinggi.' }];
const defaultEduTimeline = [{ title: 'CCIT FTUI', desc: 'TI AIDA SPECIALIZATION', color: 'emerald' }, { title: 'ASIA E UNIVERSITY', desc: 'B.ICT DEGREE TRACK', color: 'emerald' }];
const defaultExpTimeline = [{ title: 'AI UI INTERN', desc: 'TARGET PLACEMENT 2026', color: 'amber' }, { title: 'FREELANCE DEV', desc: 'FULL STACK INTEGRATION', color: 'amber' }];
const defaultVolTimeline = [{ title: 'TECH MENTOR', desc: 'OPEN SOURCE ADVOCATE', color: 'indigo' }];
const defaultPipeline = { external: [{ company: 'GOJEK', role: 'DATA ENG', status: 'INTERVIEW', color: 'amber', desc: 'Proses seleksi teknis tahap akhir.' }, { company: 'TOKOPEDIA', role: 'FRONTEND', status: 'APPLIED', color: 'cyan', desc: 'Menunggu hasil seleksi CV.' }], freelance: [{ project: 'SYS-DASHBOARD', client: 'BUILD', status: 'IN PROGRESS', color: 'emerald', desc: 'Mengembangkan arsitektur CMS Next.js.' }]};
const defaultMcuMetrics = [{ label: 'STATUS', value: 'FIT FOR DUTY', desc: '100% OPERATIONAL READINESS.', highlight: true }, { label: 'VISION', value: '20/20 DARK MODE', desc: 'EYES ADAPTED TO LOW-LIGHT IDE ENVIRONMENTS.', highlight: false }, { label: 'SPINAL POSTURE', value: '90% ERGONOMIC', desc: 'MAINTAINS CORRECT POSTURE DURING LONG CODING SESSIONS.', highlight: false }];
const defaultDeployProtocols = [{ label: 'JUNIOR AI ENGINEER', desc: 'Ready to build, test, and deploy LLM agents and intelligent workflows.' }, { label: 'DATA SCIENTIST', desc: 'Capable of extracting insights via Pandas, Tableau, and advanced statistical models.' }, { label: 'ML ENGINEER', desc: 'Training predictive algorithms and cleaning data pipelines for production.' }];
const defaultBehaveMetrics = [{ label: 'ANALYTICAL COMMUNICATION', desc: 'Translating complex technical data into clear stakeholder insights.' }, { label: 'AGILE PROBLEM SOLVING', desc: 'Adapting rapidly to shifting project requirements without losing momentum.' }, { label: 'TEAMWORK & LEADERSHIP', desc: 'Taking initiative while ensuring the team operates as a cohesive unit.' }];

// DEFAULT LEGEND WAFFLE BISA DI-CRUD
const defaultWaffleData = {
  legend: [
    { label: 'STANDARD', colorClass: 'bg-white/10' },
    { label: 'UI EXPERT', colorClass: 'bg-white/30' },
    { label: 'ML ENGINEER', colorClass: 'bg-white/60' },
    { label: 'AI UI HYBRID', colorClass: 'bg-white shadow-[0_0_4px_white]' }
  ]
};

const CardHeader = ({ title, desc, extraClass = "mb-6" }: { title: string, desc?: string, extraClass?: string }) => (
  <div className={`relative w-max z-20 group/cardtitle ${extraClass}`}>
    <h3 className="font-mono text-[10px] tracking-[0.2em] text-white uppercase flex items-center gap-2 cursor-help">
      {title}
      {desc && <span className="w-1.5 h-1.5 rounded-none bg-cyan-500/20 group-hover/cardtitle:bg-cyan-400 group-hover/cardtitle:shadow-[0_0_8px_cyan] transition-all"></span>}
    </h3>
    {desc && (
      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/cardtitle:flex flex-col bg-[#09090b]/95 border-l-2 border-cyan-400 p-4 shadow-[10px_10px_30px_rgba(0,0,0,0.9)] backdrop-blur-xl w-64 z-50 animate-in slide-in-from-bottom-2 duration-300">
        <p className="font-mono text-[9px] text-white/80 normal-case leading-relaxed">{desc}</p>
      </div>
    )}
  </div>
);

const CustomChartTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-[#09090b]/95 border-l-2 border-cyan-400 p-4 shadow-[10px_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-md animate-in zoom-in-95 duration-200 z-50">
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

export function DashboardView({ visitor, visitorGoal, isHR, isTechLead }: any) {
  const [cards, setCards] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCards = async () => {
      try {
        const res = await fetch('http://127.0.0.1:5555/api/cards');
        if (res.ok) {
          const result = await res.json();
          if (result.success) setCards(result.data);
        }
      } catch (error) { 
        console.error("Gagal mengambil data cards:", error); 
      } finally {
        setIsLoading(false);
      }
    };
    fetchCards();
  }, []);

  if (isLoading) {
    return (
      <div className="flex w-full h-[60vh] items-center justify-center">
        <p className="font-mono text-xs tracking-[0.4em] text-white/50 uppercase">
          INITIALIZING CORTEX MODULES<span className="animate-pulse text-cyan-400 ml-1">_</span>
        </p>
      </div>
    );
  }

  const getCard = (id: string) => cards.find(c => c.identifier === id);
  const isVisible = (id: string) => { const c = getCard(id); return c ? c.isVisible : true; };

  const cExec = getCard('EXEC_SUMMARY');
  const cTarget = getCard('TARGET_ROLE');
  const cEdu = getCard('EDU_TIMELINE');
  const cExp = getCard('EXP_TIMELINE');
  const cVol = getCard('VOL_TIMELINE');
  const cPipe = getCard('PIPELINE');
  const cTech = getCard('TECH_STACK');
  const cDomain = getCard('DOMAIN_FOCUS');
  const cComp = getCard('COMPETENCIES');
  const cMap = getCard('MAP_BLOCK');
  const cWaffle = getCard('WAFFLE_RARITY');
  const cMcu = getCard('MCU_METRICS');
  const cDeploy = getCard('DEPLOYMENT_PROTOCOLS');
  const cBehave = getCard('BEHAVIORAL_METRICS');

  const starterIDs = ['EXEC_SUMMARY', 'TARGET_ROLE', 'EDU_TIMELINE', 'EXP_TIMELINE', 'VOL_TIMELINE', 'PIPELINE', 'TECH_STACK', 'DOMAIN_FOCUS', 'COMPETENCIES', 'MAP_BLOCK', 'WAFFLE_RARITY', 'MCU_METRICS', 'DEPLOYMENT_PROTOCOLS', 'BEHAVIORAL_METRICS'];
  const customCards = cards.filter(c => !starterIDs.includes(c.identifier));

  let tailoredSummary = cExec?.dataPayload?.default || "SYSTEMATIC ENGINEER DRIVING INTERSECTION OF AI ARCHITECTURE AND MODERN UI.";
  let highlightMetric = cWaffle?.title || "HYBRID CAPABILITY";
  
  if (isHR) {
    tailoredSummary = cExec?.dataPayload?.hr || "HIGHLY DISCIPLINED TALENT READY FOR IMMEDIATE PLACEMENT.";
    highlightMetric = "CULTURAL FIT & DISCIPLINE";
  } else if (isTechLead) {
    tailoredSummary = cExec?.dataPayload?.techLead || "ARCHITECTING ROBUST WORKFLOWS WITH NEXT.JS 16 TURBOPACK.";
    highlightMetric = "SYSTEMS ARCHITECTURE";
  }

  const activeTechData = cTech?.dataPayload || defaultTechData;
  const activeDomainData = cDomain?.dataPayload || defaultDomainData;
  const activeRadarData = cComp?.dataPayload || defaultRadarData;
  const activeEdu = cEdu?.dataPayload || defaultEduTimeline;
  const activeExp = cExp?.dataPayload || defaultExpTimeline;
  const activeVol = cVol?.dataPayload || defaultVolTimeline;
  const activePipe = cPipe?.dataPayload || defaultPipeline;
  const activeMcu = cMcu?.dataPayload || defaultMcuMetrics;
  const activeDeploy = cDeploy?.dataPayload?.items || defaultDeployProtocols;
  const activeBehave = cBehave?.dataPayload?.items || defaultBehaveMetrics;
  
  // DATA WAFFLE MENGAMBIL DARI DATABASE
  const activeWaffle = cWaffle?.dataPayload || defaultWaffleData;
  
  // DATA MAP PINS MENGAMBIL DARI DATABASE (SUDAH DITAMBAHKAN DI SINI)
  const activeMapPins = cMap?.dataPayload?.pins || [];

  const glassBase = "flex flex-col rounded-none border-0 p-6 shadow-[inset_1.5px_1.5px_1px_rgba(255,255,255,0.15),_10px_10px_20px_rgba(0,0,0,0.6)] backdrop-blur-md transition-all duration-500 hover:-translate-y-2 hover:scale-[1.02] hover:shadow-[inset_2px_2px_2px_rgba(255,255,255,0.4),_20px_20px_40px_rgba(0,0,0,0.9)] hover:z-20 relative bg-white/5";

  return (
    <div className="flex flex-col gap-8 pb-16 animate-in fade-in duration-500">
      
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        {isVisible('EXEC_SUMMARY') && (
          <div className={`xl:col-span-2 sm:flex-row items-center sm:items-start gap-6 ${glassBase} !bg-cyan-500/10`}>
            <div className="relative h-28 w-28 shrink-0 overflow-hidden rounded-full border-0 bg-white/10 shadow-[inset_1px_1px_4px_rgba(255,255,255,0.3),_5px_5px_15px_rgba(0,0,0,0.5)] transition-transform duration-500 hover:scale-110">
              <Image src="/assets/images/profile.png" alt="Rais" fill className="object-cover object-top" />
            </div>
            <div className="flex w-full flex-col text-center sm:text-left mt-4 sm:mt-0">
              <h2 className="font-mono text-2xl tracking-widest text-white uppercase">{visitor?.name || 'FADHIL RAIS WAHYUDI'}</h2>
              <p className="mt-1 font-mono text-xs tracking-[0.2em] text-white/60 uppercase">AI UI DEVELOPER / DATA ENGINEER</p>
              <p className="mt-4 font-mono text-[10px] tracking-wider text-white/80 leading-relaxed uppercase min-h-[40px]">{tailoredSummary}</p>
              <div className="mt-4 flex flex-wrap justify-center sm:justify-start gap-3 font-mono text-[9px] tracking-widest text-white uppercase">
                <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">BEKASI IDN</span>
                <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">{visitor?.email || 'RAIS@EXAMPLE.COM'}</span>
                <span className="bg-white/5 px-2 py-1 shadow-[inset_1px_1px_0px_rgba(255,255,255,0.1)]">CCIT FTUI & AEU</span>
              </div>
            </div>
          </div>
        )}
        
        {isVisible('TARGET_ROLE') && (
          <div className={`${glassBase} items-center justify-center cursor-pointer group`}>
            <p className="mb-4 text-center font-mono text-[9px] tracking-[0.2em] text-white/60 uppercase">TAILORED FOR {visitorGoal || 'EVALUATION'}</p>
            <button className="w-full rounded-none border-0 px-4 py-3 font-mono text-[10px] tracking-widest text-black bg-white group-hover:bg-cyan-400 transition-colors uppercase shadow-[inset_2px_2px_2px_rgba(255,255,255,1),_5px_5px_15px_rgba(0,0,0,0.4)]">
              {cTarget?.dataPayload?.actionText || 'DOWNLOAD MASTER CV'}
            </button>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {isVisible('EDU_TIMELINE') && (
          <div className={`${glassBase} !bg-emerald-500/10`}>
            <CardHeader title={cEdu?.title || 'ACADEMIC RECORD'} desc={cEdu?.desc} />
            <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-0.5 before:bg-white/20">
              {activeEdu.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-5 group/timeline cursor-default">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-none border-0 ${idx === 0 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20'} transition-transform duration-300 group-hover/timeline:scale-150 group-hover/timeline:bg-${item.color || 'emerald'}-400`}></div>
                  <h4 className={`font-mono text-xs text-white uppercase group-hover/timeline:text-${item.color || 'emerald'}-300 transition-colors`}>{item.title}</h4>
                  <p className="font-mono text-[9px] tracking-widest text-white/60 uppercase mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isVisible('EXP_TIMELINE') && (
          <div className={`${glassBase} !bg-amber-500/10`}>
            <CardHeader title={cExp?.title || 'PROFESSIONAL TRACK'} desc={cExp?.desc} />
            <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-0.5 before:bg-white/20">
              {activeExp.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-5 group/timeline cursor-default">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-none border-0 ${idx === 0 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20'} transition-transform duration-300 group-hover/timeline:scale-150 group-hover/timeline:bg-${item.color || 'amber'}-400`}></div>
                  <h4 className={`font-mono text-xs text-white uppercase group-hover/timeline:text-${item.color || 'amber'}-300 transition-colors`}>{item.title}</h4>
                  <p className="font-mono text-[9px] tracking-widest text-white/60 uppercase mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {isVisible('VOL_TIMELINE') && (
          <div className={`${glassBase} !bg-indigo-500/10`}>
            <CardHeader title={cVol?.title || 'COMMUNITY & EXTRAS'} desc={cVol?.desc} />
            <div className="flex flex-col gap-5 relative before:absolute before:inset-0 before:ml-[5px] before:h-full before:w-0.5 before:bg-white/20">
              {activeVol.map((item: any, idx: number) => (
                <div key={idx} className="relative pl-5 group/timeline cursor-default">
                  <div className={`absolute left-0 top-1.5 w-3 h-3 rounded-none border-0 ${idx === 0 ? 'bg-white shadow-[0_0_10px_rgba(255,255,255,0.5)]' : 'bg-white/20'} transition-transform duration-300 group-hover/timeline:scale-150 group-hover/timeline:bg-${item.color || 'indigo'}-400`}></div>
                  <h4 className={`font-mono text-xs text-white uppercase group-hover/timeline:text-${item.color || 'indigo'}-300 transition-colors`}>{item.title}</h4>
                  <p className="font-mono text-[9px] tracking-widest text-white/60 uppercase mt-1">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {false && isVisible('PIPELINE') && (
        <div className={`${glassBase} p-0 overflow-hidden`}>
          <div className="p-4 border-b-2 border-white/10 bg-white/5 flex justify-between items-center">
            <CardHeader title={cPipe?.title || 'ACTIVE OPERATIONS PIPELINE'} desc={cPipe?.desc} extraClass="mb-0" />
            <div className="h-1.5 w-1.5 bg-cyan-400 animate-pulse shadow-[0_0_5px_cyan]"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2">
            <div className="p-4 border-r border-white/5">
              <p className="font-mono text-[8px] text-white/40 uppercase mb-3 tracking-widest">EXTERNAL APPLICATIONS</p>
              <div className="flex flex-col gap-2">
                {activePipe?.external?.map((job: any, idx: number) => (
                  <div key={`ext-${idx}`} className="flex justify-between items-center p-2 bg-white/5 font-mono text-[9px] group/pipe cursor-help relative">
                    <span className="text-white uppercase">{job.company} <span className="text-white/40">/ {job.role}</span></span>
                    <span className={`text-${job.color}-400 shadow-[0_0_8px_rgba(var(--${job.color}-400),0.3)] bg-${job.color}-400/10 px-2 py-0.5`}>{job.status}</span>
                    {job.desc && (
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/pipe:flex flex-col bg-[#09090b]/95 border-l-2 border-white/50 p-3 shadow-2xl backdrop-blur-xl w-56 z-50 animate-in slide-in-from-bottom-2 duration-300">
                        <p className="font-mono text-[9px] text-white/80 uppercase leading-relaxed text-left">{job.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
            <div className="p-4">
              <p className="font-mono text-[8px] text-white/40 uppercase mb-3 tracking-widest">FREELANCE / GIGS</p>
              <div className="flex flex-col gap-2">
                {activePipe?.freelance?.map((gig: any, idx: number) => (
                  <div key={`free-${idx}`} className="flex justify-between items-center p-2 bg-white/5 font-mono text-[9px] group/pipe cursor-help relative">
                    <span className="text-white uppercase">{gig.project} <span className="text-white/40">/ {gig.client}</span></span>
                    <span className={`text-${gig.color}-400 shadow-[0_0_8px_rgba(var(--${gig.color}-400),0.3)] bg-${gig.color}-400/10 px-2 py-0.5`}>{gig.status}</span>
                    {gig.desc && (
                      <div className="absolute left-0 bottom-full mb-2 hidden group-hover/pipe:flex flex-col bg-[#09090b]/95 border-l-2 border-white/50 p-3 shadow-2xl backdrop-blur-xl w-56 z-50 animate-in slide-in-from-bottom-2 duration-300">
                        <p className="font-mono text-[9px] text-white/80 uppercase leading-relaxed text-left">{gig.desc}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isVisible('TECH_STACK') && (
          <div className={`col-span-1 lg:col-span-1 ${glassBase} !bg-purple-500/10 group/chartblock`}>
            <CardHeader title={cTech?.title || 'TECH STACK (BAR)'} desc={cTech?.desc} />
            <div className="h-48 w-full transition-transform duration-500 group-hover/chartblock:scale-[1.03]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activeTechData} layout="vertical" margin={{ top: 0, right: 0, left: -10, bottom: 0 }}>
                  <XAxis type="number" hide />
                  <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} tick={{ fill: 'rgba(255,255,255,0.7)', fontSize: 8, fontFamily: 'monospace' }} width={90} />
                  <Tooltip content={<CustomChartTooltip />} cursor={{ fill: 'rgba(255,255,255,0.1)' }} />
                  <Bar dataKey="score" fill="#ffffff" radius={[0, 0, 0, 0]} barSize={8} className="transition-all duration-300 hover:fill-cyan-400" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {isVisible('DOMAIN_FOCUS') && (
          <div className={`${glassBase} !bg-blue-500/10 group/pieblock items-center flex flex-col justify-between`}>
            <CardHeader title={cDomain?.title || 'DOMAIN (PIE)'} desc={cDomain?.desc} extraClass="w-full text-left mb-2" />
            <div className="h-36 w-full relative my-auto transition-transform duration-500 group-hover/pieblock:scale-[1.05]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={activeDomainData} innerRadius={35} outerRadius={55} paddingAngle={2} dataKey="value" stroke="none">
                    {activeDomainData.map((entry: any, index: number) => <Cell key={`pie-cell-${index}`} fill={entry.color || '#ffffff'} className="hover:opacity-80 transition-opacity" />)}
                  </Pie>
                  <Tooltip content={<CustomChartTooltip />} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-4 flex flex-col w-full gap-2 font-mono text-[8px] tracking-widest text-white/60 uppercase">
              {activeDomainData.map((d: any, index: number) => (
                <span key={`domain-${d.name}-${index}`} className="flex justify-between items-center group/legend cursor-help relative">
                  <span className="flex items-center gap-2"><div className="w-1.5 h-1.5" style={{ backgroundColor: d.color || '#fff' }}></div><span className="group-hover/legend:text-white transition-colors">{d.name}</span></span>
                  <span>{d.value} PCT</span>
                  {d.desc && (
                    <div className="absolute right-0 bottom-full mb-2 hidden group-hover/legend:flex flex-col bg-[#09090b]/95 border-l-2 border-white/50 p-3 shadow-[10px_10px_20px_rgba(0,0,0,0.8)] backdrop-blur-xl w-48 z-50 animate-in slide-in-from-bottom-2 duration-300">
                      <p className="font-mono text-[9px] text-white/80 uppercase leading-relaxed text-right">{d.desc}</p>
                    </div>
                  )}
                </span>
              ))}
            </div>
          </div>
        )}

        {isVisible('COMPETENCIES') && (
          <div className={`${glassBase} !bg-rose-500/10 group/radarblock items-center`}>
            <CardHeader title={cComp?.title || 'COMPETENCIES (RADAR)'} desc={cComp?.desc} extraClass="w-full text-left mb-2" />
            <div className="h-40 w-full transition-transform duration-500 group-hover/radarblock:scale-[1.1]">
              <ResponsiveContainer width="100%" height="100%">
                <RadarChart cx="50%" cy="50%" outerRadius="55%" data={activeRadarData}>
                  <PolarGrid stroke="rgba(255,255,255,0.2)" />
                  <PolarAngleAxis dataKey="subject" tick={{ fill: 'rgba(255,255,255,0.5)', fontSize: 7, fontFamily: 'monospace' }} />
                  <Tooltip content={<CustomChartTooltip />} />
                  <Radar name="Score" dataKey="A" stroke="#f43f5e" fill="#f43f5e" fillOpacity={0.3} className="hover:fill-cyan-400 hover:stroke-cyan-400 transition-colors" />
                </RadarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isVisible('MAP_BLOCK') && (
          <div className={`col-span-1 lg:col-span-2 relative ${glassBase} !bg-indigo-500/10 group/mapblock`}>
             <div className="flex justify-between items-center mb-4 z-10 relative">
              <CardHeader title={cMap?.title || 'OPERATIONAL TOPOGRAPHY'} desc={cMap?.desc} extraClass="mb-0" />
              <span className="font-mono text-[8px] tracking-widest text-cyan-400 uppercase animate-pulse">LIVE MAP DATA</span>
            </div>
            <div className="relative h-64 w-full z-0 opacity-80 transition-opacity duration-500 group-hover/mapblock:opacity-100">
              {/* COMPONENT MAP DIPANGGIL DENGAN DATA DARI DATABASE */}
              <ResumeMap pins={activeMapPins} />
            </div>
          </div>
        )}

        {isVisible('WAFFLE_RARITY') && (
          <div className={`${glassBase} !bg-fuchsia-500/10`}>
            <CardHeader title={cWaffle?.title || highlightMetric} desc={cWaffle?.desc} />
            <div className="flex flex-col w-full items-center relative group/waffle">
              <p className="mb-4 font-mono text-[7px] tracking-[0.2em] text-white/40 uppercase text-center">EACH DOT = 1K PROFESSIONALS</p>
              
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
                {activeWaffle.legend?.map((leg: any, idx: number) => (
                  <div key={`waffle-leg-${idx}`} className="flex items-center gap-2">
                    <div className={`h-1.5 w-1.5 rounded-none shrink-0 ${leg.colorClass}`}></div> {leg.label}
                  </div>
                ))}
              </div>

            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {isVisible('MCU_METRICS') && (
          <div className={`${glassBase} !bg-rose-500/10`}>
            <CardHeader title={cMcu?.title || 'MEDICAL CLEARANCE'} desc={cMcu?.desc} />
            <div className="flex flex-col gap-2 font-mono">
              {activeMcu.map((m: any, idx: number) => (
                <div key={idx} className={`flex justify-between ${m.highlight ? 'text-xs text-white border-b-2 pb-2' : 'text-[10px] text-white/70 border-b-2 py-2'} border-white/5 cursor-help group/mcu${idx} relative uppercase`}>
                  <span className="text-white/50">{m.label}</span><span className={m.highlight ? 'text-white' : ''}>{m.value}</span>
                  <div className={`absolute right-0 bottom-full mb-1 hidden group-hover/mcu${idx}:block bg-[#09090b]/90 border border-white/20 p-2 z-50 text-[8px] text-white/80 w-32 text-right`}>{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {isVisible('DEPLOYMENT_PROTOCOLS') && (
          <div className={`${glassBase} !bg-${cDeploy?.dataPayload?.color || 'teal'}-500/10`}>
            <CardHeader title={cDeploy?.title || 'DEPLOYMENT PROTOCOLS'} desc={cDeploy?.desc} />
            <ul className="flex flex-col gap-3 font-mono text-[10px] tracking-widest text-white/80 uppercase">
              {activeDeploy.map((item: any, idx: number) => (
                <HoverListItem key={idx} label={item.label} desc={item.desc} />
              ))}
            </ul>
          </div>
        )}

        {isVisible('BEHAVIORAL_METRICS') && (
          <div className={`${glassBase} !bg-${cBehave?.dataPayload?.color || 'orange'}-500/10`}>
            <CardHeader title={cBehave?.title || 'BEHAVIORAL METRICS'} desc={cBehave?.desc} />
            <ul className="flex flex-col gap-3 font-mono text-[10px] tracking-widest text-white/80 uppercase">
              {activeBehave.map((item: any, idx: number) => (
                <HoverListItem key={idx} label={item.label} desc={item.desc} />
              ))}
            </ul>
          </div>
        )}
      </div>

      {customCards.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {customCards.map((card) => (
             <DynamicCardRenderer key={card._id} card={card} visitor={visitor} visitorGoal={visitorGoal} isHR={isHR} isTechLead={isTechLead} />
          ))}
        </div>
      )}

    </div>
  );
}