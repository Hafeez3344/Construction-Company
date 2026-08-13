import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { AppLayoutWrapper } from '@/components/AppLayoutWrapper';

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
      <body className={`${inter.className} min-h-screen flex flex-col bg-slate-50 text-slate-900`}>
        <AppLayoutWrapper>
          {children}
        </AppLayoutWrapper>
      </body>
    </html>
  );
}

