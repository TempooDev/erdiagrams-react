'use client';
import Board from '@/app/components/board/Board';

interface HomeProps {
  params: {
    id: string;
  };
}
//todo fix infinity loop on load
export default function Home({ params }: HomeProps) {
  return <Board id={params.id}></Board>;
}
