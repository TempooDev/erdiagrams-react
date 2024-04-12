'use client';
import * as go from 'gojs';
import { produce } from 'immer';
import * as React from 'react';

import { DiagramWrapper } from '../diagram/DiagramWrapper';
import { SelectionInspector } from '../inspector/SelectionInspector';

import './Board.css';
import diagrams, { Diagram } from '../../mocks/diagrams';

import { changeInspected, editInspected } from '@/app/store/inspector/action';
import { KeyService } from '@/app/utils/KeyServices';
import { useDiagramStore } from '@/app/providers/diagram-store-provider';
import { DiagramState } from '@/app/store/diagram/types';
import { StateProps, DispatchProps } from '@/app/interfaces/states';
import {
  insertLink,
  insertNode,
  modifyLink,
  modifyModel,
  modifyNode,
  removeLinks,
  removeNodes,
  setSkips,
} from '@/app/store/diagram/actions';

type DiagramProps = StateProps;

const mapStateToProps = (state: DiagramState): StateProps => {
  return {
    nodeDataArray: state.nodeDataArray,
    linkDataArray: state.linkDataArray,
    modelData: state.modelData,
    skipsDiagramUpdate: state.skipsDiagramUpdate,
    selectedData: state.selectData,
  };
};

class Board extends React.Component<DiagramProps> {
  private mapNodeKeyIdx: Map<go.Key, number>;
  private mapLinkKeyIdx: Map<go.Key, number>;
  actionCreators = {
    insertLink,
    insertNode,
    modifyLink,
    modifyModel,
    modifyNode,
    removeLinks,
    removeNodes,
    setSkips,
    changeInspected,
    editInspected,
  };
  constructor(props: any) {
    super(props);

    // init maps
    this.mapNodeKeyIdx = new Map<go.Key, number>();
    this.mapLinkKeyIdx = new Map<go.Key, number>();
    this.refreshNodeIndex(this.props.nodeDataArray);
    this.refreshLinkIndex(this.props.linkDataArray);
    // bind handler methods
    this.handleDiagramChange = this.handleDiagramChange.bind(this);
    this.handleModelChange = this.handleModelChange.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleRelinkChange = this.handleRelinkChange.bind(this);
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

  public handleDiagramChange(e: go.DiagramEvent) {
    const name = e.name;
    switch (name) {
      case 'ChangedSelection': {
        const sel = e.subject.first();
        if (sel) {
          if (sel instanceof go.Node) {
            const idx = this.mapNodeKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const nd = this.props.nodeDataArray[idx];
              this.actionCreators.changeInspected(nd);
            }
          } else if (sel instanceof go.Link) {
            const idx = this.mapLinkKeyIdx.get(sel.key);
            if (idx !== undefined && idx >= 0) {
              const ld = this.props.linkDataArray[idx];
              this.actionCreators.changeInspected(ld);
            }
          }
        } else {
          this.actionCreators.changeInspected(null);
        }
        const modal = document.getElementById(
          'my_modal_2'
        ) as HTMLDialogElement;
        modal.showModal();

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

    const narr = this.props.nodeDataArray;
    if (modifiedNodeData) {
      modifiedNodeData.forEach((nd: go.ObjectData) => {
        modifiedNodeMap.set(nd.key, nd);
        const idx = this.mapNodeKeyIdx.get(nd.key);
        if (idx !== undefined && idx >= 0) {
          this.actionCreators.modifyNode(idx, nd);
          if (
            this.props.selectedData &&
            this.props.selectedData.key === nd.key
          ) {
            this.actionCreators.changeInspected(nd);
          }
        }
      });
    }
    if (insertedNodeKeys) {
      insertedNodeKeys.forEach((key: go.Key) => {
        const nd = modifiedNodeMap.get(key);
        const idx = this.mapNodeKeyIdx.get(key);
        if (nd && idx === undefined) {
          this.mapNodeKeyIdx.set(nd.key, narr.length);
          this.actionCreators.insertNode(nd);
        }
      });
    }
    if (removedNodeKeys) {
      this.actionCreators.removeNodes(
        removedNodeKeys,
        this.refreshNodeIndex.bind(this)
      );
    }
    const larr = this.props.linkDataArray;
    if (modifiedLinkData) {
      modifiedLinkData.forEach((ld: go.ObjectData) => {
        modifiedLinkMap.set(ld.key, ld);
        const idx = this.mapLinkKeyIdx.get(ld.key);
        if (idx !== undefined && idx >= 0) {
          this.actionCreators.modifyLink(idx, ld);
          if (
            this.props.selectedData &&
            this.props.selectedData.key === ld.key
          ) {
            this.actionCreators.changeInspected(ld);
          }
        }
      });
    }
    if (insertedLinkKeys) {
      insertedLinkKeys.forEach((key: go.Key) => {
        const ld = modifiedLinkMap.get(key);
        const idx = this.mapLinkKeyIdx.get(key);
        if (ld && idx === undefined) {
          this.mapLinkKeyIdx.set(ld.key, larr.length);
          this.actionCreators.insertLink(ld);
        }
      });
    }
    if (removedLinkKeys) {
      this.actionCreators.removeLinks(
        removedLinkKeys,
        this.refreshLinkIndex.bind(this)
      );
    }
    // handle model data changes, for now just replacing with the supplied object
    if (modifiedModelData) {
      this.actionCreators.modifyModel(modifiedModelData);
    }
    this.actionCreators.setSkips(true); // the GoJS model already knows about these updates
  }

  /**
   * Handle inspector changes, and on input field blurs, update node/link data state.
   * @param path the path to the property being modified
   * @param value the new value of that property
   * @param isBlur whether the input event was a blur, indicating the edit is complete
   */
  public handleInputChange(path: string, value: string, isBlur: boolean) {
    const data = this.props.selectedData as go.ObjectData; // only reached if selectedData isn't null
    if (isBlur) {
      const key = data.key;
      if (key < 0) {
        const idx = this.mapLinkKeyIdx.get(key);
        if (idx !== undefined && idx >= 0) {
          this.actionCreators.modifyLink(idx, data);
          this.actionCreators.setSkips(false);
        }
      } else {
        const idx = this.mapNodeKeyIdx.get(key);
        if (idx !== undefined && idx >= 0) {
          this.actionCreators.modifyNode(idx, data);
          this.actionCreators.setSkips(false);
        }
      }
    } else {
      this.actionCreators.editInspected(path, value);
    }
  }

  /**
   * Handle changes to the checkbox on whether to allow relinking.
   * @param e a change event from the checkbox
   */
  public handleRelinkChange(e: any) {
    const target = e.target;
    const value = target.checked;

    this.actionCreators.modifyModel({ canRelink: value });
    this.actionCreators.setSkips(false);
  }
  public handleAddNode() {
    //todo:adaptar a la nueva estructura
    this.actionCreators.insertNode({
      key: KeyService.generate(),
      text: 'new node',
      color: 'lime',
    });
    this.actionCreators.setSkips(false);
  }
  public render() {
    const selectedData = this.props.selectedData;
    let inspector;
    if (selectedData !== null) {
      inspector = (
        <SelectionInspector
          selectedData={this.props.selectedData}
          onInputChange={this.handleInputChange}
        />
      );
    }

    return (
      <div>
        <DiagramWrapper
          nodeDataArray={this.props.nodeDataArray}
          linkDataArray={this.props.linkDataArray}
          modelData={this.props.modelData}
          skipsDiagramUpdate={this.props.skipsDiagramUpdate}
          onDiagramEvent={this.handleDiagramChange}
          onModelChange={this.handleModelChange}
        />
        <label></label>

        <dialog id="my_modal_2" className="modal">
          <div className="modal-box">
            <form method="dialog" className="modal-backdrop text-slate-50">
              {inspector}

              <button>save</button>
            </form>
          </div>
        </dialog>
      </div>
    );
  }
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
