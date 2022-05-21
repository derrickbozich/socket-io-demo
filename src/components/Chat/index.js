import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField} from '@material-ui/core';
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
        socket.emit('private message', { content: input, to: selectedUser.userID });
        setInput('');
    };
    console.log('messages', messages)

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
        <Box>
            <List>
                {messages.map((message, index) => (
                    <ListItem key={index} >
                        <ListItemText >
                            <Typography variant="h3">
                                {message.content}
                            </Typography>
                            <Typography variant="body1">
                                {message.from}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
            {textField}
        </Box>
    );
};

export default Chat;