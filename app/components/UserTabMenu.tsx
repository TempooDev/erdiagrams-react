'use client';
import { useUser } from '@auth0/nextjs-auth0/client';
import Image from 'next/image';
export default function UserTabMenu() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    (user && (
      <div className="dropdown dropdown-end">
        <div
          tabIndex={0}
          role="button"
          className="btn btn-ghost btn-circle avatar"
        >
          <div className="w-10 rounded-full">
            <img src={user.picture ?? ''} alt={user.name ?? ''}/>
          </div>
        </div>
        <ul
          tabIndex={0}
          className="mt-3 z-[1] p-2 shadow menu menu-sm dropdown-content bg-base-100 rounded-box w-52"
        >
          <li>
            <a className="justify-between">
              Profile
              <span className="badge">New</span>
            </a>
          </li>
          <li>
            <a>Settings</a>
          </li>
          <li>
            <a href="/api/auth/logout">Logout</a>
          </li>
        </ul>
      </div>
    )) ||
    (!user && (
      <ul className="menu menu-horizontal px-1">
        <li>
          <a href="/api/auth/login">Login</a>
        </li>
      </ul>
    ))
  );
}
