import Board from '../components/board/Board';
import App from '../components/board/Board';
interface HomeProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeProps) {
  return <Board></Board>;
}
