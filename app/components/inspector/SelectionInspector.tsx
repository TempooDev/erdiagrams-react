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
  propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file
  private renderObjectDetails() {
    const selObj = this.props.selectedData;
    const dets = [];

    for (const k in selObj) {
      if (k === 'name') {
        const val = selObj[k];
        const row = (
          <tr>
            <td>
              <table>
                <thead>{k}</thead>
                <tbody>
                  <td>
                    <input value={val}></input>
                  </td>
                </tbody>
              </table>
            </td>
          </tr>
        );
      }
      if (k === 'items') {
        //si es la primer propiedad items añade un row con el nombre
        const row = <h4>Items</h4>;
        dets.push(row);
        const val = selObj[k];

        const items = (
          <tr>
            <td>
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Is Key</th>
                    <th>Type</th>
                  </tr>
                </thead>
                <tbody>
                  {val.map((item: any, index: number) => (
                    <tr key={index}>
                      <td>
                        <input value={item.name} id={item.name} />
                      </td>
                      <td>
                        <input
                          type="checkbox"
                          id={item.name}
                          name={item.name}
                          checked={item.isKey as boolean}
                          defaultChecked={item.isKey as boolean}
                        />
                      </td>
                      <td>
                        <select
                          value={item.type}
                          id={item.type}
                          defaultValue={item.type}
                        >
                          {this.propertyTypes.map((type) => (
                            <option
                              key={type}
                              value={type}
                              selected={item.type}
                            >
                              {type}
                            </option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </td>
          </tr>
        );

        dets.push(items);
      } else {
        const val = selObj[k];
        const row = (
          <tr>
            <td>
              <table>
                <thead>{k}</thead>
                <tbody>
                  <td>
                    <input value={val}></input>
                  </td>
                </tbody>
              </table>
            </td>
          </tr>
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
        <form action="">
          <table>
            <tbody>{this.renderObjectDetails()}</tbody>
          </table>
        </form>
      </div>
    );
  }
}
