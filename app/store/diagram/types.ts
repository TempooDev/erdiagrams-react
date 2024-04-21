import { ObjectData } from 'gojs';

export interface DiagramState {
    nodeDataArray: Array<ObjectData>;
    linkDataArray: Array<ObjectData>;
    modelData: ObjectData;
    skipsDiagramUpdate: boolean;
    selectedData: ObjectData;

}
