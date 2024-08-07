/*
 *  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
 */
import * as go from 'gojs';
import { ReactDiagram } from 'gojs-react';
import * as React from 'react';

import { GuidedDraggingTool } from '../../utils/GuidedDraggingTool';

import './Diagram.css';
import { useEffect } from 'react';

interface DiagramProps {
  nodeDataArray: Array<go.ObjectData>;
  linkDataArray: Array<go.ObjectData>;
  modelData: go.ObjectData;
  skipsDiagramUpdate: boolean;
  onDiagramEvent: (e: go.DiagramEvent) => void;
  onModelChange: (e: go.IncrementalData) => void;
}

export const DiagramWrapper = (props: DiagramProps) => {
  /**
   * Ref to keep a reference to the Diagram component, which provides access to the GoJS diagram via getDiagram().
   */
  const diagramRef = React.useRef<ReactDiagram>(null);

  // add/remove listeners
  // only done on mount, not any time there's a change to props.onDiagramEvent
  useEffect(() => {
    if (diagramRef.current === null) return;
    const diagram = diagramRef.current.getDiagram();
    if (diagram instanceof go.Diagram) {
      diagram.addDiagramListener('ChangedSelection', props.onDiagramEvent);
    }
    return () => {
      if (diagram instanceof go.Diagram) {
        diagram.removeDiagramListener('ChangedSelection', props.onDiagramEvent);
      }
    };
  }, []);

  /**
   * Diagram initialization method, which is passed to the ReactDiagram component.
   * This method is responsible for making the diagram and initializing the model, any templates,
   * and maybe doing other initialization tasks like customizing tools.
   * The model's data should not be set here, as the ReactDiagram component handles that.
   */
  const initDiagram = (): go.Diagram => {
    const $ = go.GraphObject.make;
    // set your license key here before creating the diagram: go.Diagram.licenseKey = "...";
    const diagram = $(go.Diagram, {
      'undoManager.isEnabled': true, // must be set to allow for model change listening
      // 'undoManager.maxHistoryLength': 0,  // uncomment disable undo/redo functionality
      'clickCreatingTool.archetypeNodeData': {
        text: 'new node',
        color: 'lightblue',
      },
      maxSelectionCount: 1, // users can select only one part at a time
      draggingTool: new GuidedDraggingTool(), // defined in GuidedDraggingTool.ts
      'draggingTool.horizontalGuidelineColor': 'blue',
      'draggingTool.verticalGuidelineColor': 'blue',
      'draggingTool.centerGuidelineColor': 'green',
      'draggingTool.guidelineWidth': 1,
      layout: $(go.ForceDirectedLayout),
      model: $(go.GraphLinksModel, {
        linkKeyProperty: 'key', // IMPORTANT! must be defined for merges and data sync when using GraphLinksModel
        // positive keys for nodes
        makeUniqueKeyFunction: (m: go.Model, data: any) => {
          let k = data.key || 1;
          while (m.findNodeDataForKey(k)) k++;
          data.key = k;
          return k;
        },
        // negative keys for links
        makeUniqueLinkKeyFunction: (m: go.GraphLinksModel, data: any) => {
          let k = data.key || -1;
          while (m.findLinkDataForKey(k)) k--;
          data.key = k;
          return k;
        },
      }),
    });
    const itemTempl = $(
      go.Panel,
      'Horizontal',
      $(
        go.TextBlock,
        { font: ' 14px sans-serif', stroke: 'black' },
        new go.Binding('text', 'name'),
        new go.Binding('stroke', '', (n) =>
          diagram.model.modelData.darkMode ? '#f5f5f5' : '#000000'
        )
      ),
      $(
        go.TextBlock,
        { font: ' 12px sans-serif', stroke: 'black' },
        new go.Binding('text', 'type', (t) => (t ? ': ' + t : '')),
        new go.Binding('stroke', '', (n) =>
          diagram.model.modelData.darkMode ? '#f5f5f5' : '#000000'
        )
      )
    );
    // define a simple Node template
    diagram.nodeTemplate = $(
      go.Node,
      'Auto', // the whole node panel
      {
        selectionAdorned: true,
        resizable: true,
        fromSpot: go.Spot.LeftRightSides,
        toSpot: go.Spot.LeftRightSides,
        isShadowed: true,
        shadowOffset: new go.Point(4, 4),
        shadowColor: '#919cab',
      },
      new go.Binding('location', 'location').makeTwoWay(),
      // whenever the PanelExpanderButton changes the visible property of the "LIST" panel,
      // clear out any desiredSize set by the ResizingTool.
      new go.Binding(
        'desiredSize',
        'visible',
        (v) => new go.Size(NaN, NaN)
      ).ofObject('LIST'),
      // define the node's outer shape, which will surround the Table
      $(
        go.Shape,
        'RoundedRectangle',
        { stroke: '#e8f1ff', strokeWidth: 4 },
        new go.Binding('fill', '', (n) =>
          diagram.model.modelData.darkMode ? '#4a4a4a' : '#f7f9fc'
        )
      ),
      // define the panel where the text will appear
      $(
        go.Panel,
        'Table',
        {
          margin: 8,
          stretch: go.GraphObject.Fill,
          width: 160,
        },
        $(go.RowColumnDefinition, {
          row: 0,
          sizing: go.RowColumnDefinition.None,
        }),
        // the table header
        $(
          go.TextBlock,
          {
            editable: true,
            row: 0,
            alignment: go.Spot.Center,
            margin: new go.Margin(0, 24, 0, 2), // leave room for Button
            font: 'bold 16px sans-serif',
          },

          new go.Binding('text', 'name'),
          new go.Binding('stroke', '', (n) =>
            diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
          )
        ),
        // the collapse/expand button
        $(
          'PanelExpanderButton',
          'LIST', // the name of the element whose visibility this button toggles
          { row: 0, alignment: go.Spot.TopRight },
          new go.Binding('ButtonIcon.stroke', '', (n) =>
            diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
          )
        ),
        $(
          go.Panel,
          'Table',
          { name: 'LIST', row: 1, stretch: go.GraphObject.Horizontal },
          $(
            go.TextBlock,
            {
              font: 'bold 15px sans-serif',
              text: 'Attributes',
              row: 0,
              alignment: go.Spot.TopLeft,
              margin: new go.Margin(8, 0, 0, 0),
            },
            new go.Binding('stroke', '', (n) =>
              diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
            )
          ),
          $(
            'PanelExpanderButton',
            'NonInherited', // the name of the element whose visibility this button toggles
            {
              row: 0,
              column: 1,
            },
            new go.Binding('ButtonIcon.stroke', '', (n) =>
              diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
            )
          ),
          $(
            go.Panel,
            'Vertical',
            {
              name: 'NonInherited',
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              itemTemplate: itemTempl,
              row: 1,
            },
            new go.Binding('itemArray', 'items')
          ),
          $(
            go.TextBlock,
            {
              font: 'bold 15px sans-serif',
              text: 'Inherited Attributes',
              row: 2,
              alignment: go.Spot.TopLeft,
              margin: new go.Margin(8, 0, 0, 0),
            },
            new go.Binding('visible', 'visibility', Boolean),
            new go.Binding('stroke', '', (n) =>
              diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
            )
          ),
          $(
            'PanelExpanderButton',
            'Inherited', // the name of the element whose visibility this button toggles
            {
              row: 2,
              column: 1,
            },
            new go.Binding('visible', 'visibility', Boolean),
            new go.Binding('ButtonIcon.stroke', '', (n) =>
              diagram.model.modelData.darkMode ? '#d6d6d6' : '#000000'
            )
          ),
          $(
            go.Panel,
            'Vertical',
            {
              name: 'Inherited',
              alignment: go.Spot.TopLeft,
              defaultAlignment: go.Spot.Left,
              itemTemplate: itemTempl,
              row: 3,
            },
            new go.Binding('itemArray', 'inheriteditems')
          )
        )
      ) // end Table Panel
    ); // end Node

    // relinking depends on modelData
    diagram.linkTemplate = $(
      go.Link, // the whole link panel
      {
        selectionAdorned: true,
        layerName: 'Background',
        reshapable: true,
        routing: go.Link.AvoidsNodes,
        corner: 5,
        curve: go.Link.JumpOver,
        isShadowed: true,
        shadowOffset: new go.Point(2, 2),
        shadowColor: '#919cab',
      },
      new go.Binding('relinkableFrom', 'canRelink').ofModel(),
      new go.Binding('relinkableTo', 'canRelink').ofModel(),
      $(
        go.Shape, // the link shape
        { stroke: '#f7f9fc', strokeWidth: 4 }
      ),
      $(
        go.Panel,
        'Auto',
        { segmentIndex: 0, segmentOffset: new go.Point(22, 0) },
        $(
          go.Shape,
          'RoundedRectangle',
          { fill: '#f7f9fc' },
          { stroke: '#eeeeee' }
        ),
        $(
          go.TextBlock, // the "from" label
          {
            textAlign: 'center',
            font: 'bold 14px sans-serif',
            stroke: 'black',
            background: '#f7f9fc',
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright,
          },
          new go.Binding('text', 'text')
        )
      ),
      $(
        go.Panel,
        'Auto',
        {
          segmentIndex: -1,
          segmentOffset: new go.Point(-13, 0),
        },
        $(
          go.Shape,
          'RoundedRectangle',
          { fill: '#edf6fc' },
          { stroke: '#eeeeee' }
        ),
        $(
          go.TextBlock, // the "to" label
          {
            textAlign: 'center',
            font: 'bold 14px sans-serif',
            stroke: 'black',
            segmentIndex: -1,
            segmentOffset: new go.Point(NaN, NaN),
            segmentOrientation: go.Link.OrientUpright,
          },
          new go.Binding('text', 'toText')
        )
      )
    );

    return diagram;
  };

  return (
    <ReactDiagram
      ref={diagramRef}
      divClassName="diagram-component"
      style={{ backgroundColor: '#f7f9fc' }}
      initDiagram={initDiagram}
      nodeDataArray={props.nodeDataArray}
      linkDataArray={props.linkDataArray}
      modelData={props.modelData}
      onModelChange={props.onModelChange}
      skipsDiagramUpdate={props.skipsDiagramUpdate}
    />
  );
};
