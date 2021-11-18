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
    const [selectedUser, setSelectedUser] = React.useState(false);





    const handleChange = (event) => {
        setInput(event.target.value);
    };

    const handleUserClick = (event) => {
        const id = event.currentTarget.dataset.userid;
        setSelectedUser(findUser(id));
        console.log('user', selectedUser )
        console.log('messages', getCurrentMessagesWith(id))
    };

    const findUser = (id) => {
        return users.find((user) => user.userID === id);
    };

    const getCurrentUser = (id) => {
        return users.find((user) => user.userID === socket.userID);
    };

    const getCurrentMessagesWith = (otherUserID) => {

        return findUser(getCurrentUser().userID).messages
                .filter(message => message.from === otherUserID || message.to === otherUserID )
    }

  



    const handleSubmit = (event) => {
        event.preventDefault();
        socket.emit('private message',  {content: input, to: selectedUser.userID} );
        setInput('');
    };

    useEffect(() => {

        socket.on("users", (serverUsers) => {

            // Set current user
            serverUsers.forEach((user) => {
                user.self = user.userID === socket.userID;
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
    });


    const usersList = (
        <div>

            <List>
                {users.map(({ username, self, connected, userID }, index) => (
                    <ListItem button key={index} data-userid={userID} onClick={handleUserClick} >
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
                {selectedUser ? (<div style={textFieldStyle}>
                    {textField}
                </div>) : ''}
                
            </div>
        </>
    );
};

export default Chat;