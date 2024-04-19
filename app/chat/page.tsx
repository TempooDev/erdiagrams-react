'use client';
import React, { useEffect, useRef, useState } from 'react';
import * as signalR from '@microsoft/signalr';

interface PageState {
  user: string;
  message: string;
  messages: any[];
  hubConnection: any;
}
interface PageProp {
  params: PageState;
}

type Message = {
  user: string;
  content: string;
};

export default function Chat({ params }: PageProp) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [user, setUser] = useState('yo');
  const [message, setMessage] = useState('');
  const hubConnection = useRef<signalR.HubConnection | null>(null);

  useEffect(() => {
    const createHubConnection = async () => {
      const hubConnect = new signalR.HubConnectionBuilder()
        .withUrl('https://localhost:5010/hub/chat')
        .withAutomaticReconnect()
        .configureLogging(signalR.LogLevel.Information)
        .build();

      try {
        await hubConnect.start();
        console.log('Connection successful!');
        hubConnect.on('ReceiveMessage', (user: string, message: string) => {
          setMessages((messages) => [...messages, { user, content: message }]);
        });
        await hubConnect.invoke('RetrieveMessageHistory');
      } catch (err) {
        alert('Error establishing connection! Attempting to reconnect...');
      }

      hubConnection.current = hubConnect;
    };

    createHubConnection();

    return () => {
      hubConnection.current?.off('ReceiveMessage');
    };
  }, []);
  const handleSendMessage = async () => {
    if (
      hubConnection.current &&
      hubConnection.current.state === signalR.HubConnectionState.Connected &&
      message.trim()
    ) {
      await hubConnection.current.send('SendMessage', user, message);
      setMessage(''); //reset message
    } else {
      console.log('Connection not established');
    }
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div key={index} className={`p-2 my-2 rounded`}>
            <p>{msg.content}</p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-row">
        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />

        <button
          onClick={handleSendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
