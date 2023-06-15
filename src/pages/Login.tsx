import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import LoginForm from '../form/login/LoginForm';
import { Checkbox, Box,  Container, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    loginContainer: {
        //display: 'flex',
        justifyContent: 'center', 
        //backgroundColor: '#121212',
        backgroundColor: 'lightgray',
        witdh: '100%',
        height: '100vh'
    }
})

interface LoginProps {
    
}

const Login: React.FC<LoginProps> = ({}) => {
    const classes = useStyles();
    return (
        <Box className={classes.loginContainer}>
          <LoginForm />
        </Box>
      );
    };

export default Login;
