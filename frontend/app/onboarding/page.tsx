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
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const endpoint = otpSent ? '/api/auth/verify-otp' : '/api/auth/request-otp';
      const body = otpSent
        ? { email: formData.email, code: otp }
        : { email: formData.email, name: formData.name };
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:5555'}${endpoint}`, {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const result = await response.json();
      if (!response.ok || !result.success) {
        throw new Error(result.message || 'Unable to verify visitor identity.');
      }
      if (!otpSent) {
        setOtpSent(true);
        return;
      }
      setVisitorData({ ...formData, ...(result.data || {}) });
      if (result.data?.token) {
        document.cookie = `visitor_session=${encodeURIComponent(result.data.token)}; path=/; max-age=604800; samesite=lax`;
      }
      router.push('/workspace');
    } catch (requestError) {
      setError(requestError instanceof Error ? requestError.message : 'Authentication failed.');
    } finally {
      setIsSubmitting(false);
    }
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
          {otpSent ? 'Enter the one-time code sent to your email.' : 'Please provide context to calibrate the workspace.'}
        </p>
        
        <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
          {!otpSent && <InputField label="Full Name" name="name" required onChange={handleChange} />}
          
          {!otpSent && <div className="flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0">
            <InputField label="Age" name="age" type="number" onChange={handleChange} />
            <InputField label="Email" name="email" type="email" required onChange={handleChange} />
          </div>}
          
          {!otpSent && <InputField label="Company / Organization" name="company" required onChange={handleChange} />}
          {!otpSent && <InputField label="Position / Role" name="position" required onChange={handleChange} />}
          {!otpSent && <InputField 
            label="Primary Goal" 
            name="goal" 
            placeholder="e.g., Recruiting for AI UI Developer" 
            required 
            onChange={handleChange} 
          />}
          {otpSent && <InputField label="One-Time Password" name="otp" value={otp} onChange={(event) => setOtp(event.target.value)} required />}
          {error && <p className="font-mono text-[10px] tracking-widest text-rose-400 uppercase">{error}</p>}
          
          <div className="pt-6">
            <Button type="submit" variant="outline" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? 'VERIFYING...' : otpSent ? 'VERIFY & ENTER WORKSPACE' : 'SEND ACCESS CODE'}
            </Button>
          </div>
        </form>
      </section>
    </main>
  );
}