'use client';
import * as React from 'react';
import './Inspector.css';
import { Item } from '@/app/store/diagram/types';

interface InspectorRowProps {
  id: string;
  value: any;
  store: any;
  onInputChange: (key: string, value: any, isBlur: boolean) => void;
}
interface InspectorState {
  items: Item[];
  links: go.ObjectData[];
}
export class InspectorRow extends React.PureComponent<InspectorRowProps, {}> {
  constructor(props: InspectorRowProps) {
    super(props);
    this.handleInputChange = this.handleInputChange.bind(this);
  }

  private handleInputChange(e: any) {
    const value = e.target.value;
    const name = e.target.name;
    const checked = e.target.checked;
    const type = e.target.type;
    const id = e.target.id;
    //buscar en this.props.value el objeto con el id y cambiar el valor
    if (this.props.id === 'items') {
      const items = this.props.value;
      const item = items.find((item: any) => item.name === id); //item a cambiar
      //eliminar el item y agregarlo con los nuevos valores
      const updatedItems = this.props.value.filter(
        (item: any) => item.name !== id
      ); //resto de items
      let updatedItem = item;

      if (type === 'checkbox') {
        updatedItem.isKey = checked;
      } else {
        updatedItem.name = value;
      }
      const newItems = [...updatedItems, updatedItem];
    }
  }

  public render() {
    const propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file
    let val = this.props.value;
    //crear un botón para agregar items, al crear un item se agrega un objeto con los valores por defecto

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
                        id={item.name}
                        onChange={this.handleInputChange}
                      />
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        id={item.name}
                        name={item.name}
                        checked={item.isKey}
                        defaultChecked={item.isKey}
                        onChange={this.handleInputChange}
                      />
                    </td>
                    <td>
                      <select
                        value={item.type}
                        id={item.type}
                        onChange={this.handleInputChange}
                        defaultValue={item.type}
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
