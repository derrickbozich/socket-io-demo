import React, { useState, useEffect, useContext } from 'react';
// import { Button, TextField } from '@material-ui/core';
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
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        socket.on("users", (serverUsers) => {
            console.log('serverUsers', serverUsers)

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


        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket, users]);


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

    return (
        <Drawer usersList={usersList}>
            {isConnected === false && <SignUp />}

        </Drawer>
    );
};

export default Chat;