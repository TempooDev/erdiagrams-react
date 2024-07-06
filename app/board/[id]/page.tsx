'use client';
import Board from '@/app/components/board/Board';
import { Diagram } from '@/app/store/diagram/types';
import signalR, { HubConnectionBuilder } from '@microsoft/signalr';
import { useEffect, useState } from 'react';

interface HomeProps {
  params: {
    id: string;
  };
}
//todo fix infinity loop on load
export default function Home({ params }: HomeProps) {
  const [diagram, setDiagram] = useState<Diagram | undefined>(undefined);
  const [isLoading, setLoading] = useState(true);

  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  const apiURL = 'https://api-erdiagrams.azurewebsites.net/';

  useEffect(() => {
    const fetchData = async () => {
      if (!params.id) return;
      if (!isLoading) return;

      fetch(apiURL + '/diagrams/' + params.id)
        .then((res) => res.json())
        .then((data) => {
          setDiagram(data);
          setLoading(false);
        });
      console.log(diagram);
    };

    const initSignalRConnection = async () => {
      const connection = new HubConnectionBuilder()
        .withUrl(apiURL + 'hub/board')
        .withAutomaticReconnect()
        .build();

      try {
        await connection.start();
        console.log('SignalR Connected');
        setConnection(connection);
        connection.on('ReceiveMessage', (message) => {
          console.log('Message received:', message);
          // Actualiza el estado o maneja el mensaje como sea necesario
        });
      } catch (error) {
        console.error('SignalR Connection Error:', error);
      }
    };

    fetchData();
    initSignalRConnection();

    return () => {
      connection?.stop().then(() => console.log('SignalR Disconnected'));
    };
  }, [params.id]); // Asegúrate de incluir params.id si su valor puede cambiar y afectar la lógica de carga

  if (isLoading) return <>Loading....</>;

  if (diagram) return <Board diagram={diagram}></Board>;
  return <>No existe</>;
}
