import {
    DiagramActionTypes,
    DiagramState,
    INSERT_LINK,
    INSERT_NODE,
    MODIFY_LINK,
    MODIFY_MODEL,
    MODIFY_NODE,
    REMOVE_LINK,
    REMOVE_NODE,
    SET_SKIPS
} from './types';

const initialState: DiagramState = {
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
    skipsDiagramUpdate: false
};

function insertItem(array: Array<any>, action: any) {
    const newArr = array.slice();
    newArr.push(action.data);
    return newArr;
}

function modifyItem(array: Array<any>, action: any) {
    return array.map((item, index) => {
        if (index !== action.index) {
            return item;
        }
        return action.data;
    });
}

function removeItems(array: Array<any>, action: any) {
    const newArr = array.filter((item, index) => !action.keys.includes(item.key));
    action.cb(newArr);
    return newArr;
}

export const diagramReducer = (state: DiagramState | undefined = initialState, action: DiagramActionTypes): DiagramState => {
    switch (action.type) {
        case INSERT_NODE: {
            return {
                ...state,
                nodeDataArray: insertItem(state.nodeDataArray, action)
            };
        }
        case MODIFY_NODE: {
            return {
                ...state,
                nodeDataArray: modifyItem(state.nodeDataArray, action)
            };
        }
        case REMOVE_NODE: {
            return {
                ...state,
                nodeDataArray: removeItems(state.nodeDataArray, action)
            };
        }
        case INSERT_LINK: {
            return {
                ...state,
                linkDataArray: insertItem(state.linkDataArray, action)
            };
        }
        case MODIFY_LINK: {
            return {
                ...state,
                linkDataArray: modifyItem(state.linkDataArray, action)
            };
        }
        case REMOVE_LINK: {
            return {
                ...state,
                linkDataArray: removeItems(state.linkDataArray, action)
            };
        }
        case MODIFY_MODEL: {
            return {
                ...state,
                modelData: action.data
            };
        }
        case SET_SKIPS: {
            return {
                ...state,
                skipsDiagramUpdate: action.skips
            };
        }
        default: return state;
    }
};
