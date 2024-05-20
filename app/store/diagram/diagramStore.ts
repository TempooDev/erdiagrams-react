import { createStore } from 'zustand'
import { ObjectData } from 'gojs';
import { DiagramState, Item } from './types';

export type DiagramActions = {
    modifyNode: (index: number, data: ObjectData) => void;
    insertNode: (data: ObjectData) => void;
    removeNode: (index: number) => void;
    modifyLink: (index: number, data: ObjectData) => void;
    insertLink: (data: ObjectData) => void;
    removeLink: (index: number) => void;
    modifyModel: (data: ObjectData) => void;
    setSkips: (skips: boolean) => void;
    setNodeDataArray: (data: Array<ObjectData>) => void;
    setLinkDataArray: (data: Array<ObjectData>) => void;
    setModelData: (data: ObjectData) => void;
    setSelectedData: (data: ObjectData) => void;
    removeSelectedData: () => void;
    setModifiedLinks: (data: Array<ObjectData>) => void;
    setModifiedItems: (data: Array<Item>) => void;
    cleanModifiedItems: () => void;
    cleanModifiedLinks: () => void;
}

export type DiagramStore = DiagramState & DiagramActions;

export const defaultInitialState: DiagramState = {
    nodeDataArray: [],
    linkDataArray: [

    ],
    modelData: {},
    skipsDiagramUpdate: false,
    selectedData: {},
    modifiedLinks: null,
    modifiedItems: null
};

export const createDiagramStore = (initState: DiagramState = defaultInitialState) => {
    return createStore<DiagramStore>((set) => ({
        ...defaultInitialState,
        modifyNode: (key: number, data: ObjectData) => set((state) => ({
            nodeDataArray: state.nodeDataArray.map((node, i) => node.key === key ? data : node)
        })),
        insertNode: (data: ObjectData) => set((state) => ({
            nodeDataArray: [...state.nodeDataArray, data]
        })),
        removeNode: (index: number) => set((state) => ({
            nodeDataArray: state.nodeDataArray.filter((_, i) => i !== index)
        })),
        modifyLink: (index: number, data: ObjectData) => set((state) => ({
            linkDataArray: state.linkDataArray.map((link, i) => i === index ? data : link)
        })),
        insertLink: (data: ObjectData) => set((state) => ({
            linkDataArray: [...state.linkDataArray, data]
        })),
        removeLink: (index: number) => set((state) => ({
            linkDataArray: state.linkDataArray.filter((_, i) => i !== index)
        })),
        modifyModel: (data: ObjectData) => set({ modelData: data }),
        setSkips: (skips: boolean) => set({ skipsDiagramUpdate: skips }),
        setSelectedData: (data: ObjectData) => set({ selectedData: data }),
        setNodeDataArray: (data: Array<ObjectData>) => set({ nodeDataArray: data }),
        setLinkDataArray: (data: Array<ObjectData>) => set({ linkDataArray: data }),
        setModelData: (data: ObjectData) => set({ modelData: data }),
        removeSelectedData: () => set({ selectedData: {} }),
        setModifiedItems: (data: Array<Item>) => {
            set((state) => {
                const updatedNodeDataArray = state.nodeDataArray.map((node) => {
                    if (node.key === state.selectedData.key) {
                        return {
                            ...node,
                            items: data
                        };
                    }
                    return node;
                });
                console.log(updatedNodeDataArray);
                return {
                    modifiedItems: data,
                    nodeDataArray: updatedNodeDataArray
                };
            });
        },
        setModifiedLinks: (data: Array<ObjectData>) => set({ modifiedLinks: data }),
        cleanModifiedItems: () => set({ modifiedItems: null }),
        cleanModifiedLinks: () => set({ modifiedLinks: null })
    }));
}