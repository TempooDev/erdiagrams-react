'use client';
import Board from '@/app/components/board/Board';
import diagrams from '@/app/mocks/diagrams';
import { useDiagramStore } from '@/app/providers/diagram-store-provider';

interface HomeProps {
  params: {
    id: string;
  };
}
//todo fix infinity loop on load
export default function Home({ params }: HomeProps) {
  const store = useDiagramStore((state) => state);

  return <Board store={store} id={params.id}></Board>;
}
