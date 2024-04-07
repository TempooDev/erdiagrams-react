export interface AppState {
    diagram: DiagramState;
}

export interface DiagramState {
    nodeDataArray: Array<go.ObjectData>;
    linkDataArray: Array<go.ObjectData>;
}

//TRAER TODAS LAS INTERFACES DE LA APP