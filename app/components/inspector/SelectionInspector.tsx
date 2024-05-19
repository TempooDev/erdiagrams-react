import * as React from 'react';

import './Inspector.css';
import { useEffect, useState } from 'react';
import { LinkData, NodeData } from '@/app/store/diagram/types';
import { useDiagramStore } from '@/app/providers/diagram-store-provider';
import { KeyService } from '@/app/utils/KeyServices';

interface SelectionInspectorProps {
  selectedData: go.ObjectData;

  onInspectorChange: (data: go.ObjectData, links: LinkData[]) => void;
}

const SelectionInspector: React.FC<SelectionInspectorProps> = (
  props: SelectionInspectorProps
) => {
  {
    const propertyTypes = ['varchar', 'int', 'boolean', 'date', 'float']; //TODO: move to a constant file
    const level = ['1', '0..N']; //TODO: move to a constant file
    const [data, setData] = useState(props.selectedData || {});
    const [linkData, setLinkData] = useState<LinkData[]>([]);
    const [nodeName, setNodeName] = useState<any[]>([]);
    const store = useDiagramStore((state) => state);

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

    const handleLinkChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
      if (event.target.id === 'from-level') {
        setLinkData(
          linkData.map((link, index) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...link,
                fromText: event.target.value,
              };
            }
            return link;
          })
        );
      } else if (event.target.id === 'to-level') {
        setLinkData(
          linkData.map((link, index) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...link,
                toText: event.target.value,
              };
            }
            return link;
          })
        );
      } else if (event.target.id === 'from-node') {
        setLinkData(
          linkData.map((link, index) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...link,
                from: parseInt(event.target.value),
              };
            }
            return link;
          })
        );
      } else if (event.target.id === 'to-node') {
        setLinkData(
          linkData.map((link, index) => {
            if (index === parseInt(event.target.name)) {
              return {
                ...link,
                to: parseInt(event.target.value),
              };
            }
            return link;
          })
        );
      }
    };

    const handleSubmit = (event: React.FormEvent) => {
      event.preventDefault();
      props.onInspectorChange(data, linkData);
      setData({});
      setLinkData([]);
      setNodeName([]);
    };
    useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (event.key === 'Escape') {
          setData({}); // Limpiar data si se presiona Escape
        }
      };
      let links: any[] = [];
      store.linkDataArray.map((link) => {
        if (link.from === data.key || link.to === data.key) {
          links.push(link);
        }
      });
      let names: any[] = [];
      store.nodeDataArray.map((node) => {
        names.push({ key: node.key, name: node.name });
      });
      setLinkData(links);
      setNodeName(names);
      window.addEventListener('keydown', handleKeyDown);

      // Limpiar el event listener cuando el componente se desmonte
      return () => {
        window.removeEventListener('keydown', handleKeyDown);
      };
    }, []);

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
                <br />
              </div>
            ))}
          <button
            onClick={() => {
              setData({
                ...data,
                items: [
                  ...data.items,
                  {
                    name: '',
                    isKey: false,
                    type: '',
                  },
                ],
              });
            }}
            type="button"
          >
            Add item
          </button>
        </label>

        <label>
          Relaciones:
          {linkData &&
            linkData.map((link: LinkData, index: number) => (
              <div key={index}>
                <label>
                  From:
                  <select
                    name={`${link.key}`}
                    id="from-node"
                    value={link.from}
                    defaultValue={link.from}
                    onChange={handleLinkChange}
                  >
                    {nodeName.map((node) => (
                      <option key={node.key} value={node.key}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  From level:
                  <select
                    id="from-level"
                    name={`${link.key}`}
                    value={link.text}
                    defaultValue={link.text}
                    onChange={handleLinkChange}
                  >
                    {level.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  To:
                  <select
                    name={`${link.key}`}
                    id="to-node"
                    value={link.to}
                    defaultValue={link.to}
                    onChange={handleLinkChange}
                  >
                    {nodeName.map((node) => (
                      <option key={node.key} value={node.key}>
                        {node.name}
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  To level:
                  <select
                    id="to-level"
                    name={`${link.key}`}
                    value={link.toText}
                    defaultValue={link.toText}
                    onChange={handleLinkChange}
                  >
                    {level.map((level) => (
                      <option key={level} value={level}>
                        {level}
                      </option>
                    ))}
                  </select>
                </label>
                <br />
              </div>
            ))}
          <button
            onClick={() => {
              let link = linkData;
              link.push({
                key: KeyService.generateNumber(),
                to: data.key,
                from: data.key,
                text: '1',
                toText: '1',
              });
              setLinkData(link);
            }}
            type="button"
          >
            Add link
          </button>
        </label>
        <button className="btn-secundary" type="submit">
          Submit
        </button>
      </form>
    );
  }
};

export default SelectionInspector;
