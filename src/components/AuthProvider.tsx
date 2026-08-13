'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { getActiveRole, setActiveRole as setStorageRole } from '@/lib/storage';
import { UserRole } from '@/lib/types';

interface AuthContextType {
  isLoggedIn: boolean;
  role: UserRole;
  login: (role: UserRole) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [role, setRole] = useState<UserRole>('Admin');
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    // Check initial auth state on mount
    const authStatus = localStorage.getItem('jandool_auth_status');
    const storedRole = getActiveRole();
    
    if (authStatus === 'true') {
      setIsLoggedIn(true);
      setRole(storedRole);
    } else {
      setIsLoggedIn(false);
    }
    
    setIsLoading(false);
  }, []);

  useEffect(() => {
    // Route protection
    if (!isLoading) {
      if (!isLoggedIn && pathname !== '/login') {
        router.push('/login');
      } else if (isLoggedIn && pathname === '/login') {
        router.push('/');
      }
    }
  }, [isLoggedIn, pathname, isLoading, router]);

  const login = (newRole: UserRole) => {
    localStorage.setItem('jandool_auth_status', 'true');
    setStorageRole(newRole);
    setIsLoggedIn(true);
    setRole(newRole);
    router.push('/');
  };

  const logout = () => {
    localStorage.removeItem('jandool_auth_status');
    setIsLoggedIn(false);
    router.push('/login');
  };

  if (isLoading) {
    // Simple full screen loader during initial auth check
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-brand-900"></div>
      </div>
    );
  }

  // Prevent flashing protected content before redirect completes
  if (!isLoggedIn && pathname !== '/login') {
    return null; 
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

