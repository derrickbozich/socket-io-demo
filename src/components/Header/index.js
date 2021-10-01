import React from 'react';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
// import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';

const Header = ({ children }) => {
    return (
        <>
            <Box sx={{ flexGrow: 1 }}>
                <AppBar position="static">
                    <Toolbar>
                        <IconButton
                            size="large"
                            edge="start"
                            color="inherit"
                            aria-label="menu"
                            sx={{ mr: 2 }}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Button href='/' variant='h3' color="inherit">Web Socket Demo</Button>
                        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                            {/* Web Socket Demo */}
                        </Typography>
                        <Button href='/rooms' color="inherit">Rooms</Button>
                    </Toolbar>
                </AppBar>
            </Box>
        </>
    )
}

export default Header;