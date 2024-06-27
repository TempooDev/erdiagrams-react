'use client';
import Board from '@/app/components/board/Board';
import { Diagram } from '@/app/store/diagram/types';
import { useEffect, useState } from 'react';

interface HomeProps {
  params: {
    id: string;
  };
}
//todo fix infinity loop on load
export default function Home({ params }: HomeProps) {
  const [diagram, setDiagram] = useState({} as Diagram);
  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    fetch('https://api-erdiagrams.azurewebsites.net/diagrams/' + params.id)
      .then((res) => res.json())
      .then((data) => {
        setDiagram(data);
        setLoading(false);
      });
    console.log(diagram);
  }, [diagram, params.id]);
  return (
    <>
      {isLoading && <>Loading....</>}
      {!isLoading && <Board diagram={diagram}></Board>}
    </>
  );
}
