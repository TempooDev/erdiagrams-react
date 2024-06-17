/* eslint-disable react-hooks/rules-of-hooks */
'use client';
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from '../diagram/DiagramWrapper';

import './Board.css';

import SelectionInspector from '../inspector/SelectionInspector';
import { LinkData, NodeData } from '@/app/store/diagram/types';

import { useRouter } from 'next/router';

interface BoardState {
  selectedData: go.ObjectData | null;
  nodeDataArray: go.ObjectData[];
  linkDataArray: go.ObjectData[];
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
}

type DiagramProps = { id?: string };

class Board extends React.Component<DiagramProps, BoardState> {
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;
  keySelected = -1;

  constructor(props: any) {
    super(props);
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();

    // eslint-disable-next-line react-hooks/rules-of-hooks
    const fetchData = async () => {
      let id = useRouter().query.id;
      if (this.props.id || id) {
        id = this.props.id ?? id;
        const diagram = await getDiagram(id);
        this.setState({
          selectedData: null,
          nodeDataArray: diagram!.nodeDataArray,
          linkDataArray: diagram!.linkDataArray,
          modelData: { canRelink: true },
          skipsDiagramUpdate: true,
        });
      }

      // init maps

      this.refreshNodeIndex(this.state.nodeDataArray!);
      this.refreshLinkIndex(this.state.linkDataArray!);
      // bind handler methods
      this.handleDiagramEvent = this.handleDiagramEvent.bind(this); //event diagram change
      this.handleModelChange = this.handleModelChange.bind(this); //event model change
      this.handleInputChange = this.handleInputChange.bind(this); //event input change
    };

    fetchData();
  }

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  public handleDiagramEvent(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        this.setState(
          produce((draft: BoardState) => {
            if (sel) {
              if (sel instanceof go.Node) {
                const idx = this.mapNodeKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const nd = draft.nodeDataArray![idx];
                  draft.selectedData = nd;
                  this.keySelected = nd.key;
                }
              } else if (sel instanceof go.Link) {
                const idx = this.mapLinkKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray![idx];
                  draft.selectedData = ld;
                  this.keySelected = ld.key;
                }
              }
            } else {
              draft.selectedData = null;
            }
          })
        );
        break;
      }
      default:
        break;
    }
  }

  /**
   * Handle GoJS model changes, which output an object of data changes via Model.toIncrementalData.
   * This method iterates over those changes and updates state to keep in sync with the GoJS model.
   * @param obj a JSON-formatted string
   */
  public handleModelChange(obj: go.IncrementalData) {
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

    this.setState(
      produce((draft: BoardState) => {
        let narr = draft.nodeDataArray!;
        if (modifiedNodeData) {
          modifiedNodeData.forEach((nd: go.ObjectData) => {
            modifiedNodeMap.set(nd.key, nd);
            const idx = this.mapNodeKeyIdx.get(nd.key);
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
            const idx = this.mapNodeKeyIdx.get(key);
            if (nd && idx === undefined) {
              // nodes won't be added if they already exist
              this.mapNodeKeyIdx.set(nd.key, narr.length);
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
          this.refreshNodeIndex(narr);
        }

        let larr = draft.linkDataArray!;
        if (modifiedLinkData) {
          modifiedLinkData.forEach((ld: go.ObjectData) => {
            modifiedLinkMap.set(ld.key, ld);
            const idx = this.mapLinkKeyIdx.get(ld.key);
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
            const idx = this.mapLinkKeyIdx.get(key);
            if (ld && idx === undefined) {
              // links won't be added if they already exist
              this.mapLinkKeyIdx.set(ld.key, larr.length);
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
          this.refreshLinkIndex(larr);
        }
        // handle model data changes, for now just replacing with the supplied object
        if (modifiedModelData) {
          draft.modelData = modifiedModelData;
        }
        draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
      })
    );
    console.log(JSON.stringify(this.state.nodeDataArray));
  }

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  public handleInputChange(path: string, value: string, isBlur: boolean) {
    this.setState(
      produce((draft: BoardState) => {
        const data = draft.selectedData as go.ObjectData; // only reached if selectedData isn't null
        data[path] = value;
        if (isBlur) {
          const key = data.key;
          if (key < 0) {
            // negative keys are links
            const idx = this.mapLinkKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.linkDataArray![idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = this.mapNodeKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray![idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      })
    );
    this.keySelected = -1;
    console.log(JSON.stringify(this.state.nodeDataArray));
    this.forceUpdate();
  }

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;
    this.setState({
      modelData: { canRelink: value },
      skipsDiagramUpdate: false,
    });
  }

  /**
   * Update map of node keys to their index in the array.
   */
  private refreshNodeIndex(nodeArr: Array<go.ObjectData>) {
    this.mapNodeKeyIdx.clear();
    nodeArr.forEach((n: go.ObjectData, idx: number) => {
      this.mapNodeKeyIdx.set(n.key, idx);
    });
  }

  /**
   * Update map of link keys to their index in the array.
   */
  private refreshLinkIndex(linkArr: Array<go.ObjectData>) {
    this.mapLinkKeyIdx.clear();
    linkArr.forEach((l: go.ObjectData, idx: number) => {
      this.mapLinkKeyIdx.set(l.key, idx);
    });
  }

  /**
   * Handle any relevant DiagramEvents, in this case just selection changes.
   * On ChangedSelection, find the corresponding data and set the selectedData state.
   * @param e a GoJS DiagramEvent
   */
  public handleAddNode() {
    //todo:adaptar a la nueva estructura
  }

  public handleInspectorChange = (
    newData: go.ObjectData,
    links: LinkData[]
  ) => {
    // Crear un objeto IncrementalData que describe los cambios
    const obj: go.IncrementalData = {
      modifiedNodeData: [newData], // Supongamos que estás modificando un nodo
      modifiedLinkData: links, // Supongamos que estás modificando un enlace
      // Puedes agregar aquí cualquier otro cambio que necesites
    };
    console.log(JSON.stringify(this.state.nodeDataArray));

    // Llamar a handleModelChange para actualizar el diagrama
    this.handleModelChange(obj);
  };

  public render() {
    let inspector;
    if (this.keySelected > 0) {
      inspector = (
        <SelectionInspector
          links={this.state.linkDataArray! as LinkData[]}
          nodeDataArray={this.state.nodeDataArray! as NodeData[]}
          selectedData={this.state.selectedData!}
          onInspectorChange={this.handleInspectorChange}
        />
      );
    }

    return (
      <div className="flex flex-row">
        <div className="basis-1/2">
          <DiagramWrapper
            nodeDataArray={this.state.nodeDataArray!}
            linkDataArray={this.state.linkDataArray!}
            modelData={this.state.modelData!}
            skipsDiagramUpdate={this.state.skipsDiagramUpdate!}
            onDiagramEvent={this.handleDiagramEvent}
            onModelChange={this.handleModelChange}
          />
        </div>
        <div className="basis-1/2 items-center">
          {this.keySelected > 0 && <div className="modal-box">{inspector}</div>}
        </div>
      </div>
    );
  }

  handleSelectNode = (event: React.FormEvent) => {
    event.preventDefault();
    const node = this.state.nodeDataArray!.find(
      (x) => x.key === this.keySelected
    );
    if (node) {
      this.setState({ selectedData: node });
    }
  };
}

const getDiagram = async (id: any) => {
  let diagram;
  try {
    const response = await fetch(
      'https://api-erdiagrams.azurewebsites.net/api/diagrams/' + id
    );
    if (response.ok) {
      const json = await response.json();
      diagram = JSON.parse(json.diagram);
    } else {
      console.error('Failed to fetch data');
    }
  } catch (error) {
    console.error('Error:', error);
  }

  return __mapLocation(diagram);
};

function __mapLocation(diagram: any) {
  if (diagram) {
    diagram.nodeDataArray.forEach((node: any) => {
      node.location = new go.Point(node.location.x, node.location.y);
    });
  }
  return diagram;
}
export default Board;
