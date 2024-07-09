'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import Image from 'next/image';
import { Diagram } from '@/app/store/diagram/types';
import { useUser } from '@auth0/nextjs-auth0/client';

interface ListProps {
  token: string | undefined;
}
export default function DiagramList(props: ListProps) {
  const [data, setData] = useState([] as Diagram[]);
  const [isLoading, setLoading] = useState(true);
  const { user } = useUser();
  let token = null;
  useEffect(() => {
    if (props.token) {
      token = props.token;

      const header = new Headers();
      header.append('Authorization', 'Bearer ' + props.token);
      fetch(
        'https://api-erdiagrams.azurewebsites.net/diagrams/user/' +
          user?.nickname,
        { headers: header }
      )
        .then((res) => res.json())
        .then((data) => {
          setData(data);
          setLoading(false);
        });
    }
  }, [user, props.token]);

  if (isLoading && user)
    return (
      <div className="flex justify-center place-content-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  if (!isLoading && data.length === 0) return <h1>No diagrams found</h1>;

  return (
    <>
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
        <div className=" card card-compact w-96 bg-base-50 shadow-xl m-2">
          <div className="flex justify-center">
            <button
              onClick={() =>
                (
                  document.getElementById(
                    'form-add-diagram'
                  ) as HTMLDialogElement
                ).showModal()
              }
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-40"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 4.5v15m7.5-7.5h-15"
                />
              </svg>
            </button>
          </div>
        </div>
        <dialog id="form-add-diagram" className="modal">
          <div className="modal-box">
            <h3 className="font-bold text-lg">Hello!</h3>
            <p className="py-4">
              Press ESC key or click the button below to close
            </p>
            <div className="modal-action">
              <form method="dialog">
                {/* if there is a button in form, it will close the modal */}
                <button className="btn">Close</button>
              </form>
            </div>
          </div>
        </dialog>
      </div>
    </>
  );
}
