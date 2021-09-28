import { createContext } from 'react';
import { io } from 'socket.io-client';

export const socket = io.connect('http://localhost:3000');
// export const socket = io.connect('https://socket-jockey-server-dev.herokuapp.com/');
export const SocketContext = createContext();