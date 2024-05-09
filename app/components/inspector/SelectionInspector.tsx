import * as React from 'react';

import './Inspector.css';
import { useEffect, useState } from 'react';
import { LinkData, NodeData } from '@/app/store/diagram/types';

interface SelectionInspectorProps {
  selectedData: go.ObjectData;
  store: any;
}

const SelectionInspector: React.FC<SelectionInspectorProps> = (
  props: SelectionInspectorProps
) => {
  {
    const propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file
    const [data, setData] = useState(props.selectedData || {});

    const handleChange = (
      event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
      // TODO: change to swithc
      if (event.target.id === 'items-isKey') {
        setData({
          ...data,
          items: data.items.map((item: any, index: number) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...item,
                isKey: event.target.value === 'on' ? true : false,
              };
            }
            return item;
          }),
        });
      } else if (event.target.id === 'items-name') {
        setData({
          ...data,
          items: data.items.map((item: any, index: number) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...item,
                name: event.target.value,
              };
            }
            return item;
          }),
        });
      } else if (event.target.id === 'items-type') {
        setData({
          ...data,
          items: data.items.map((item: any, index: number) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...item,
                type: event.target.value,
              };
            }
            return item;
          }),
        });
      } else {
        setData({
          ...data,
          [event.target.name]: event.target.value,
        });
      }
    };
    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      props.store.modifyNode(data.key, data);
      props.store.setSkips(false);

      setData({});
      props.store.setSelectedData(null);
    };
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setData({}); // Limpiar data si se presiona Escape
          props.store.setSelectedData(null);
        }
      };

      window.addEventListener('keydown', handleKeyDown);

      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, [props.store]);
    return (
      <form
        className="grid grid-cols-1 gap-4 place-items-center"
        onSubmit={handleSubmit}
      >
        <label>
          Name:
          <input
            type="text"
            name="name"
            value={data.name}
            defaultValue={data.name}
            onChange={handleChange}
          />
        </label>
        <label>
          Items:
          {data.items &&
            data.items.map((item: any, index: number) => (
              <div key={index}>
                <label>
                  Name:
                  <input
                    id="items-name"
                    type="text"
                    name={`${index}`}
                    defaultValue={item.name}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Is Key:
                  <input
                    id="items-isKey"
                    type="checkbox"
                    name={`${index}`}
                    checked={item.isKey}
                    defaultChecked={item.isKey}
                    onChange={handleChange}
                  />
                </label>
                <label>
                  Type:
                  <select
                    id="items-type"
                    name={`${index}`}
                    value={item.type}
                    defaultValue={item.type}
                    onChange={handleChange}
                  >
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </label>
              </div>
            ))}
        </label>
        <button className="btn-secundary" type="submit">
          Submit
        </button>
      </form>
    );
  }
};

export default SelectionInspector;
