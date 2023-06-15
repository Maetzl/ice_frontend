import React from "react";
import { makeStyles } from '@material-ui/core/styles';
import { Checkbox, Button, Box,  Container, FormControlLabel, FormControlLabelProps, FormHelperText, IconButton, InputAdornment, TextField, Typography } from '@material-ui/core';
import PublishYourGameForm from "../form/game/PublishYourGameForm";

const useStyles = makeStyles({
  container: {
    //marginTop: "10%",
    display: 'flex',
    flexDirection: 'column',
    //height: '100vh'
    minHeight: '100vh',
    paddingBottom: '64px', 
  },
  wrapper: {
    display: 'flex',
    //justifyContent: 'center', 
    //backgroundColor: '#121212',
    backgroundColor: 'lightgray',
    flexDirection: 'column',
    flexGrow: 1,
    //witdh: '100%',
    //height: '100vh'
  }
  
});


const PublishYourGames= () => {
  const classes = useStyles();

  return(<Box className={classes.wrapper}>
    <Container className={classes.container}>
      <PublishYourGameForm></PublishYourGameForm>
    </Container>
  </Box>
  );
}

export default PublishYourGames;
