'use client';

import React from 'react';
import { usePathname } from 'next/navigation';
import { HeaderNavbar } from '@/components/HeaderNavbar';
import { HardHat } from 'lucide-react';
import { AuthProvider } from '@/components/AuthProvider';

export function AppLayoutWrapper({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isLoginPage = pathname === '/login';

  return (
    <AuthProvider>
      {!isLoginPage && <HeaderNavbar />}
      
      <main className={!isLoginPage ? "flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6" : "flex-1 w-full"}>
        {children}
      </main>

      {!isLoginPage && (
        <footer className="no-print bg-brand-950 text-slate-400 py-6 border-t border-brand-900 text-xs">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="bg-amber-500 p-1.5 rounded-lg text-brand-950">
                <HardHat className="w-5 h-5" />
              </div>
              <div>
                <p className="font-bold text-white text-sm tracking-tight">
                  Jandool Construction Company
                </p>
                <p className="text-slate-400 text-xs">
                  Tagline: &ldquo;Building Trust, Delivering Quality&rdquo; | Govt Licence No: <span className="text-amber-400 font-semibold">76790</span>
                </p>
              </div>
            </div>
            <div className="text-center sm:text-right">
              <p>© {new Date().getFullYear()} Jandool Construction Company. All rights reserved.</p>
              <p className="text-xs text-slate-500">Digital Measurement & Work Order System</p>
            </div>
          </div>
        </footer>
      )}
    </AuthProvider>
  );
}

