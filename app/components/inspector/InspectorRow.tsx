/*
 *  Copyright (C) 1998-2023 by Northwoods Software Corporation. All Rights Reserved.
 */

import * as React from 'react';
import './Inspector.css';

interface InspectorRowProps {
  id: string;
  value: any;
  onInputChange: (key: string, value: string, isBlur: boolean) => void;
}

export class InspectorRow extends React.PureComponent<InspectorRowProps, {}> {
  constructor(props: InspectorRowProps) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private handleInputChange(e: any) {
    this.props.onInputChange(this.props.id, e.target.value, e.type === 'blur');
  }

  public render() {
    const propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file
    let val = this.props.value;

    if (this.props.id === 'items') {
      return (
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
                {this.props.value.map((item: any, index: number) => (
                  <tr key={index}>
                    <td>
                      <input
                        value={item.name}
                        onChange={this.handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.isKey as boolean}
                        onChange={this.handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        value={item.type}
                        onChange={this.handleInputChange}
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type} selected={item.type}>
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
    }

    return (
      <tr>
        <td>
          <table>
            <thead>{this.props.id}</thead>
            <tbody>
              <td>
                <input value={val} onChange={this.handleInputChange}></input>
              </td>
            </tbody>
          </table>
        </td>
      </tr>
    );
  }
}
