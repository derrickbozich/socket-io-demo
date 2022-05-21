import { useState, useEffect, useContext } from 'react';
import { SocketContext } from '../components/app/context/socketProvider';

// export function useFriendStatus(friendID) {
//     const [isOnline, setIsOnline] = useState(null);

//     useEffect(() => {
//         function handleStatusChange(status) {
//             setIsOnline(status.isOnline);
//         }

//         ChatAPI.subscribeToFriendStatus(friendID, handleStatusChange);
//         return () => {
//             ChatAPI.unsubscribeFromFriendStatus(friendID, handleStatusChange);
//         };
//     });

//     return isOnline;
// }

export function useSocketListeners() {
    const [isConnected, setIsConnected] = useState(null);
    const [users, setUsers] = useState(null);
    const socket = useContext(SocketContext);
 
    useEffect(() => {

        socket.on("user connected", (user) => {
            setUsers(prev => [...prev, user])
        });

        socket.on("user disconnected", (userID) => {
            setUsers(prev => prev.filter(user => user.userID !== userID))
        });

        // socket.on('user joined', ({ username, id }) => {
        //     const msg = `${username} joined the chat - ${id}`;
        //     setAnnouncements(prev => [...prev, msg])
        // })

        // socket.on('new message', ({ message, username }) => {
        //     setMessages(prev => [...prev, { message, username }])
        // })

        socket.on("connect", () => {
            setIsConnected(true);
        });

        socket.on("disconnect", () => {
            setIsConnected(false);
        });

        socket.on("session", ({ sessionID, userID }) => {
            // attach the session ID to the next reconnection attempts
            socket.auth = { sessionID };
            // store it in the localStorage
            // localStorage.setItem("sessionID", sessionID);
            // save the ID of the user
            socket.userID = userID;
        });

        socket.on("connect_error", (err) => {
            if (err.message === "invalid username") {
                // this.usernameAlreadySelected = false;
                console.log(err)
            }
        });

        // socket.on("private message", (message) => {
        //     console.log('private message', message)
        // });

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


        return () => {
            // socket.off('connect');
            // socket.off('disconnect');
            // socket.off('users');
            // socket.off('user joined');
            // socket.off('new message');
            socket.removeAllListeners();
        };

    
       
    },[socket]);

    return [isConnected, users];
}