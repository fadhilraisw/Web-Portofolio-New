'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { useVisitorStore } from '@/store/useVisitorStore';
import { InputField } from '@/components/ui/InputField';
import { Button } from '@/components/ui/Button';

export default function Onboarding() {
  const router = useRouter();
  const setVisitorData = useVisitorStore((state) => state.setVisitorData);
  
  const [formData, setFormData] = useState({
    name: '', age: '', position: '', company: '', goal: '', email: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setVisitorData(formData);
    // Nanti logika POST ke MongoDB via FastAPI diletakkan di sini
    router.push('/workspace');
  };

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#09090b]">
      
      {/* Background Wrapper (Sama seperti Landing Page) */}
      <div className="absolute inset-0 z-0">
        <Image 
          src="/assets/images/bg-landing.jpeg" 
          alt="Background" 
          fill
          priority
          className="object-cover object-center"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-[4px]"></div>
      </div>

      {/* Glass Form Container */}
      <section className="relative z-10 flex w-11/12 max-w-lg flex-col border border-white/10 bg-white/5 p-8 shadow-2xl backdrop-blur-xl sm:p-12">
        <h2 className="mb-2 font-mono text-2xl tracking-widest text-white">IDENTIFICATION</h2>
        <p className="mb-8 font-mono text-xs tracking-wider text-white/50">
          Please provide context to calibrate the workspace.
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          <InputField label="Full Name" name="name" required onChange={handleChange} />
          
          <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <InputField label="Age" name="age" type="number" onChange={handleChange} />
            <InputField label="Email" name="email" type="email" required onChange={handleChange} />
          </div>
          
          <InputField label="Company / Organization" name="company" required onChange={handleChange} />
          <InputField label="Position / Role" name="position" required onChange={handleChange} />
          <InputField 
            label="Primary Goal" 
            name="goal" 
            placeholder="e.g., Recruiting for AI UI Developer" 
            required 
            onChange={handleChange} 
          />
          
          <div className="pt-6">
            <Button type="submit" variant="outline" className="w-full">
              ENTER WORKSPACE
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}