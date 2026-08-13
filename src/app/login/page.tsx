'use client';

import React, { useState } from 'react';
import { useAuth } from '@/components/AuthProvider';
import { HardHat, Lock, Shield, User, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { UserRole } from '@/lib/types';

export default function LoginPage() {
  const { login } = useAuth();
  const [role, setRole] = useState<UserRole>('Admin');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!password) {
      setError('Please enter a password');
      return;
    }

    setIsLoading(true);

    // Simulate network request
    setTimeout(() => {
      // For demonstration, any password works, but we enforce 'admin123' for realism if desired
      if (password === 'admin123' || password.length > 3) {
        login(role);
      } else {
        setError('Invalid credentials. (Try "admin123")');
        setIsLoading(false);
      }
    }, 800);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('https://images.unsplash.com/photo-1541888946425-d0fbb186a5b7?w=1600&q=80')] bg-cover bg-center relative">
      {/* Overlay to dim background */}
      <div className="absolute inset-0 bg-brand-950/80 backdrop-blur-sm"></div>
      
      <div className="relative z-10 w-full max-w-md px-6 py-12">
        <div className="bg-white/10 backdrop-blur-md p-8 sm:p-10 rounded-3xl shadow-2xl border border-white/20">
          
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 shadow-lg mb-4">
              <HardHat className="w-8 h-8 text-brand-950" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Jandool Construction</h1>
            <p className="text-brand-200 text-sm mt-1 font-medium">Digital Work Order Portal</p>
          </div>

          {error && (
            <div className="bg-rose-500/20 border border-rose-500/50 text-rose-200 p-3 rounded-xl text-sm mb-6 flex items-center gap-2">
              <Shield className="w-4 h-4" />
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Select Role</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="w-5 h-5 text-slate-400" />
                </div>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value as UserRole)}
                  className="w-full pl-10 pr-4 py-3 bg-brand-950/50 border border-brand-700/50 rounded-xl text-white appearance-none focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                >
                  <option value="Admin">Administrator</option>
                  <option value="Site Staff">Site Staff (Field)</option>
                  <option value="Client">Client (View Only)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-300">Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="w-5 h-5 text-slate-400" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter password"
                  className="w-full pl-10 pr-12 py-3 bg-brand-950/50 border border-brand-700/50 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white focus:outline-none"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-brand-950 font-bold py-3.5 px-4 rounded-xl shadow-lg transition-all active:scale-95 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-brand-950/30 border-t-brand-950 rounded-full animate-spin"></div>
              ) : (
                <>
                  Login <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          <div className="mt-8 text-center text-xs text-brand-200/60 font-medium">
            <p>Protected by Jandool Security</p>
            <p>Govt Licence No: 76790</p>
          </div>
        </div>
      </div>
    </div>
  );
}
