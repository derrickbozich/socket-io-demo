import React, { useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';
import { Grid, Button } from '@material-ui/core/';
import { SocketContext } from '../../components/app/context/socketProvider';

const RoomSelection = ({ userId }) => {
    const socket = useContext(SocketContext);
    const history = useHistory();
    const [customRoomId, setCustomRoomId] = useState('');



    const handleCollabJoin = (e, roomId) => {
        e.preventDefault();
        socket.emit('set roomId & join', { userId, customRoomId: roomId });
        history.push(`/rooms/collab/${roomId ? roomId : ''}`);
    };

    return (

        < >
            user ID: {userId}
            <br />
            <Grid container direction="row" wrap="wrap">
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>

                    <Button href='/rooms/solo' variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Handle Solo
                    </Button>
                </Grid>
                <Grid item xs={6} sm={6} md={6} lg={6} xl={6}>

                    <Button onClick={(e) => {
                        handleCollabJoin(e, customRoomId);
                    }} variant="outlined" sx={{ my: 1, mx: 1.5 }}>
                        Handle Collab Join
                    </Button>

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
                </Grid>
            </Grid>
        </>

    );
};

RoomSelection.propTypes = {
    userId: PropTypes.string.isRequired,
};

export default RoomSelection;