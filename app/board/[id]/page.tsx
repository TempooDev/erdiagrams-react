'use client';
import BoardNoGojs from '@/app/components/board/BoardNoGojs';
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
  }, []);
  if(isLoading) return <>Loading....</>
  
  if(!isLoading) return <BoardNoGojs diagram={diagram}></BoardNoGojs>
   return <>Nop</>
  
}
