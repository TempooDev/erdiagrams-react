'use client';
import Board from '@/app/components/board/Board';
import diagrams from '@/app/mocks/diagrams';
import { useDiagramStore } from '@/app/providers/diagram-store-provider';
import { get } from 'http';

interface HomeProps {
  params: {
    id: string;
  };
}
//todo fix infinity loop on load
export default function Home({ params }: HomeProps) {
  const {
    nodeDataArray,
    linkDataArray,
    modelData,
    skipsDiagramUpdate,
    selectData,
    setNodeDataArray,
    setLinkDataArray,
  } = useDiagramStore((state) => state);
  const diagram = diagrams.find((d) => d.id === params.id);
  if (!diagram) {
    return <div>Diagram not found</div>;
  } else {
    setNodeDataArray(diagram.nodeDataArray);
    setLinkDataArray(diagram.linkDataArray);
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
}
