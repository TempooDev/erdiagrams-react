'use client';
import Board from '../components/board/Board';
import App from '../components/board/Board';
import { useDiagramStore } from '../providers/diagram-store-provider';
interface HomeProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeProps) {
  const {
    nodeDataArray,
    linkDataArray,
    modelData,
    skipsDiagramUpdate,
    selectData,
  } = useDiagramStore((state) => state);

  return (
    <Board
      nodeDataArray={nodeDataArray}
      linkDataArray={linkDataArray}
      modelData={modelData}
      skipsDiagramUpdate={skipsDiagramUpdate}
      selectedData={selectData}
    ></Board>
  );
}
