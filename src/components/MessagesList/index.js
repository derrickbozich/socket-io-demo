import React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

const MessagesList = ({messages, currentUserID}) => {
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