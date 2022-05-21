import * as React from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, ListItemIcon, ListItemText, Typography } from '@material-ui/core';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';

function ChatRecipientList({ users, handleClick, selectedUser }) {

    console.log('selected', selectedUser)


    if (users == null) return null

    const itemStyle = (userID) => {
        return {
            backgroundColor: userID === selectedUser.userID ? 'red' : 'white'

        }

    }

    return (
        <List>
            {users.filter(user => user.connected === true).map(({ username, self, connected, userID }, index) => (
                <ListItem button key={index} data-userid={userID} onClick={handleClick} sx={{ backgroundColor: "rgb(210,248,255)" }}>
                    <ListItemIcon>
                        < PersonOutlineIcon />
                    </ListItemIcon>
                    <ListItemText >
                        <Typography variant="body1">
                            {username}
                            {self ? " (yourself)" : ''}
                        </Typography>
                        <Typography variant="body1">
                            {connected ? 'Online' : "Offline"}
                        </Typography>
                    </ListItemText>
                </ListItem>
            ))}
        </List>
    );
}


export default ChatRecipientList;