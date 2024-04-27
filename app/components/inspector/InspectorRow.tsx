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

  private formatLocation(loc: string): string {
    const locArr = loc.split(' ');
    if (locArr.length === 2) {
      const x = parseFloat(locArr[0]);
      const y = parseFloat(locArr[1]);
      if (!isNaN(x) && !isNaN(y)) {
        return `${x.toFixed(0)} ${y.toFixed(0)}`;
      }
    }
    return loc;
  }
  private formatItems(items: any): any {
    let str = [];
    for (let i = 0; i < items.length; i++) {
      str.push(items[i].name);
    }
    return str;
  }
  public render() {
    const propertyTypes = ['VARCHAR', 'INTEGER', 'BOOLEAN', 'DATE', 'FLOAT'];
    let val = this.props.value;
    if (this.props.id === 'loc') {
      val = this.formatLocation(this.props.value);
    }
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
                        onChange={(e) =>
                          this.props.onInputChange(
                            `${this.props.id}.${index}.name`,
                            e.target.value,
                            false
                          )
                        }
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        checked={item.isKey as boolean}
                        onChange={(e) =>
                          this.props.onInputChange(
                            `${this.props.id}.${index}.isKey`,
                            e.target.checked.toString(),
                            false
                          )
                        }
                      />
                    </td>
                    <td>
                      <select
                        value={item.type}
                        onChange={(e) =>
                          this.props.onInputChange(
                            `${this.props.id}.${index}.type`,
                            e.target.value,
                            false
                          )
                        }
                      >
                        {propertyTypes.map((type) => (
                          <option key={type} value={type}>
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
