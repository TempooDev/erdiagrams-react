/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from '../diagram/DiagramWrapper';

import './Board.css';

import SelectionInspector from '../inspector/SelectionInspector';
import { Diagram, LinkData, NodeData } from '@/app/store/diagram/types';
import { useCallback, useEffect, useState } from 'react';

interface BoardState {
  selectedData: go.ObjectData | null;
  nodeDataArray: go.ObjectData[];
  linkDataArray: go.ObjectData[];
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
}

type DiagramProps = { diagram?: Diagram };

const Board = ({ diagram }: DiagramProps) => {
  const [selectedData, setSelectedData] = useState<go.ObjectData | null>(null);
  const [nodeDataArray, setNodeDataArray] = useState<go.ObjectData[]>(
    diagram?.nodeDataArray || []
  );
  const [linkDataArray, setLinkDataArray] = useState<go.ObjectData[]>(
    diagram?.linkDataArray || []
  );
  const [modelData, setModelData] = useState<go.ObjectData>({
    canRelink: true,
  });
  const [skipsDiagramUpdate, setSkipsDiagramUpdate] = useState<boolean>(true);
  const [keySelected, setKeySelected] = useState<number>(-1);

  const mapNodeKeyIdx = new Map<go.Key, number>();
  const mapLinkKeyIdx = new Map<go.Key, number>();

  const refreshNodeIndex = (nodeArr: Array<go.ObjectData>) => {
    mapNodeKeyIdx.clear();
    nodeArr.forEach((n, idx) => {
      mapNodeKeyIdx.set(n.key, idx);
    });
  };

  const refreshLinkIndex = (linkArr: Array<go.ObjectData>) => {
    mapLinkKeyIdx.clear();
    linkArr.forEach((l, idx) => {
      mapLinkKeyIdx.set(l.key, idx);
    });
  };

  useEffect(() => {
    if (diagram) {
      setNodeDataArray(diagram.nodeDataArray);
      setLinkDataArray(diagram.linkDataArray);
      refreshNodeIndex(diagram.nodeDataArray);
      refreshLinkIndex(diagram.linkDataArray);
    }
  }, [diagram, refreshNodeIndex, refreshLinkIndex]);

  return (
    <div className="flex flex-row">
      <div className="basis-1/2">
        <pre>{JSON.stringify(nodeDataArray)}</pre>
        <pre>{JSON.stringify(linkDataArray)}</pre>
      </div>
    </div>
  );
};
export default Board;
