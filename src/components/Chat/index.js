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
            });
            // put the current user first, and then sort by username
            users = users.sort((a, b) => {
                if (a.self) return -1;
                if (b.self) return 1;
                if (a.username < b.username) return -1;
                return a.username > b.username ? 1 : 0;
            });
            setUsers(users);
        });

        socket.on("user connected", (user) => {
            // console.log('user connected', user)
            setUsers(prevUsers => [...prevUsers, user]);
        });
        socket.on("user disconnected", (userID) => {
            // console.log('user connected', user)
            // let arr = [...users]

            const arr = users.filter(function (tempUser) {
                return tempUser.userID !== userID
            })
            setUsers(arr);
        });

        socket.on("connect", () => {
            // let newArr = [...users]; // copying the old datas array

            // newArr.forEach((user) => {
            //     if (user.self) {
            //         user.connected = true;
            //     }
            // });

            // console.log('connect', newArr)

            // setUsers(newArr);
            setIsConnected(true);

        });

        // socket.on("disconnect", () => {
        //     let newArr = [...users]; // copying the old datas array

        //     newArr.forEach((user) => {
        //         if (user.self) {
        //             user.connected = false;
        //         }
        //     });

        //     setUsers(newArr);
        //     setIsConnected(false);

        // });

        // socket.on("private message", ({ content, from }) => {
        //     const usersClone = [...users]
           

        //     usersClone.forEach((user) => {
        //         if (user.userID === from) {
        //             user.messages.push({
        //                 content,
        //                 fromSelf: false,
        //             });
        //             if (user !== selectedUser) {
        //                 user.hasNewMessages = true;  s
        //             }
        //             return;
        //         }
        //     })

        //     setUsers(usersClone);
            
        // });



        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    }, [socket]);

    // const handleSubmit = (e) => {
    //     e.preventDefault();
    //     // console.log('client chat', input, socket.currentRoom)
    //     socket.emit('client chat', { input }, socket.currentRoom);
    //     setInput('');
    // };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };

    const findUser = (id, users) => {
        return users.find(user => {
            return user.userID === id
        })
    }

    const handleUserSelect = e => {


        const selectedUser = findUser(e.currentTarget.id, users)



        setSelectedUser(selectedUser);
    }

    const handleMessage = () => {
        if (selectedUser) {
            socket.emit("private message", {
                input,
                to: selectedUser.userID,
            });
            console.log('private message', input, selectedUser)
            let usersClone = [...users];
            // usersClone[]

            let tempUser = findUser(selectedUser.userID, users)
            tempUser.messages.push({
                input,
                fromSelf: true,
            })

            console.log('users clone', usersClone, tempUser)
            // setInput('');





            // userClone
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

        >
            <TextField id="outlined-basic" label="Outlined" variant="outlined" />
            <Button
                variant="outlined"
                // type="submit"
                onClick={handleMessage}
            >
                send
            </Button>

        </Box>



    const usersList = (
        <div>

            <List>
                {users.map(({ username, self, connected, userID }, index) => (
                    <ListItem button key={index} id={userID} onClick={handleUserSelect} selected={selectedUser && selectedUser.userID === userID}>
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
    const messages = (
        <div>

            <List>
                {selectedUser && selectedUser.messages.map((message, index) => (
                    <>
                        <h1>Message</h1>
                    </>
                ))}
            </List>



        </div>
    );


    return (
        <Drawer usersList={usersList}>
            {/* Connected: {`${isConnected}`} */}
            {isConnected === false && <SignUp />}
            {isConnected === true && textInput}
        </Drawer>
    );
};



export default Chat;