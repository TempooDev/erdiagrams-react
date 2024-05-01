/*
 *  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';

import { InspectorRow } from './InspectorRow';

import './Inspector.css';

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: any, isBlur: boolean) => void;
  store: any;
}

export class SelectionInspector extends React.PureComponent<
  SelectionInspectorProps,
  {}
> {
  /**
   * Render the object data, passing down property keys and values.
   */
  private renderObjectDetails() {
    const selObj = this.props.selectedData;
    const dets = [];

    console.log(selObj);
    for (const k in selObj) {
      if (k === 'name') {
        const val = selObj[k];
        const row = (
          <InspectorRow
            key={k}
            id={k}
            value={val}
            store={this.props.store}
            onInputChange={this.props.onInputChange}
          />
        );
      }
      if (k === 'items') {
        //si es la primer propiedad items añade un row con el nombre
        const row = <h4>Items</h4>;
        dets.push(row);
        const val = selObj[k];

        const items = (
          <InspectorRow
            key={k}
            id={k}
            value={val}
            store={this.props.store}
            onInputChange={this.props.onInputChange}
          />
        );
        dets.push(items);
      } else {
        const val = selObj[k];
        const row = (
          <InspectorRow
            key={k}
            id={k}
            value={val}
            store={this.props.store}
            onInputChange={this.props.onInputChange}
          />
        );

        dets.push(row);

        if (
          k === 'figure' ||
          k === 'color' ||
          k === 'visibility' ||
          k === 'location' ||
          k === 'inheriteditems' ||
          k === 'key'
        ) {
          dets.pop();
        }
      }
    }
    return dets;
  }

  public render() {
    return (
      <div id="myInspectorDiv" className="inspector">
        <table>
          <tbody>{this.renderObjectDetails()}</tbody>
        </table>
      </div>
    );
  }
}
