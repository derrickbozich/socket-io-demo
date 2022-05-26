import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField } from '@material-ui/core';
import { SocketContext } from '../app/context/socketProvider';
import MessagesList from '../MessagesList';
import Typography from '@mui/material/Typography';

const Chat = ({ selectedChatRecipient }) => {
    const socket = useContext(SocketContext);
    const [input, setInput] = useState('Cat in the Hat');
    const [messages, setMessages] = useState([]);

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    console.log('socket', socket)

    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit('private message', { content: input, to: selectedChatRecipient.userID });
        setInput('');
    };

    useEffect(() => {

        socket.on("private message", (message) => {
            setMessages(prev => [...prev, message])
            console.log('client on private message', message)
        });

        return () => {
            socket.off('private message');
        };
    }, [socket]);

    const textField = (
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onSubmit={handleSubmit}
        >
            <TextField
                id="outlined-name"
                label="Enter a message"
                value={input}
                onChange={handleChange}
            />

        </Box>
    )

    return (
        <>
            <Typography component='h1'>
                conversation with {selectedChatRecipient.username}
            </Typography>
            <MessagesList messages={messages} currentUserID={socket.userID} />
            {textField}
        </>

    );
};

export default Chat;