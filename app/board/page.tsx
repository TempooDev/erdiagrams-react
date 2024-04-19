'use client';
import { ObjectData } from 'gojs';
import Board from '../components/board/Board';
import App from '../components/board/Board';
import { useDiagramStore } from '../providers/diagram-store-provider';
interface HomeProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeProps) {
  const store = useDiagramStore((state) => state);

  return <Board store={store}></Board>;
}
