import React, { useContext } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import { SocketContext } from '../app/context/socketProvider';




const SignUp = ({handleClose}) => {
    const socket = useContext(SocketContext);

    const sessionID = localStorage.getItem("sessionID");

    if (sessionID) {
        // this.usernameAlreadySelected = true;
        socket.auth = { sessionID };
        socket.connect();
    }



    const handleSubmit = (event) => {
        event.preventDefault();
        const data = new FormData(event.currentTarget);
        socket.auth = { username: data.get('firstName')  };
        socket.connect();
    };

    return (
        <Box
            sx={{
                marginTop: 8,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
                Set Your Nickname
            </Typography>
            <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
                <Grid container spacing={2}>
                   
                    <Grid item xs={12}>
                        <TextField
                            autoComplete="fname"
                            name="firstName"
                         
                            fullWidth
                            id="firstName"
                            label="Nickname"
                            autoFocus
                        />
                    </Grid>
                 
                  
                </Grid>
                <Button
                    type="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                >
                    Submit
                </Button>
               
            </Box>
        </Box>

    );
}

export default SignUp;