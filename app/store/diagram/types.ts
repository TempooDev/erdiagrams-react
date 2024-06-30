import { ObjectData } from 'gojs';

export interface Diagram {
    diagramId: string;
    userId: string;
    name: string;
    image: string;
    nodeDataArray: NodeData[];
    linkDataArray: LinkData[];
}

export interface NodeData {
    key: number;
    name: string;
    visibility: boolean;
    location: { x: number; y: number };
    items: Item[];
    inheriteditems: Item[];
}

export interface Item {
    name: string;
    iskey: boolean;
    figure: string;
    type: string;
    color: string;
}

export interface LinkData {
    key: number;
    from: number;
    to: number;
    text: string;
    toText: string;
}

export interface DiagramState {
    nodeDataArray: Array<ObjectData>;
    linkDataArray: Array<ObjectData>;
    modelData: ObjectData;
    skipsDiagramUpdate: boolean;
    selectedData: ObjectData;
    modifiedLinks: Array<ObjectData> | null;
    modifiedItems: Array<Item> | null;
}
