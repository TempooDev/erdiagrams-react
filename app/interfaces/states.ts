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
import { changeInspected, editInspected } from '@/app/store/inspector/action';

export interface StateProps {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
    modelData: go.ObjectData;
    skipsDiagramUpdate: boolean;
    selectedData: go.ObjectData | null;
}

export interface DispatchProps {
    insertLink: typeof insertLink;
    insertNode: typeof insertNode;
    modifyLink: typeof modifyLink;
    modifyModel: typeof modifyModel;
    modifyNode: typeof modifyNode;
    removeLinks: typeof removeLinks;
    removeNodes: typeof removeNodes;
    setSkips: typeof setSkips;
    changeInspected: typeof changeInspected;
    editInspected: typeof editInspected;
}