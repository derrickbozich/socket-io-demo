import { createContext } from 'react';
import { io } from 'socket.io-client';

const URL = "http://localhost:3001";
// const URL = "https://socket-jockey-server-dev.herokuapp.com/";

// export const socket = io.connect('http://localhost:3001');
export const socket = io(URL, { autoConnect: false });
export const SocketContext = createContext();

socket.onAny((event, ...args) => {
    console.log(event, args);
});

socket.on("connect_error", (err) => {
    if (err.message === "invalid username") {
        // this.usernameAlreadySelected = false;
        console.log(err);
    }
});