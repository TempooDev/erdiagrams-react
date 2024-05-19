'use client';
import { ObjectData } from 'gojs';
import Board from '../components/board/Board';
import App from '../components/board/Board';
import { useDiagramStore } from '../providers/diagram-store-provider';
import { useEffect, useState } from 'react';
import signalR from '@microsoft/signalr';
import diagrams from '../mocks/diagrams';
interface HomeProps {
  params: {
    id: string;
  };
}
export default function Home({ params }: HomeProps) {
  const store = useDiagramStore((state) => state);
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const apiURL = 'https://localhost:5001/board';
  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder().withUrl(apiURL).build();
    setConnection(connect);
    connect
      .start()
      .then(() => {
        connect.on('sendDiagram', (diagram) => {
          store.setLinkDataArray(diagram.linkDataArray);
          store.setNodeDataArray(diagram.nodeDataArray);
          store.setModelData(diagram.modelData);
          store.setSkips(diagram.skips);
        });
      })
      .catch((err) => {
        console.error('Error while connecting to SignalR Hub:', err);
      });
    return () => {
      if (connection) {
        connection.off('sendDiagram');
      }
    };
  }, [apiURL, connection]);

  return <Board store={store}></Board>;
}
