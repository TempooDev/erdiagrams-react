import * as React from 'react';

import './Inspector.css';
import { useEffect, useState } from 'react';

interface SelectionInspectorProps {
  selectedData: any;
  onInputChange: (id: string, value: any, isBlur: boolean) => void;
  store: any;
}

export default function SelectionInspector(props: SelectionInspectorProps) {
  {
    const propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file

    const [items, setItems] = useState([
      { key: '', name: '', type: '', isKey: false },
    ]);
    const [selectedData, setSelectedData] = useState(props.selectedData);

    const handleInputChange = (
      event: React.FormEvent<HTMLInputElement | HTMLSelectElement>,
      index?: any
    ) => {
      if (event.currentTarget.type === 'checkbox') {
        const list: {
          key: string;
          name: string;
          type: string;
          isKey: boolean;
        }[] = [...items];
        list[index] = {
          ...list[index],
          type: event.currentTarget.type,
          [event.currentTarget.name]: event.currentTarget.value,
        };
        setItems(list);
      }
      if (event.currentTarget.type === 'text') {
        if (event.currentTarget.id === 'name') {
          setSelectedData({
            ...selectedData,
            [event.currentTarget.id]: event.currentTarget.value,
          });
        } else {
          const list: {
            key: string;
            name: string;
            type: string;
            isKey: boolean;
          }[] = [...items];
          list[index] = {
            ...list[index],
            [event.currentTarget.name]: event.currentTarget.value,
          };
          setItems(list);
        }
      }
      if (event.currentTarget.type === 'select-one') {
        const list: {
          key: string;
          name: string;
          type: string;
          isKey: boolean;
        }[] = [...items];
        list[index] = {
          ...list[index],
          [event.currentTarget.name]: event.currentTarget.value,
        };
        setItems(list);
      }
      setSelectedData({ ...selectedData, items: items });
    };
    const handleSubmit = (event: React.FormEvent<HTMLButtonElement>) => {};

    const renderObjectDetails = () => {
      const selObj = props.selectedData;
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
                      <input
                        type="text"
                        id={k}
                        value={val}
                        onChange={handleInputChange}
                      ></input>
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
                          <input
                            type="text"
                            value={item.name}
                            id={item.name}
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="checkbox"
                            id={item.name}
                            name={item.name}
                            checked={item.isKey as boolean}
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                            defaultChecked={item.isKey as boolean}
                          />
                        </td>
                        <td>
                          <select
                            typeof="select-one"
                            onChange={(event) =>
                              handleInputChange(event, index)
                            }
                            value={item.type}
                            id={item.type}
                            defaultValue={item.type}
                          >
                            {propertyTypes.map((type) => (
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
                      <input
                        id={k}
                        onChange={handleInputChange}
                        value={val}
                      ></input>
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
    };

    return (
      <div id="myInspectorDiv" className="inspector">
        <form action="submit">
          <table>
            <tbody>{renderObjectDetails()}</tbody>
          </table>
          <button onClick={handleSubmit}>SAVE</button>
        </form>
      </div>
    );
  }
}
