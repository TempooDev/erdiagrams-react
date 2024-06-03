'use client';
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from '../diagram/DiagramWrapper';

import './Board.css';

import { KeyService } from '@/app/utils/KeyServices';
import { DiagramStore } from '@/app/store';
import SelectionInspector from '../inspector/SelectionInspector';
import { LinkData } from '@/app/store/diagram/types';
import diagrams from '@/app/mocks/diagrams';

interface BoardState {
  selectedData: go.ObjectData | null;
  nodeDataArray: go.ObjectData[];
  linkDataArray: go.ObjectData[];
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
}

type DiagramProps = { store: DiagramStore; id?: string };

class Board extends React.Component<DiagramProps, BoardState> {
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;
  keySelected = 0;
  constructor(props: any) {
    super(props);

    if (this.props.id) {
      const diagram = getDiagram(this.props.id);
      this.props.store.setNodeDataArray(diagram!.nodeDataArray);
      this.props.store.setLinkDataArray(diagram!.linkDataArray);
    }
    this.state = {
      selectedData: this.props.store.selectedData,
      nodeDataArray: this.props.store.nodeDataArray,
      linkDataArray: this.props.store.linkDataArray,
      modelData: this.props.store.modelData,
      skipsDiagramUpdate: this.props.store.skipsDiagramUpdate,
    };
    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.state.nodeDataArray);
    this.refreshLinkIndex(this.state.linkDataArray);
    // bind handler methods
    this.handleDiagramEvent = this.handleDiagramEvent.bind(this); //event diagram change
    this.handleModelChange = this.handleModelChange.bind(this); //event model change
    this.handleInputChange = this.handleInputChange.bind(this); //event input change

    this.props.store.modifyModel({ canRelink: true });
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
                  const nd = draft.nodeDataArray[idx];
                  draft.selectedData = nd;
                  this.keySelected = nd.key;
                }
              } else if (sel instanceof go.Link) {
                const idx = this.mapLinkKeyIdx.get(sel.key);
                if (idx !== undefined && idx >= 0) {
                  const ld = draft.linkDataArray[idx];
                  draft.selectedData = ld;
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
        let narr = draft.nodeDataArray;
        narr ?? this.props.store.setNodeDataArray(narr);
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

        let larr = draft.linkDataArray;
        larr ?? this.props.store.setLinkDataArray(larr);
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
          this.props.store.modifyModel(draft.modelData);
        }
        draft.skipsDiagramUpdate = true; // the GoJS model already knows about these updates
        this.props.store.setSkips(true);
      })
    );
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
              draft.linkDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          } else {
            const idx = this.mapNodeKeyIdx.get(key);
            if (idx !== undefined && idx >= 0) {
              draft.nodeDataArray[idx] = data;
              draft.skipsDiagramUpdate = false;
            }
          }
        }
      })
    );
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
    this.props.store.insertNode({
      key: KeyService.generate(),
      text: 'new node',
      color: 'lime',
    });
    this.props.store.setSkips(false);
  }

  public handleInspectorChange = (
    newData: go.ObjectData,
    links: LinkData[]
  ) => {
    this.props.store.setLinkDataArray(links);
    this.props.store.modifyNode(newData.key, newData);
    this.props.store.setSelectedData({});

    // Crear un objeto IncrementalData que describe los cambios
    const obj: go.IncrementalData = {
      modifiedNodeData: [newData], // Supongamos que estás modificando un nodo
      modifiedLinkData: links, // Supongamos que estás modificando un enlace
      // Puedes agregar aquí cualquier otro cambio que necesites
    };

    // Llamar a handleModelChange para actualizar el diagrama
    this.handleModelChange(obj);
  };

  public render() {
    const selectedData: go.ObjectData = this.state.selectedData!;
    let inspector;
    if (Object.keys(selectedData).length > 0) {
      inspector = (
        <SelectionInspector
          selectedData={selectedData}
          onInspectorChange={this.handleInspectorChange}
        />
      );
    }

    return (
      <div className="flex flex-row">
        <div className="basis-1/2">
          {/* <div className="card w-96 bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title"> NODE DATA ARRAY </h2>
              <span>{JSON.stringify(this.props.store.nodeDataArray)}</span>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-md">
            <div className="card-body">
              <h2 className="card-title"> LINK DATA ARRAY </h2>
              <span>{JSON.stringify(this.props.store.linkDataArray)}</span>
            </div>
          </div> */}

          <DiagramWrapper
            nodeDataArray={this.state.nodeDataArray}
            linkDataArray={this.state.linkDataArray}
            modelData={this.state.modelData}
            skipsDiagramUpdate={this.state.skipsDiagramUpdate}
            onDiagramEvent={this.handleDiagramEvent}
            onModelChange={this.handleModelChange}
          />
        </div>
        <div className="basis-1/2 items-center">
          {/* <form className="" onSubmit={this.handleSelectNode}>
            <input
              placeholder="ID Nodo"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                this.props.store.removeSelectedData();
                this.keySelected = parseInt(e.target.value);
              }}
            ></input>
            <button type="submit">Select Node</button>
          </form> */}
          {Object.keys(selectedData).length > 0 && (
            <div className="modal-box">{inspector}</div>
          )}
        </div>
      </div>
    );
  }

  handleSelectNode = (event: React.FormEvent) => {
    event.preventDefault();
    const node = this.props.store.nodeDataArray.find(
      (x) => x.key === this.keySelected
    );
    if (node) {
      this.props.store.setSelectedData(node);
    }
  };
}

function getDiagram(id: any) {
  let diagram = diagrams.find((diagram) => diagram.id === id);

  return __mapLocation(diagram);
}

function __mapLocation(diagram: any) {
  if (diagram) {
    diagram.nodeDataArray.forEach((node: any) => {
      node.location = new go.Point(node.location.x, node.location.y);
    });
  }
  return diagram;
}
export default Board;
