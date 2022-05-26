import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MessagesList = ({messages, currentUserID, selectedChatRecipient}) => {

    messages = messages.filter(message => {
        const isSelf = currentUserID === selectedChatRecipient.userID;
        const isFromCurrentToRecipient = message.from === currentUserID && message.to === selectedChatRecipient.userID;
        const isFromRecipientToCurrent = message.from === selectedChatRecipient.userID && message.to === currentUserID;

        if (isSelf) {
            return message.to === message.from
        } else {
            return isFromCurrentToRecipient || isFromRecipientToCurrent;
        }
        
    })
    const itemStyle = (id) => (
        {
            justifyContent: id === currentUserID ? 'flex-start': 'flex-end',
        }
    )
    const messageStyle = (id) => (
        {
            backgroundColor: id === currentUserID ? '#E5E6EB' : '#0284FF',
            color: id === currentUserID ? 'black' : 'white',
            padding: 2,
            borderRadius: '8px'
        }
    )
    return (
            <List>
                {messages.map((message, index) => (
                    <ListItem key={index} sx={{...itemStyle(message.to)}} >
                        {/* <ListItemText sx={{display: 'inline-block'}} > */}
                        <Box  >
                            <Typography variant="p" component='p' color='white' sx={{ ...messageStyle(message.to) }}>
                                {message.content}
                            </Typography>
                        </Box>
                         
                        {/* </ListItemText> */}
                    </ListItem>
                ))}
            </List>
    );
};

export default MessagesList;