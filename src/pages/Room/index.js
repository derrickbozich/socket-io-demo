import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import  Chat  from '../../components/Chat'
import  Socket  from '../../components/Socket'
// import { SocketContext } from '../../components/app/context/socketProvider';


const RoomsPage = ({ userId }) => {
    const { room, roomId } = useParams();
    // const socket = useContext(SocketContext);


    return (
        <main>
            <Socket />
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