import './globals.css';
import { Space_Mono } from 'next/font/google';

const spaceMono = Space_Mono({ 
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={spaceMono.variable}>
      <body className="font-sans antialiased bg-[#09090b] m-0 p-0 overflow-x-hidden w-full min-h-screen">
        {children}
      </body>
    </html>
  );
}