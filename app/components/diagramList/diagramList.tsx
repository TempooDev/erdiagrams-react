'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Diagram } from '@/app/store/diagram/types';
import { User } from '@auth0/auth0-react';
import { useUser } from '@auth0/nextjs-auth0/client';

export default function DiagramList() {
  const [data, setData] = useState([] as Diagram[]);
  const [isLoading, setLoading] = useState(true);
  const { user } = useUser();

  useEffect(() => {
    fetch('https://api-erdiagrams.azurewebsites.net/diagrams/user/'+user?.nickname)
      .then((res) => res.json())
      .then((data) => {
        setData(data);
        setLoading(false);
      });
  }, [user]);
  return (
    <>
      {isLoading && (
        <div className="flex justify-center place-content-center">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      )}
      {!isLoading && data.length === 0 && <h1>No diagrams found</h1>}
      {!isLoading && data.length > 0 && (
        <div className="flex justify-center place-content-center">
          {data?.map((diagram, id) => (
            <div
              className="card card-compact w-96 bg-base-50 shadow-xl m-2"
              key={id}
            >
              <figure>
                <Image
                  src="/diagram1.png"
                  alt="Foto del diagrama pendiente de añadir"
                  width={1666}
                  height={1200}
                />
              </figure>
              <div className="card-body">
                <h2 className="card-title">{diagram.name}</h2>
                <p>
                  <b>User ID: </b>
                  {diagram.userId}
                </p>
                <Link
                  href={`/board/${diagram.diagramId}`}
                  className="card-actions justify-end"
                >
                  <button className="btn btn-primary">Abrir</button>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  );
}
