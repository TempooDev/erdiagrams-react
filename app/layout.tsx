import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import UserTabMenu from './components/UserTabMenu';
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
              <ul className="menu menu-horizontal px-1">
                <li>
                  <Link href={'/board'}>Board</Link>
                </li>
                <li>
                  <details>
                    <summary>Parent</summary>
                    <ul className="p-2 bg-base-100 rounded-t-none">
                      <li>
                        <a>Link 1</a>
                      </li>
                      <li>
                        <a>Link 2</a>
                      </li>
                    </ul>
                  </details>
                </li>
              </ul>
              <UserTabMenu />
              <ul className="menu menu-horizontal px-1">
                <li>
                  <a href="/api/auth/login">Login</a>
                </li>
              </ul>
            </div>
          </div>

          {children}
        </body>
      </UserProvider>
    </html>
  );
}
