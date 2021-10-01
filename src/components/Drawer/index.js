import * as React from 'react';
import PropTypes from 'prop-types';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import MailIcon from '@mui/icons-material/Mail';
import MenuIcon from '@mui/icons-material/Menu';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';

const drawerWidth = 240;

function ResponsiveDrawer(props) {
    const { users, children } = props;
    // console.log(users);
   

    const drawer = (
        <div>

            <List>
                {users.map(({ username, self, connected }, index) => (
                    <ListItem button key={index}>
                        <ListItemIcon>
                            < PersonOutlineIcon />
                        </ListItemIcon>
                        <ListItemText >
                            <Typography variant="body1">
                                {username}
                                {self ? " (yourself)" : ''}
                                {connected}
                            </Typography>
                        </ListItemText>
                    </ListItem>
                ))}
            </List>



        </div>
    );


    return (
        <Box sx={{ display: 'flex' }}>

            <Box
                component="nav"
                sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}
                aria-label="mailbox folders"
            >
                <Drawer
                    variant="permanent"
                    sx={{
                        display: { xs: 'none', sm: 'block' },
                        '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth },
                    }}
                    open
                >
                    {drawer}
                </Drawer>
            </Box>
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>

                {children}
            </Box>
        </Box>
    );
}

ResponsiveDrawer.propTypes = {
    /**
     * Injected by the documentation to work in an iframe.
     * You won't need it on your project.
     */
    window: PropTypes.func,
};

export default ResponsiveDrawer;