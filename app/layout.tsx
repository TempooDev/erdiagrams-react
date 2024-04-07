import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Image from 'next/image';
import Link from 'next/link';
import { UserProvider } from '@auth0/nextjs-auth0/client';
import UserTabMenu from './components/UserTabMenu';
import { Provider } from 'react-redux';
import store from './store';
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
                  <Link href={'/board'}>New Board</Link>
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
          <Provider store={store}>{children}</Provider>
        </body>
      </UserProvider>
    </html>
  );
}
