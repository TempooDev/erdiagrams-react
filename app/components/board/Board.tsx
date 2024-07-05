'use client';
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from '../diagram/DiagramWrapper';

import './Board.css';

import SelectionInspector from '../inspector/SelectionInspector';
import { Diagram, LinkData, NodeData } from '@/app/store/diagram/types';
import { useCallback, useEffect, useState } from 'react';
import { useImmer } from 'use-immer';

interface BoardState {
  nodeDataArray: go.ObjectData[];
  linkDataArray: go.ObjectData[];
  modelData: go.ObjectData;
  selectedData: go.ObjectData | null;
  skipsDiagramUpdate: boolean;
}

type DiagramProps = { diagram?: Diagram };
const mapLinkKeyIdx = new Map();
const mapNodeKeyIdx = new Map();

const Board = ({ diagram }: DiagramProps) => {
  // Diagram state
  const [diagramData, updateDiagramData] = useImmer<BoardState>({
    nodeDataArray: diagram!.nodeDataArray,
    linkDataArray: diagram!.linkDataArray,
    modelData: {},
    selectedData: null,
    skipsDiagramUpdate: false,
  });
  useEffect(() => {
    // init maps
    refreshNodeIndex(diagramData.nodeDataArray);
    refreshLinkIndex(diagramData.linkDataArray);
  }, []);

  /**
   * Update map of node keys to their index in the array.
   */
  const refreshNodeIndex = (nodeArr: go.ObjectData[]) => {
    mapNodeKeyIdx.clear();
    nodeArr.forEach((n, idx) => {
      mapNodeKeyIdx.set(n.key, idx);
    });
  };

  /**
   * Update map of link keys to their index in the array.
   */
  const refreshLinkIndex = (linkArr: go.ObjectData[]) => {
    mapLinkKeyIdx.clear();
    linkArr.forEach((l, idx) => {
      mapLinkKeyIdx.set(l.key, idx);
    });
  };

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  const handleDiagramEvent = (e: go.DiagramEvent) => {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        updateDiagramData((draft) => {
          if (sel) {
            if (sel instanceof go.Node) {
              const idx = mapNodeKeyIdx.get(sel.key);
              if (idx !== undefined && idx >= 0) {
                const nd = draft.nodeDataArray[idx];
                draft.selectedData = nd;
              }
            } else if (sel instanceof go.Link) {
              const idx = mapLinkKeyIdx.get(sel.key);
              if (idx !== undefined && idx >= 0) {
                const ld = draft.linkDataArray[idx];
                draft.selectedData = ld;
              }
            }
          } else {
            draft.selectedData = null;
          }
        });
        break;
      }
      default:
        break;
    }
  };

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method iterates over those changes and updates state to keep in sync with the GoJS model.
   * @param obj a JSON-formatted string
   */
  const handleModelChange = (obj: go.IncrementalData) => {
    const insertedNodeKeys = obj.insertedNodeKeys;
    const modifiedNodeData = obj.modifiedNodeData;
    const removedNodeKeys = obj.removedNodeKeys;
    const insertedLinkKeys = obj.insertedLinkKeys;
    const modifiedLinkData = obj.modifiedLinkData;
    const removedLinkKeys = obj.removedLinkKeys;
    const modifiedModelData = obj.modelData;

    // maintain maps of modified data so insertions don't need slow lookups
    const modifiedNodeMap = new Map();
    const modifiedLinkMap = new Map();
    updateDiagramData((draft) => {
      let narr = draft.nodeDataArray;
      if (modifiedNodeData) {
        modifiedNodeData.forEach((nd) => {
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
        insertedNodeKeys.forEach((key) => {
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
        narr = narr.filter((nd) => {
          if (removedNodeKeys.includes(nd.key)) {
            return false;
          }
          return true;
        });
        draft.nodeDataArray = narr;
        refreshNodeIndex(narr);
      }

      let larr = draft.linkDataArray;
      if (modifiedLinkData) {
        modifiedLinkData.forEach((ld) => {
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
        insertedLinkKeys.forEach((key) => {
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
        larr = larr.filter((ld) => {
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
  };

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  const handleInputChange = (path: string, value: any, isBlur: boolean) => {
    updateDiagramData((draft) => {
      if (!draft.selectedData) return;
      const data = draft.selectedData;
      data[path] = value;
      if (isBlur) {
        const key = data.key;
        if (key < 0) {
          // negative keys are links
          const idx = mapLinkKeyIdx.get(key);
          if (idx !== undefined && idx >= 0) {
            draft.linkDataArray[idx] = data;
            draft.skipsDiagramUpdate = false;
          }
        } else {
          const idx = mapNodeKeyIdx.get(key);
          if (idx !== undefined && idx >= 0) {
            draft.nodeDataArray[idx] = data;
            draft.skipsDiagramUpdate = false;
          }
        }
      }
    });
  };

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  const handleRelinkChange = (e: any) => {
    const target = e.target;
    const value = target.checked;
    updateDiagramData((draft) => {
      draft.modelData = { canRelink: value };
      draft.skipsDiagramUpdate = false;
    });
  };

  const selectedData = diagramData.selectedData;
  let inspector;
  // if (selectedData !== null) {
  //   inspector = (
  //     <SelectionInspector
  //       selectedData={diagramData.selectedData!}
  //       onInspectorChange={handleInputChange}
  //     />
  //   );
  // }

  return (
    <div>
      <DiagramWrapper
        nodeDataArray={diagramData.nodeDataArray}
        linkDataArray={diagramData.linkDataArray}
        modelData={diagramData.modelData}
        skipsDiagramUpdate={diagramData.skipsDiagramUpdate}
        onDiagramEvent={handleDiagramEvent}
        onModelChange={handleModelChange}
      />
      <label>
        Allow Relinking?
        <input
          type="checkbox"
          id="relink"
          checked={diagramData.modelData.canRelink}
          onChange={handleRelinkChange}
        />
      </label>
      {inspector}
    </div>
  );
};
export default Board;
