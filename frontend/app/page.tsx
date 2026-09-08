'use client';

import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button } from '@/components/ui/Button';

export default function LandingPage() {
  const router = useRouter();

  return (
    <main className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#09090b]">
      
      {/* 
        BUNGKUSAN BACKGROUND (Absolute Wrapper)
        Kita pisahkan gambar dan overlay ke dalam kotaknya sendiri yang posisinya absolut di belakang (z-0).
      */}
      <div className="absolute inset-0 z-0">
        <Image 
          /* 
            PENTING: Ubah ekstensi ini ke .jpg atau .jpeg sesuai nama asli di laptopmu! 
          */
          src="/assets/images/bg-landing.jpeg" 
          alt="Background" 
          fill
          priority
          className="object-cover object-center"
        />
        {/* Overlay sekarang berada sejajar menutupi gambar di dalam bungkusannya */}
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
      </div>

      {/* 
        GLASS CONTAINER 
        Diberi z-10 agar posisinya pasti berada di atas bungkusan background.
      */}
      <section className="relative z-10 flex w-11/12 max-w-2xl flex-col items-center justify-center border border-white/15 bg-white/5 px-8 py-20 shadow-2xl backdrop-blur-xl">
        
        <h1 className="mb-16 font-mono text-5xl font-light tracking-[0.35em] text-white sm:text-6xl drop-shadow-md">
          Rais
        </h1>

        <div className="flex flex-col items-center justify-center gap-6 sm:flex-row sm:gap-8 font-mono text-lg text-white">
          <Button variant="ghost" onClick={() => router.push('/onboarding')}>
            User
          </Button>
          
          <span className="text-xs font-light opacity-30 tracking-widest">OR</span>
          
          <Button variant="ghost" onClick={() => router.push('/admin')}>
            Admin
          </Button>
        </div>
        
      </section>

    </main>
  );
}