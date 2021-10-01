import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField } from '@material-ui/core';
import { SocketContext } from '../app/context/socketProvider';
import Drawer from '../Drawer';
import SignUp from '../SignUp';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';


const Chat = () => {
    const socket = useContext(SocketContext);
    const [input, setInput] = useState('');
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isConnected, setIsConnected] = useState(false);

    useEffect(() => {

        socket.on("users", (users) => {
            users.forEach((user) => {
                user.self = user.userID === socket.id;
                // initReactiveProperties(user);
            });
            // put the current user first, and then sort by username
            users = users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(users);
            // console.log(users)
        });

        socket.on("user connected", (user) => {
            // initReactiveProperties(user);
            setUsers(prevUsers => [...prevUsers, user]);
        });

        socket.on("connect", () => {
            console.log('CONNECTED')
            let newArr = [...users]; // copying the old datas array

            newArr.forEach((user) => {
                if (user.self) {
                    user.connected = true;
                }
            });

            setUsers(newArr);
            setIsConnected(true);
            // console.log('update users arr', users)


        });

        socket.on("disconnect", () => {
            let newArr = [...users]; // copying the old datas array

            newArr.forEach((user) => {
                if (user.self) {
                    user.connected = false;
                }
            });

            setUsers(newArr);
            setIsConnected(false);
            // console.log('update users arr', users)

        });

        socket.on("private message", ({ content, from }) => {
            for (let i = 0; i < users.length; i++) {
                const user = users[i];
                if (user.userID === from) {
                    user.messages.push({
                        content,
                        fromSelf: false,
                    });
                    if (user !== selectedUser) {
                        user.hasNewMessages = true;
                    }
                    break;
                }
            }
        });



        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket, users, selectedUser]);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('client chat', input, socket.currentRoom)
        socket.emit('client chat', { input }, socket.currentRoom);
        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const handleUserSelect = e => {
        

        const selectedUser = users.find(user => {
            return user.userID === e.currentTarget.id
        })

        setSelectedUser(selectedUser);

        console.log('SELECTED A USER', selectedUser);
    }

    const handleMessage = (content) => {
        if (selectedUser) {
            socket.emit("private message", {
                content,
                to: selectedUser.userID,
            });
            console.log('private message', content)
            // selectedUser.messages.push({
            //     content,
            //     fromSelf: true,
            // });
        }
    }

    const textInput =
        <Box
            component="form"
            sx={{
                '& > :not(style)': { m: 1, width: '25ch' },
            }}
            noValidate
            autoComplete="off"
            onChange={handleInputChange}
            value={input}
            onSubmit={handleSubmit}
        >
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <Button

             
                variant="outlined"
                type="submit"
               
               
               
            >
                send
            </Button>
        
        </Box>
       


    const usersList = (
        <div>

            <List>
                {users.map(({ username, self, connected, userID }, index) => (
                    <ListItem button key={index} id={userID} onClick={handleUserSelect}>
                        <ListItemIcon>
                            < PersonOutlineIcon />
                        </ListItemIcon>
                        <ListItemText >
                            <Typography variant="body1">
                                {username}
                                {self ? " (yourself)" : ''}
                                {connected}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>



        </div>
    );


    return (
        <Drawer usersList={usersList}>
            Connected: {`${isConnected}`}
            {isConnected === false && <SignUp />}
            {isConnected === true && textInput}
        </Drawer>
    );
};



export default Chat;