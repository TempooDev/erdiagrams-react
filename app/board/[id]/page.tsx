import Board from '@/app/components/board/Board';

interface HomeProps {
  params: {
    id: string;
  };
}

export default function Home({ params }: HomeProps) {
  return <Board></Board>;
}
