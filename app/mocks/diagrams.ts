//añadir implementacion de Item donde sea necesario
const diagrams: Diagram[] = [
    {
        id: "123",
        userId: "456",
        name: "Diagrama1",
        image: "/diagram1.png",
        nodeDataArray: [
            {
                key: 1,
                name: "Products",
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
                key: 2,
                name: "Suppliers",
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
                key: 3,
                name: "Categories",
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
                name: "Order Details",
                key: 4,
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
            { from: 1, to: 2, text: "0..N", toText: "1" },
            { from: 1, to: 3, text: "0..N", toText: "1" },
            { from: 4, to: 1, text: "0..N", toText: "1" },
            { from: 2, to: 3, text: "0..N", toText: "1" },
            { from: 4, to: 3, text: "0..N", toText: "1" }
        ]
    },
    {
        id: "124",
        userId: "456",
        name: "Diagrama2",
        image: "/diagram1.png",
        nodeDataArray: [
            {
                key: 1,
                name: "Products",
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
                key: 2,
                name: "Suppliers",
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

        ],
        linkDataArray: [
            { from: 1, to: 2, text: "0..N", toText: "1" },

        ]
    },

];

export interface Diagram {
    id: string;
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
    from: number;
    to: number;
    text: string;
    toText: string;
}

export default diagrams;
