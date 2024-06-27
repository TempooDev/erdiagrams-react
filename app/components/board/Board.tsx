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

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mapNodeKeyIdx = new Map<go.Key, number>();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const mapLinkKeyIdx = new Map<go.Key, number>();

  const refreshNodeIndex = useCallback(
    (nodeArr: Array<go.ObjectData>) => {
      mapNodeKeyIdx.clear();
      nodeArr.forEach((n, idx) => {
        mapNodeKeyIdx.set(n.key, idx);
      });
    },
    [mapNodeKeyIdx]
  );

  const refreshLinkIndex = useCallback(
    (linkArr: Array<go.ObjectData>) => {
      mapLinkKeyIdx.clear();
      linkArr.forEach((l, idx) => {
        mapLinkKeyIdx.set(l.key, idx);
      });
    },
    [mapLinkKeyIdx]
  );

  useEffect(() => {
    if (diagram) {
      setNodeDataArray(diagram.nodeDataArray);
      setLinkDataArray(diagram.linkDataArray);
      refreshNodeIndex(diagram.nodeDataArray);
      refreshLinkIndex(diagram.linkDataArray);
    }
  }, [diagram, refreshNodeIndex, refreshLinkIndex]);

  const handleDiagramEvent = useCallback(
    (e: go.DiagramEvent) => {
      const name = e.name;
      if (name === 'ChangedSelection') {
        const sel = e.subject.first();
        if (sel) {
          if (sel instanceof go.Node) {
            const idx = mapNodeKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const nd = nodeDataArray[idx];
              setSelectedData(nd);
              setKeySelected(nd.key);
            }
          } else if (sel instanceof go.Link) {
            const idx = mapLinkKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const ld = linkDataArray[idx];
              setSelectedData(ld);
              setKeySelected(ld.key);
            }
          }
        } else {
          setSelectedData(null);
        }
      }
    },
    [mapNodeKeyIdx, nodeDataArray, mapLinkKeyIdx, linkDataArray]
  );

  const handleModelChange = useCallback(
    (obj: go.IncrementalData) => {
      const insertedNodeKeys = obj.insertedNodeKeys;
      const modifiedNodeData = obj.modifiedNodeData;
      const removedNodeKeys = obj.removedNodeKeys;
      const insertedLinkKeys = obj.insertedLinkKeys;
      const modifiedLinkData = obj.modifiedLinkData;
      const removedLinkKeys = obj.removedLinkKeys;
      const modifiedModelData = obj.modelData;

      // maintain maps of modified data so insertions don't need slow lookups
      const modifiedNodeMap = new Map<go.Key, go.ObjectData>();
      const modifiedLinkMap = new Map<go.Key, go.ObjectData>();

      produce((draft: BoardState) => {
        let narr = draft.nodeDataArray!;
        if (modifiedNodeData) {
          modifiedNodeData.forEach((nd: go.ObjectData) => {
            modifiedNodeMap.set(nd.key, nd);
            const idx = mapNodeKeyIdx.get(nd.key);
            if (idx !== undefined && idx >= 0) {
              narr[idx] = nd;
              if (draft.selectedData && draft.selectedData.key === nd.key) {
                draft.selectedData = nd;
              }
            }
          });
        }
        if (insertedNodeKeys) {
          insertedNodeKeys.forEach((key: go.Key) => {
            const nd = modifiedNodeMap.get(key);
            const idx = mapNodeKeyIdx.get(key);
            if (nd && idx === undefined) {
              // nodes won't be added if they already exist
              mapNodeKeyIdx.set(nd.key, narr.length);
              narr.push(nd);
            }
          });
        }
        if (removedNodeKeys) {
          narr = narr.filter((nd: go.ObjectData) => {
            if (removedNodeKeys.includes(nd.key)) {
              return false;
            }
            return true;
          });
          draft.nodeDataArray = narr;
          refreshNodeIndex(narr);
        }

        let larr = draft.linkDataArray!;
        if (modifiedLinkData) {
          modifiedLinkData.forEach((ld: go.ObjectData) => {
            modifiedLinkMap.set(ld.key, ld);
            const idx = mapLinkKeyIdx.get(ld.key);
            if (idx !== undefined && idx >= 0) {
              larr[idx] = ld;
              if (draft.selectedData && draft.selectedData.key === ld.key) {
                draft.selectedData = ld;
              }
            }
          });
        }
        if (insertedLinkKeys) {
          insertedLinkKeys.forEach((key: go.Key) => {
            const ld = modifiedLinkMap.get(key);
            const idx = mapLinkKeyIdx.get(key);
            if (ld && idx === undefined) {
              // links won't be added if they already exist
              mapLinkKeyIdx.set(ld.key, larr.length);
              larr.push(ld);
            }
          });
        }
        if (removedLinkKeys) {
          larr = larr.filter((ld: go.ObjectData) => {
            if (removedLinkKeys.includes(ld.key)) {
              return false;
            }
            return true;
          });
          draft.linkDataArray = larr;
          refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
          draft.modelData = modifiedModelData;
        }
        draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
      });
    },
    [mapLinkKeyIdx, mapNodeKeyIdx, refreshLinkIndex, refreshNodeIndex]
  );

  const handleInputChange = useCallback(
    (path: string, value: string, isBlur: boolean) => {
      produce((draft: BoardState) => {
        const data = draft.selectedData as go.ObjectData; // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
          const key = data.key;
          if (key < 0) {
            // negative keys are links
            const idx = mapLinkKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.linkDataArray![idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = mapNodeKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray![idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      });

      setKeySelected(-1);
    },
    [mapLinkKeyIdx, mapNodeKeyIdx]
  );

  const handleRelinkChange = useCallback((e: any) => {
    const target = e.target;
    const value = target.checked;
    setModelData({ canRelink: value });
    setSkipsDiagramUpdate(false);
  }, []);

  const handleInspectorChange = useCallback(
    (newData: go.ObjectData, links: LinkData[]) => {
      // Crear un objeto IncrementalData que describe los cambios
      const obj: go.IncrementalData = {
        modifiedNodeData: [newData], // Supongamos que estás modificando un nodo
        modifiedLinkData: links, // Supongamos que estás modificando un enlace
        // Puedes agregar aquí cualquier otro cambio que necesites
      };
      console.log(JSON.stringify(nodeDataArray));

      // Llamar a handleModelChange para actualizar el diagrama
      handleModelChange(obj);
    },
    [handleModelChange, nodeDataArray]
  );

  let inspector;
  if (keySelected > 0) {
    inspector = (
      <SelectionInspector
        links={linkDataArray as LinkData[]}
        nodeDataArray={nodeDataArray as NodeData[]}
        selectedData={selectedData!}
        onInspectorChange={handleInspectorChange}
      />
    );
  }

  return (
    <div className="flex flex-row">
      <div className="basis-1/2">
        <DiagramWrapper
          nodeDataArray={nodeDataArray}
          linkDataArray={linkDataArray}
          modelData={modelData}
          skipsDiagramUpdate={skipsDiagramUpdate}
          onDiagramEvent={handleDiagramEvent}
          onModelChange={handleModelChange}
        />
      </div>
      <div className="basis-1/2 items-center">
        {keySelected > 0 && <div className="modal-box">{inspector}</div>}
      </div>
    </div>
  );
};
export default Board;
