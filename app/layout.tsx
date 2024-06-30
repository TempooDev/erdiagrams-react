import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import UserTabMenu from './components/UserTabMenu';
import { DiagramStoreProvider } from './providers/diagram-store-provider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'ERDiagrams',
  description: 'Collaborative E-R Diagram tool',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <UserProvider>
        <body className={inter.className}>
          <div className="navbar bg-base-100">
            <div className="flex-1">
              <Link className="btn btn-ghost text-xl" href={'/'}>
                ERDiagrams
              </Link>
            </div>
           
            <div className="flex-none">
              <UserTabMenu />
            </div>
          </div>
        </body>
      </UserProvider>
    </html>
  );
}
