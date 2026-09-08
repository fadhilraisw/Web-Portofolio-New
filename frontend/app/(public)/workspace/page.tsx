'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { useVisitorStore } from '@/store/useVisitorStore';
import { SidebarLeft } from '@/components/workspace/SidebarLeft';
import { CenterPanel } from '@/components/workspace/CenterPanel';
import { SidebarRight } from '@/components/workspace/SidebarRight';

export default function Workspace() {
  const visitor = useVisitorStore((state) => state.visitor);
  
  const [isGlobalLoading, setIsGlobalLoading] = useState(true);
  const [leftCollapsed, setLeftCollapsed] = useState(false);
  const [rightCollapsed, setRightCollapsed] = useState(false);
  const [activeCategory, setActiveCategory] = useState('dashboard');
  const [isLocalLoading, setIsLocalLoading] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsGlobalLoading(false), 900); 
  }, []);

  const handleCategoryChange = (key: string) => {
    if (key === activeCategory) return;
    setIsLocalLoading(true);
    setActiveCategory(key);
    setTimeout(() => setIsLocalLoading(false), 800);
  };

  if (isGlobalLoading) {
    return (
      <main className="flex h-screen w-full items-center justify-center bg-white">
        <h1 className="font-mono text-xl tracking-[0.8em] text-black uppercase">
          INITIALIZING<span className="animate-pulse">_</span>
        </h1>
      </main>
    );
  }

  return (
    <main className="relative flex h-screen w-full overflow-hidden bg-[#09090b]">
      <div className="absolute inset-0 z-0">
        <Image src="/assets/images/bg-landing.jpeg" alt="Workspace Background" fill priority className="object-cover object-center" />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[6px]"></div>
      </div>

      <div className="relative z-10 flex h-full w-full gap-6 p-4 transition-all duration-500 sm:p-6 lg:p-8">
        <SidebarLeft 
          collapsed={leftCollapsed} 
          setCollapsed={setLeftCollapsed} 
          activeCategory={activeCategory} 
          setActiveCategory={handleCategoryChange}
          visitorName={visitor.name}
        />
        
        <CenterPanel 
          activeCategory={activeCategory} 
          isLoading={isLocalLoading} 
          visitorGoal={visitor.goal}
        />
        
        <SidebarRight 
          collapsed={rightCollapsed} 
          setCollapsed={setRightCollapsed} 
          visitor={visitor}
        />
      </div>
    </main>
  );
}