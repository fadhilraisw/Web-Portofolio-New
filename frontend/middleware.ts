import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.pathname;

  if (url === '/workspace' || url.startsWith('/workspace/projects')) {
    const visitorSession = request.cookies.get('session') || request.cookies.get('visitor_session');
    if (!visitorSession) {
      return NextResponse.redirect(new URL('/onboarding', request.url));
    }
  }
  
  // 1. Amankan rute /workspace/sys-override
  // Kita pastikan satpam bekerja dengan mencetak log (Kamu bisa lihat di terminal VSCode)
  if (url.startsWith('/workspace/sys-override')) {
    console.log('[MIDDLEWARE] Seseorang mencoba masuk ke Sys-Override...');
    
    // Cek keberadaan cookie 'admin_session'
    const hasClearance = request.cookies.get('admin_session');

    if (!hasClearance) {
      console.log('[MIDDLEWARE] Akses ditolak! Mengarahkan ke halaman /admin');
      const loginUrl = new URL('/admin', request.url);
      return NextResponse.redirect(loginUrl);
    }
    console.log('[MIDDLEWARE] Akses diizinkan.');
  }

  // Lanjutkan perjalanan jika aman
  return NextResponse.next();
}

// Konfigurasi agar Middleware HANYA berjalan saat rute ini diakses
export const config = {
  matcher: ['/workspace/:path*'],
};