import React, { useState, useEffect, useContext } from 'react';
// import io from 'socket.io-client';
import BasicModal from '../../components/Modal';
import { SocketContext } from '../../components/app/context/socketProvider';

// const socket = io('localhost:3001');

function Socket() {
    const socket = useContext(SocketContext);
    const [isConnected, setIsConnected] = useState(socket.connected);
    const [lastMessage, setLastMessage] = useState(null);
    

    const [open, setOpen] = useState(false);

    // function to handle modal open
    // const handleOpen = () => {
    //     setOpen(true);
    // };

    // function to handle modal close
    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
            setOpen(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });
        socket.on('message', data => {
            setLastMessage(data);
        });
        return () => {
            socket.off('connect');
            socket.off('disconnect');
            socket.off('message');
        };
    });

    const sendMessage = () => {
        socket.emit('hello!');
    }

    return (
        <div>
{/* 
            <p>Connected: {'' + isConnected}</p>
            <p>Last message: {lastMessage || '-'}</p>
            <button onClick={sendMessage}>Say hello!</button> */}
            < BasicModal open={open} handleClose={handleClose} />

        </div>
    );
}

export default Socket;
