import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import Chat from '../../components/Chat'

const RoomSelection = ({ userId }) => {
    const { room, roomId } = useParams();

    return (
        <>
            <p> room:  {room}</p>
            <p> {roomId}</p>
            <p> {userId}</p>
            {/* <Chat /> */}
            

        </>
    );
};

RoomSelection.propTypes = {
    userId: PropTypes.string.isRequired,
};
export default RoomSelection;