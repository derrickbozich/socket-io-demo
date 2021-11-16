import React from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import  Chat  from '../../components/Chat'

const RoomsPage = ({ userId }) => {
    const { room, roomId } = useParams();

    return (
        <main>
            <p> {room}</p>
            <p> {roomId}</p>
            <p> {userId}</p>
            <Chat />

        </main>
    );
};

RoomsPage.propTypes = {
    userId: PropTypes.string.isRequired,
};
export default RoomsPage;