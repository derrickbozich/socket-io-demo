import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField } from '@material-ui/core';
import { SocketContext } from '../app/context/socketProvider';
import Drawer from '../Drawer';
import SignUp from '../SignUp';

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

    const handleMessage = (content) => {
        if (selectedUser) {
            socket.emit("private message", {
                content,
                to: selectedUser.userID,
            });
            selectedUser.messages.push({
                content,
                fromSelf: true,
            });
        }
    }


    return (

        <Drawer users={users}>



            Connected: {`${isConnected}`}
            {isConnected === false && <SignUp />}



            

            <form onSubmit={handleSubmit}>
                <TextField
                    style={{ marginRight: '1rem', paddingTop: '1.3rem' }}
                    margin="none"
                    variant="standard"
                    onChange={handleInputChange}
                    value={input}
                    type="text"
                    placeholder="chat input"
                ></TextField>
                <Button
                    style={{
                        height: '56px',
                        marginRight: '1rem',
                        marginBottom: '1rem',
                        border: 'none',
                    }}
                    size="large"
                    variant="outlined"
                    type="submit"
                    disabled={!input}
                >
                    send
                </Button>
            </form>

        </Drawer>





    );
};



export default Chat;