'use client';
import Board from '@/app/components/board/Board';
import BoardNoGojs from '@/app/components/board/BoardNoGoJS';
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
  const [first, setFirst] = useState(true);
  useEffect(() => {
    if (!params.id) return;
    if (!isLoading) return;
    if (first) {
      fetch('https://api-erdiagrams.azurewebsites.net/diagrams/' + params.id)
        .then((res) => res.json())
        .then((data) => {
          setDiagram(data);
          setLoading(false);
        });
      console.log(diagram);
      setFirst(false);
    }
  }, []);
  if (isLoading) return <>Loading....</>;

  if (!isLoading) return <Board diagram={diagram}></Board>;
  return <>No existe</>;
}
