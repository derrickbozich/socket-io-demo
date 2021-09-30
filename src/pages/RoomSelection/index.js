import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core/';
import { SocketContext } from '../../components/app/context/socketProvider';
import SignUp from '../../components/SignUp';
import Chat from '../../components/Chat';


const RoomSelection = ({ userId }) => {
    const socket = useContext(SocketContext);
    const history = useHistory();
    const [customRoomId, setCustomRoomId] = useState('');
    const [isConnected, setIsConnected] = useState(socket.connected);

    useEffect(() => {
        socket.on('connect', () => {
            setIsConnected(true);
        });
        socket.on('disconnect', () => {
            setIsConnected(false);
        });

        return () => {
            socket.off('connect');
            socket.off('disconnect');
        };
    });



    const handleCollabJoin = (e, roomId) => {
        e.preventDefault();
        socket.emit('set roomId & join', { userId, customRoomId: roomId });
        history.push(`/rooms/collab/${roomId ? roomId : ''}`);
    };

    return (

        <>
            <p>Connected: {'' + isConnected}</p>
            <SignUp />
            <Grid container direction="row" wrap="wrap">
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>

                    <Button href='/rooms/solo' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Solo Room
                    </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>
                    <form
                        style={{ display: 'flex' }}
                        onSubmit={(e) => {
                            handleCollabJoin(e, customRoomId);
                        }}
                    >
                        <input
                            type="text"
                            placeholder="enter room name to join/create"
                            value={customRoomId}
                            onChange={(e) => setCustomRoomId(e.target.value)}
                        />
                    </form>

                    <Button onClick={(e) => {
                        handleCollabJoin(e, customRoomId);
                    }} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Collaborative Room
                    </Button>


                </Grid>
            </Grid>
            < Chat />
        </>

    );
};

RoomSelection.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default RoomSelection;