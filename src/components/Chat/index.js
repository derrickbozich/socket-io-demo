import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button } from '@material-ui/core';
import { SocketContext } from '../app/context/socketProvider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';


const Chat = ({ selectedUser }) => {
    const socket = useContext(SocketContext);
    const [input, setInput] = useState('Cat in the Hat');
    const [messages, setMessages] = useState([]);

    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleSubmit = (event) => {
        event.preventDefault();
        // socket.emit('private message', { content: input, to: selectedUser.userID });
        setInput('');
    };

    useEffect(() => {


        socket.on('new message', ({ message, username }) => {
            setMessages(prev => [...prev, { message, username }])
        })

        socket.on("private message", (message) => {
            console.log('private message', message)
        });


        return () => {
            // socket.off('connect');
            // socket.off('disconnect');
            // socket.off('users');
            // socket.off('user joined');
            // socket.off('new message');
            socket.removeAllListeners();
        };
    }, []);





    const messagesList = (
        <div>
            <List>
                {messages.map((message, index) => (
                    <ListItem key={index} >
                        <ListItemText >
                            <Typography variant="h3">
                                {message.username}
                            </Typography>
                            <Typography variant="body1">
                                {message.message}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    );

  



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
        <Box>

          
                {messagesList}
                {textField}

           
        </Box>
    );
};

export default Chat;