import React, { useState, useEffect, useContext } from 'react';
import { Button, TextField, Typography } from '@material-ui/core';
import styles from './main.css';
import { SocketContext } from '../app/context/socketProvider';

const Chat = () => {
    const [input, setInput] = useState('');
    const [display, setDisplay] = useState([]);

    const socket = useContext(SocketContext);

    useEffect(() => {
        socket.on('server chat', (msg) => {
            console.log('server chat', msg)
            setDisplay((prev) => {
                return [...prev, msg];
            });
        });
        socket.on("users", (users) => {
            users.forEach((user) => {
                // user.self = user.userID === socket.id;
                // initReactiveProperties(user);
                console.log(user)
            });
            // put the current user first, and then sort by username
            // this.users = users.sort((a, b) => {
            //     if (a.self) return -1;
            //     if (b.self) return 1;
            //     if (a.username < b.username) return -1;
            //     return a.username > b.username ? 1 : 0;
            // });
        });
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log('client chat', input, socket.currentRoom)
        socket.emit('client chat', { input }, socket.currentRoom);
        setInput('');
    };

    const handleInputChange = (e) => {
        setInput(e.target.value);
    };
    return (
        <div className={styles.chatDivWrapper}>
            <ul className={styles.chatUl}>
                {display.map(({ input }, i) => {
                    return (
                        <li
                            key={i}
                            className={
                                i < display.length - 5
                                    ? styles.chatFloat
                                    : styles.chatMessages
                            }
                        >
                            <Typography variant="body1">{input}</Typography>
                        </li>
                    );
                })}
            </ul>

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
        </div>
    );
};



export default Chat;