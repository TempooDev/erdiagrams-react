'use client';
import React, { useState } from 'react';
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
export default function Home({ params }: PageProp) {
  params = {
    user: '',
    message: '',
    messages: [],
    hubConnection: null,
  };

  const hubConnection = new signalR.HubConnectionBuilder()
    .withUrl('http://localhost:5010/hub/board')
    .configureLogging(signalR.LogLevel.Information)
    .build();

  hubConnection
    .start()
    .then(() => {})
    .catch((err) => console.error(err.toString()));
  hubConnection.on('JoinGroup', (message) => {
    console.log('JoinGroup', message);
  });

  const handleSendMessage = (message: string) => {};

  return (
    <div>
      <input type="text" placeholder="Type your message" />
      <input type="text" placeholder="User" />
      <button onClick={() => handleSendMessage('Hello!')}>Send</button>
    </div>
  );
}
