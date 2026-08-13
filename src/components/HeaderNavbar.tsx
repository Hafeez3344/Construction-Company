'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { getActiveRole, setActiveRole } from '@/lib/storage';
import { UserRole } from '@/lib/types';
import { 
  HardHat, 
  PlusCircle, 
  LayoutDashboard, 
  BarChart3, 
  Building2, 
  Database, 
  UserCheck, 
  Menu, 
  X,
  FileSpreadsheet,
  Award
} from 'lucide-react';

export const HeaderNavbar: React.FC = () => {
  const pathname = usePathname();
  const [role, setRole] = useState<UserRole>('Admin');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setRole(getActiveRole());
    const handleRoleChange = () => setRole(getActiveRole());
    window.addEventListener('jandool_role_change', handleRoleChange);
    return () => window.removeEventListener('jandool_role_change', handleRoleChange);
  }, []);

  const handleRoleSelect = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = e.target.value as UserRole;
    setRole(selected);
    setActiveRole(selected);
  };

  const navLinks = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/work-orders/new', label: 'New Work Order', icon: PlusCircle },
    { href: '/reports', label: 'Reports & Analytics', icon: BarChart3 },
    { href: '/departments', label: 'Departments', icon: Building2 },
    { href: '/backup', label: 'Data Backup', icon: Database },
  ];

  return (
    <header className="no-print sticky top-0 z-40 bg-brand-900 text-white shadow-lg border-b border-brand-800">
      {/* Top Banner */}
      <div className="bg-brand-950 px-4 py-1 text-xs font-medium text-brand-200 border-b border-brand-800/60 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center gap-1 bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/40 text-[11px] font-semibold">
            <Award className="w-3 h-3 text-amber-400" /> Govt Licence No: 76790
          </span>
          <span className="hidden sm:inline text-slate-300">
            Official Measurement Sheet & Work Order Digital Portal
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-slate-400 hidden sm:inline">Active Mode:</span>
          <div className="flex items-center bg-brand-900 px-2 py-0.5 rounded border border-brand-700">
            <UserCheck className="w-3.5 h-3.5 mr-1.5 text-amber-400" />
            <select
              value={role}
              onChange={handleRoleSelect}
              className="bg-transparent text-white text-xs focus:outline-none cursor-pointer font-semibold"
            >
              <option value="Admin" className="bg-brand-900 text-white">Role: Admin (Full)</option>
              <option value="Site Staff" className="bg-brand-900 text-white">Role: Site Staff (Create/Edit)</option>
              <option value="Client" className="bg-brand-900 text-white">Role: Client (View Only)</option>
            </select>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Company Brand Logo & Tagline */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="bg-gradient-to-br from-amber-400 to-amber-600 p-2.5 rounded-xl shadow-md group-hover:scale-105 transition-transform">
              <HardHat className="w-7 h-7 text-brand-950 stroke-[2.2]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-sans uppercase">
                  Jandool <span className="text-amber-400 font-extrabold">Construction</span>
                </span>
              </div>
              <p className="text-xs text-brand-200 font-medium tracking-wide">
                &ldquo;Building Trust, Delivering Quality&rdquo;
              </p>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const Icon = link.icon;
              const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
              
              // Hide New Work Order for Client role
              if (role === 'Client' && link.href === '/work-orders/new') return null;

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-amber-500 text-brand-950 shadow'
                      : 'text-brand-100 hover:bg-brand-800 hover:text-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Mobile menu button */}
          <div className="flex md:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 rounded-md text-brand-200 hover:text-white hover:bg-brand-800 focus:outline-none"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Navigation */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-brand-950 border-t border-brand-800 px-4 pt-2 pb-4 space-y-1">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            if (role === 'Client' && link.href === '/work-orders/new') return null;

            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-base font-semibold ${
                  isActive ? 'bg-amber-500 text-brand-950' : 'text-brand-100 hover:bg-brand-800'
                }`}
              >
                <Icon className="w-5 h-5" />
                {link.label}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
};
