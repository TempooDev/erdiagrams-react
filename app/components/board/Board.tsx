'use client';
import * as go from 'gojs';
import * as React from 'react';

import './Board.css';

import SelectionInspector from '../inspector/SelectionInspector';
import { Diagram, LinkData, NodeData } from '@/app/store/diagram/types';
import { useState } from 'react';
import { useImmer } from 'use-immer';

interface BoardState {
  diagramName: string;
  nodeDataArray: NodeData[];
  linkDataArray: LinkData[];
  modelData: go.ObjectData;
  selectedData: NodeData | null;
  skipsDiagramUpdate: boolean;
}

interface DiagramProps {
  diagram: Diagram;
  updateDiagram: (diagram: Diagram) => void;
}

const Board: React.FC<DiagramProps> = ({ diagram, updateDiagram }) => {
  // Diagram state
  const [diagramData, updateDiagramData] = useImmer<BoardState>({
    diagramName: diagram!.name,
    nodeDataArray: diagram!.nodeDataArray,
    linkDataArray: diagram!.linkDataArray,
    modelData: {},
    selectedData: null,
    skipsDiagramUpdate: false,
  });
  const [keySelected, setKeySelected] = useState(0);
  const [isEdited, setIsEdited] = useState(false);

  const handleInspectorChange = (newData: NodeData, links: LinkData[]) => {
    console.log('newData', newData);

    updateDiagramData((draft) => {
      draft.selectedData = null;
      const index = draft.nodeDataArray.findIndex(
        (node) => node.key === newData.key
      );
      if (index !== -1) {
        draft.nodeDataArray[index] = newData;
      }
    });
    diagram.nodeDataArray = diagramData.nodeDataArray;
    diagram.linkDataArray = diagramData.linkDataArray;
    diagram.name = diagramData.diagramName;
    updateDiagram(diagram);
    if (!isEdited) {
      setIsEdited(true);
    }
  };
  const handleSelectNode = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('keySelected', keySelected);
    const node = diagramData.nodeDataArray.find((x) => x.key === keySelected);
    if (node) {
      updateDiagramData((draft) => {
        draft.selectedData = node;
      });
    }
    console.log('selectedData', node?.name);
  };

  const saveDiagram = async () => {
    // Sustituye las propiedades de diagram con nodeDataArray y linkDataArray de diagramData
    diagram.nodeDataArray = diagramData.nodeDataArray;
    diagram.linkDataArray = diagramData.linkDataArray;
    diagram.name = diagramData.diagramName;
    const url = `https://api-erdiagrams.azurewebsites.net/diagrams/${diagram.diagramId}`;

    const response = await fetch(url, {
      method: 'PUT', // Asumiendo que el endpoint requiere un método PUT para actualizar
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(diagram), // Envía el diagrama actual como cuerpo de la solicitud
    });

    if (response.ok) {
      // Manejo de la respuesta exitosa
      console.log('Diagrama guardado con éxito');
    } else {
      // Manejo de errores
      console.error(
        'Error al guardar el diagrama ',
        response.status,
        response.statusText
      );
    }
    updateDiagram(diagram);
    if (isEdited) {
      setIsEdited(false);
    }
  };

  const [inputValue, setInputValue] = useState(diagramData.diagramName);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
    updateDiagramData((draft) => {
      draft.diagramName = inputValue;
    });
    diagram.nodeDataArray = diagramData.nodeDataArray;
    diagram.linkDataArray = diagramData.linkDataArray;
    diagram.name = diagramData.diagramName;
    updateDiagram(diagram);
    if (!isEdited) {
      setIsEdited(true);
    }
  };

  const selectedData = diagramData.selectedData;
  let inspector;

  if (selectedData !== null) {
    inspector = (
      <SelectionInspector
        selectedData={diagramData.selectedData!}
        links={diagramData.linkDataArray}
        nodeDataArray={diagramData.nodeDataArray}
        onInspectorChange={handleInspectorChange}
      />
    );
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-center">
        <button
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-700"
          onClick={saveDiagram}
          disabled={!isEdited}
        >
          Guardar
        </button>
        <input
          className="border-2 border-gray-300 p-2 rounded"
          type="text"
          value={inputValue}
          onChange={handleInputChange}
        />
        <form onSubmit={handleSelectNode}>
          <input
            type="number"
            placeholder="ID Nodo"
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
              const key = parseInt(e.target.value);
              updateDiagramData((draft) => {
                draft.selectedData = null;
              });
              setKeySelected(key);
            }}
          ></input>
          <button type="submit">Select Node</button>
        </form>
      </div>
      <div className="flex justify-between items-center">
        <div className="flex-1">
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"> NODE DATA ARRAY !</h2>
              <span>{JSON.stringify(diagramData.nodeDataArray)}</span>
            </div>
          </div>
          <div className="card w-96 bg-base-100 shadow-xl">
            <div className="card-body">
              <h2 className="card-title"> LINK DATA ARRAY !</h2>
              <span>{JSON.stringify(diagramData.linkDataArray)}</span>
            </div>
          </div>
        </div>
        <div className="flex-1 m-2">
          {selectedData && <div className="modal-box">{inspector}</div>}
        </div>
      </div>
    </div>
  );
};

export default Board;
