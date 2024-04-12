import { createStore } from 'zustand'
import { ObjectData } from 'gojs';
import { DiagramState } from './diagram/types';

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
}

export type DiagramStore = DiagramState & DiagramActions;

export const defaultInitialState: DiagramState = {
    nodeDataArray: [
        {
            key: "Products",
            visibility: true,
            location: { x: 250, y: 250 },
            items: [
                {
                    name: "ProductID",
                    iskey: true,
                    type: "int",
                    figure: "Decision",
                    color: "purple"
                },
                {
                    name: "ProductNames",
                    iskey: false,
                    type: "varchar",
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "ItemDescription",
                    iskey: false,
                    type: "varchar",
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "WholesalePrice",
                    type: "varchar",
                    iskey: false,
                    figure: "Circle",
                    color: "green"
                },
                {
                    name: "ProductPhoto",
                    type: "varchar",
                    iskey: false,
                    figure: "TriangleUp",
                    color: "red"
                },
                {
                    name: "ProductStock",
                    type: "varchar",
                    iskey: false,
                    figure: "TriangleUp",
                    color: "red"
                }
            ],
            inheriteditems: [
                {
                    name: "SupplierID",
                    type: "varchar",
                    iskey: false,
                    figure: "Decision",
                    color: "purple"
                },
                {
                    name: "CategoryID",
                    type: "varchar",
                    iskey: false,
                    figure: "Decision",
                    color: "purple"
                }
            ]
        },
        {
            key: "Suppliers",
            visibility: false,
            location: { x: 500, y: 0 },
            items: [
                {
                    name: "SupplierID",
                    iskey: true,
                    type: "varchar",
                    figure: "Decision",
                    color: "purple"
                },
                {
                    name: "CompanyName",
                    type: "varchar",
                    iskey: false,
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "ContactName",
                    type: "varchar",
                    iskey: false,
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "Address",
                    type: "varchar",
                    iskey: false,
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "ShippingDistance",
                    iskey: false,
                    type: "varchar",
                    figure: "Circle",
                    color: "green"
                },
                {
                    name: "Logo",
                    iskey: false,
                    type: "varchar",
                    figure: "TriangleUp",
                    color: "red"
                }
            ],
            inheriteditems: []
        },
        {
            key: "Categories",
            visibility: true,
            location: { x: 0, y: 30 },
            items: [
                {
                    name: "CategoryID",
                    type: "varchar",
                    iskey: true,
                    figure: "Decision",
                    color: "purple"
                },
                {
                    name: "CategoryName",
                    iskey: false,
                    type: "varchar",
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "Description",
                    iskey: false,
                    type: "varchar",
                    figure: "Hexagon",
                    color: "blue"
                },
                {
                    name: "Icon",
                    type: "varchar",
                    iskey: false,
                    figure: "TriangleUp",
                    color: "red"
                }
            ],
            inheriteditems: [
                {
                    name: "SupplierID",
                    type: "varchar",
                    iskey: false,
                    figure: "Decision",
                    color: "purple"
                }
            ]
        },
        {
            key: "Order Details",
            visibility: true,
            location: { x: 600, y: 350 },
            items: [
                {
                    name: "OrderID",
                    type: "varchar",
                    iskey: true,
                    figure: "Decision",
                    color: "purple"
                },
                {
                    name: "UnitPrice",
                    iskey: false,
                    figure: "Circle",
                    type: "varchar",
                    color: "green"
                },
                {
                    name: "Quantity",
                    iskey: false,
                    type: "varchar",
                    figure: "Circle",
                    color: "green"
                },
                {
                    name: "Discount",
                    iskey: false,
                    type: "varchar",
                    figure: "Circle",
                    color: "green"
                }
            ],
            inheriteditems: [
                {
                    name: "ProductID",
                    iskey: true,
                    type: "varchar",
                    figure: "Decision",
                    color: "purple"
                }
            ]
        }
    ],
    linkDataArray: [
        { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
        { from: "Products", to: "Categories", text: "0..N", toText: "1" },
        { from: "Order Details", to: "Products", text: "0..N", toText: "1" },
        { from: "Categories", to: "Suppliers", text: "0..N", toText: "1" },
        { from: "Order Details", to: "Categories", text: "0..N", toText: "1" }
    ],
    modelData: {},
    skipsDiagramUpdate: false,
    selectData: {}
};

export const createDiagramStore = (initState: DiagramState = defaultInitialState) => {
    return createStore<DiagramStore>((set) => ({
        ...defaultInitialState,
        modifyNode: (index: number, data: ObjectData) => set((state) => ({
            nodeDataArray: state.nodeDataArray.map((node, i) => i === index ? data : node)
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
        setSelectData: (data: ObjectData) => set({ selectData: data }),
        setNodeDataArray: (data: Array<ObjectData>) => set({ nodeDataArray: data }),
        setLinkDataArray: (data: Array<ObjectData>) => set({ linkDataArray: data }),
    }));
}