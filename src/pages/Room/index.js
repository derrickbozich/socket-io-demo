import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useParams, useHistory } from 'react-router-dom';


const RoomsPage = ({ userId }) => {
    const { room, roomId } = useParams();


    return (
        <main>
            {room}
            {roomId}

        </main>
    );
};

RoomsPage.propTypes = {
    userId: PropTypes.string.isRequired,
};
export default RoomsPage;