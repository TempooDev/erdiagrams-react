//pasar este json a un objeto de typescript
const diagrams: Diagram[] = [
    {
        id: "123",
        userId: "456",
        name: "Diagrama1",
        image: "/diagram1.png",
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
        ]
    },
    // {
    //     id: "126",
    //     userId: "456",
    //     name: "Diagrama2",
    //     image: "/diagram1.png",
    //     nodeDataArray: [
    //         {
    //             key: "Games",
    //             visibility: true,
    //             location: { x: 250, y: 250 },
    //             items: [
    //                 {
    //                     name: "GameID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "GameName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },

    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "CategoryID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         },

    //         {
    //             key: "Categories",
    //             visibility: true,
    //             location: { x: 0, y: 30 },
    //             items: [
    //                 {
    //                     name: "CategoryID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CategoryName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Description",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Icon",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: [

    //             ]
    //         },

    //     ],
    //     linkDataArray: [
    //         { from: "Games", to: "Categories", text: "0..N", toText: "1" },
    //     ]
    // },
    // {
    //     id: "124",
    //     userId: "456",
    //     name: "Diagrama3",
    //     image: "/diagram1.png",
    //     nodeDataArray: [
    //         {
    //             key: "Products",
    //             visibility: true,
    //             location: { x: 250, y: 250 },
    //             items: [
    //                 {
    //                     name: "ProductID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "ProductName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ItemDescription",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "WholesalePrice",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "ProductPhoto",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CategoryID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         },
    //         {
    //             key: "Suppliers",
    //             visibility: false,
    //             location: { x: 500, y: 0 },
    //             items: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CompanyName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ContactName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Address",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ShippingDistance",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Logo",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: []
    //         },
    //         {
    //             key: "Categories",
    //             visibility: true,
    //             location: { x: 0, y: 30 },
    //             items: [
    //                 {
    //                     name: "CategoryID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CategoryName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Description",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Icon",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         },
    //         {
    //             key: "Order Details",
    //             visibility: true,
    //             location: { x: 600, y: 350 },
    //             items: [
    //                 {
    //                     name: "OrderID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "UnitPrice",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Quantity",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Discount",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "ProductID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         }
    //     ],
    //     linkDataArray: [
    //         { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
    //         { from: "Products", to: "Categories", text: "0..N", toText: "1" },
    //         { from: "Order Details", to: "Products", text: "0..N", toText: "1" },
    //         { from: "Categories", to: "Suppliers", text: "0..N", toText: "1" }
    //     ]
    // },
    // {
    //     id: "125",
    //     userId: "456",
    //     name: "Diagrama4",
    //     image: "/diagram1.png",
    //     nodeDataArray: [
    //         {
    //             key: "Products",
    //             visibility: true,
    //             location: { x: 250, y: 250 },
    //             items: [
    //                 {
    //                     name: "ProductID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "ProductName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ItemDescription",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "WholesalePrice",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "ProductPhoto",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CategoryID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         },
    //         {
    //             key: "Suppliers",
    //             visibility: false,
    //             location: { x: 500, y: 0 },
    //             items: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CompanyName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ContactName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Address",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "ShippingDistance",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Logo",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: []
    //         },
    //         {
    //             key: "Categories",
    //             visibility: true,
    //             location: { x: 0, y: 30 },
    //             items: [
    //                 {
    //                     name: "CategoryID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "CategoryName",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Description",
    //                     iskey: false,
    //                     figure: "Hexagon",
    //                     color: "blue"
    //                 },
    //                 {
    //                     name: "Icon",
    //                     iskey: false,
    //                     figure: "TriangleUp",
    //                     color: "red"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "SupplierID",
    //                     iskey: false,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         },
    //         {
    //             key: "Order Details",
    //             visibility: true,
    //             location: { x: 600, y: 350 },
    //             items: [
    //                 {
    //                     name: "OrderID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 },
    //                 {
    //                     name: "UnitPrice",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Quantity",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 },
    //                 {
    //                     name: "Discount",
    //                     iskey: false,
    //                     figure: "Circle",
    //                     color: "green"
    //                 }
    //             ],
    //             inheriteditems: [
    //                 {
    //                     name: "ProductID",
    //                     iskey: true,
    //                     figure: "Decision",
    //                     color: "purple"
    //                 }
    //             ]
    //         }
    //     ],
    //     linkDataArray: [
    //         { from: "Products", to: "Suppliers", text: "0..N", toText: "1" },
    //         { from: "Products", to: "Categories", text: "0..N", toText: "1" },
    //         { from: "Order Details", to: "Products", text: "0..N", toText: "1" },
    //         { from: "Categories", to: "Suppliers", text: "0..N", toText: "1" }
    //     ]
    // }
    // ... más objetos con la misma estructura
];

export interface Diagram {
    id: string;
    userId: string;
    name: string;
    image: string;
    nodeDataArray: NodeData[];
    linkDataArray: LinkData[];
}

interface NodeData {
    key: string;
    visibility: boolean;
    location: { x: number; y: number };
    items: Item[];
    inheriteditems: Item[];
}

interface Item {
    name: string;
    iskey: boolean;
    figure: string;
    type: string;
    color: string;
}

interface LinkData {
    from: string;
    to: string;
    text: string;
    toText: string;
}

export default diagrams;
