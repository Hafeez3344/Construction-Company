import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { HeaderNavbar } from '@/components/HeaderNavbar';
import { HardHat } from 'lucide-react';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Jandool Construction Company | Work Order & Measurement Portal',
  description: 'Digital management system for construction work orders, measurement sheets, site progress photos, and expenditure statements for Jandool Construction Company (Licence No: 76790).',
  keywords: ['Jandool Construction', 'Work Order', 'Measurement Sheet', 'Construction Management', 'Pakistan Contractor', 'Highways', 'Pavement', 'Drains'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-100 text-slate-900`}>
        <HeaderNavbar />
        <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {children}
        </main>
        <footer className="no-print bg-brand-950 text-slate-400 py-6 border-t border-brand-900 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-1.5 rounded-lg text-brand-950">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <p className="font-extrabold text-white text-sm tracking-tight">
                  Jandool Construction Company
                </p>
                <p className="text-slate-400 text-[11px]">
                  Tagline: &ldquo;Building Trust, Delivering Quality&rdquo; | Govt Licence No: <span className="text-amber-400 font-bold">76790</span>
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p>© {new Date().getFullYear()} Jandool Construction Company. All rights reserved.</p>
              <p className="text-[11px] text-slate-500">Digital Measurement & Work Order System</p>
            </div>
          </div>
        </footer>
      </body>
    </html>
  );
}
