import * as React from 'react';
import Container from '@mui/material/Container';
import { Box } from '@material-ui/core';
import ChatRecipientList from '../../components/ChatRecipientList';
import Chat from '../../components/Chat';
import { useSocketListeners } from '../../hooks/users';
import SignUp from '../../components/SignUp';
import { findUser } from '../../util/user';

export default function Home() {

    const [connected, users] = useSocketListeners();
    const [selectedUser, setSelectedUser] = React.useState({userId: null});

    const handleUserClick = (event) => {
        const id = event.currentTarget.dataset.userid;
        setSelectedUser(findUser(id, users));
    };

    const wrapStyles = {
        display: 'grid',
        gridTemplateColumns: '3fr 1fr',
        padding: 0,
    }

    if (connected == null || connected === false) return <SignUp />

    return (
        <Container maxWidth={false} sx={{ ...wrapStyles }}>
            <Box>
                <Chat selectedUser={selectedUser} />
            </Box>
            <Box>
                <ChatRecipientList
                    users={users}
                    selectedUser={selectedUser}
                    handleClick={handleUserClick}
                />
            </Box>
        </Container>
    );
}