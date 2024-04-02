import Image from "next/image";
import diagrams from "./mocks/diagrams";

import Link from "next/link";

export default function Home() {
  return (
    <div className="flex justify-center place-content-center">
      {diagrams.map((diagram, id) => (
        <div
          className="card card-compact w-96 bg-base-50 shadow-xl m-2"
          key={id}>
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
              href={`/board/${diagram.id}`}
              className="card-actions justify-end">
              <button className="btn btn-primary">Abrir</button>
            </Link>
          </div>
        </div>
      ))}
    </div>
  );
}
