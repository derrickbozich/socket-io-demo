import React, { useState, useEffect, useContext } from 'react';
import { Box, TextField, Button} from '@material-ui/core';
import { SocketContext } from '../app/context/socketProvider';
import Drawer from '../Drawer';
import SignUp from '../SignUp';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
// import Box from '@mui/material/Box';


const Chat = () => {
    const socket = useContext(SocketContext);
    const [users, setUsers] = useState([]);
    const [announcements, setAnnouncements] = useState([]);
    const [isConnected, setIsConnected] = useState(false);
    const [input, setInput] = React.useState('Cat in the Hat');
    const [messages, setMessages] = React.useState([]);




    const handleChange = (event) => {
        setInput(event.target.value);
    };

   

    const handleSubmit = (event) => {
        event.preventDefault();
        // const data = new FormData(event.currentTarget);
        socket.emit('new message',  input );
        setInput('');
      
    };

    useEffect(() => {

        socket.on("users", (serverUsers) => {
            // console.log('serverUsers', serverUsers)

            // Set current user
            serverUsers.forEach((user) => {
                user.self = user.id === socket.id;
            });

            // put the current user first, and then sort by username
            serverUsers = serverUsers.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(serverUsers);
        });

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on('user joined', ({ username, id }) => {
            const msg = `${username} joined the chat - ${id}`;
            setAnnouncements(prev => [...prev, msg])
        })

        socket.on('new message', ({ message, username}) => {
            setMessages(prev => [...prev, {message, username}])
        })

        socket.on("session", ({ sessionID, userID }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            socket.userID = userID;
        });

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                // this.usernameAlreadySelected = false;
                console.log(err)
            }
        });


        return () => {
            // socket.off('connect');
            // socket.off('disconnect');
            // socket.off('users');
            // socket.off('user joined');
            // socket.off('new message');
            socket.removeAllListeners();
        };
    });


    const usersList = (
        <div>

            <List>
                {users.map(({ username, self, connected, id }, index) => (
                    <ListItem button key={index} id={id} >
                        <ListItemIcon>
                            < PersonOutlineIcon />
                        </ListItemIcon>
                        <ListItemText >
                            <Typography variant="body1">
                                {username}
                                {self ? " (yourself)" : ''}
                            </Typography>
                            <Typography variant="body1">
                                {connected ? 'Online' : "Offline"}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const announcementsList = (
        <div>
            <List>
                {announcements.map((announcement, index) => (
                    <ListItem key={index} >
                        <ListItemText >
                            <Typography variant="body1">
                                {announcement}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>
        </div>
    );

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

    const style = {
        marginLeft: '100px'
    };

    const textFieldStyle = {
        position: 'fixed',
        bottom: 0
    }

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
            <Drawer usersList={usersList}>
                {isConnected === false && <SignUp />}
            </Drawer>
            <div style={style}>
                {announcementsList}
                {messagesList}
                <div style={textFieldStyle}>
                    {textField}
                    
                </div>
            </div>
        </>
    );
};

export default Chat;