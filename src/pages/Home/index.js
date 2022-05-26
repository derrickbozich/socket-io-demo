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
    const [selectedChatRecipient, setSelectedChatRecipient] = React.useState({userId: null});

    React.useEffect(() => {
        if (selectedChatRecipient.userID == null &&  users != null ){
            setSelectedChatRecipient(users[0]);
        }
    }, [users, selectedChatRecipient.userID])

    const handleUserClick = (event) => {
        const id = event.currentTarget.dataset.userid;
        setSelectedChatRecipient(findUser(id, users));
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
                <Chat selectedChatRecipient={selectedChatRecipient} />
            </Box>
            <Box>
                <ChatRecipientList
                    users={users}
                    selectedChatRecipient={selectedChatRecipient}
                    handleClick={handleUserClick}
                />
            </Box>
        </Container>
    );
}