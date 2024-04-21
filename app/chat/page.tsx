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
  sender: string;
  content: string;
  sentTime: Date;
};

export default function Chat({ params }: PageProp) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [user, setUser] = useState('');
  const [connection, setConnection] = useState<signalR.HubConnection | null>(
    null
  );
  useEffect(() => {
    const connect = new signalR.HubConnectionBuilder()
      .withUrl('http://localhost:5010/hub/chat')
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.Information)
      .build();
    setConnection(connect);
    connect
      .start()
      .then(() => {
        connect.on('ReceiveMessage', (sender, content, sentTime) => {
          setMessages((prev) => [...prev, { sender, content, sentTime }]);
        });
        connect.invoke('RetrieveMessageHistory');
      })

      .catch((err) =>
        console.error('Error while connecting to SignalR Hub:', err)
      );

    return () => {
      if (connection) {
        connection.off('ReceiveMessage');
      }
    };
  }, []);
  const sendMessage = async () => {
    if (connection && newMessage.trim()) {
      await connection.send('PostMessage', newMessage);
      setNewMessage('');
    }
  };
  const isMyMessage = (username: string) => {
    return connection && username === connection.connectionId;
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        {messages.map((msg, index) => (
          <div
            key={index}
            className={`p-2 my-2 rounded ${
              isMyMessage(msg.sender) ? 'bg-blue-200' : 'bg-gray-200'
            }`}
          >
            <p>{msg.content}</p>
            <p className="text-xs">{new Date(msg.sentTime).toLocaleString()}</p>
          </div>
        ))}
      </div>
      <div className="d-flex justify-row">
        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          placeholder="Enter your message"
        />

        <input
          type="text"
          className="border p-2 mr-2 rounded w-[300px]"
          value={user}
          onChange={(e) => setUser(e.target.value)}
          placeholder="Enter your username"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 text-white p-2 rounded"
        >
          Send
        </button>
      </div>
    </div>
  );
}
