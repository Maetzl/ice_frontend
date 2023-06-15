import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import SignupForm from '../form/signup/SignupForm';
import { Checkbox, Box,  Container, FormControlLabel, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';

const useStyles = makeStyles({
    SignupContainer: {
        justifyContent: 'center', 
        //backgroundColor: '#121212',
        backgroundColor: 'lightgray',
        witdh: '100%',
        height: '100vh'
    },
})

interface SignupProps {
    
}

const Signup: React.FC<SignupProps> = ({}) => {
    const classes = useStyles();
    return (
        <Box className={classes.SignupContainer}>
          <SignupForm />
        </Box>
      );
    };

export default Signup;
