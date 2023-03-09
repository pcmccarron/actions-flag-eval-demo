import React, { useEffect, useState } from 'react';
import './App.css';
import TodoPage from './components/to-do-page';
import ldLogo from './assets/ld.svg';
import { AppBar, Toolbar, Container, Grid } from '@mui/material';
import Login from './components/login';
import { useFlags } from 'launchdarkly-react-client-sdk';

function App() {
  const {image} = useFlags(); // update with your flags as needed 
  const [userObj, setUserObj] = useState();
  console.log(userObj);

  return (
    <>
      <AppBar color='transparent'>
        <Toolbar>
          <Container maxWidth='2xl' sx={{ textAlign: 'left', m: 0 }}>
            <img src={ldLogo} style={{ maxWidth: "200px" }} />
          </Container>
          <Grid container sx={{ justifyContent: 'flex-end', textAlign: 'right', m: 0 }}>
            <Login userObj={userObj} setUserObj={setUserObj} />
          </Grid>
        </Toolbar>
      </AppBar>
      <Container maxWidth="md">
        {image ? <img src="./high-five.png" style={{width: '400px', height: '200'}}/> : null }
        <h1>Keep track of your daily tasks</h1>
      </Container>
      <TodoPage />
    </>
  )
}

export default App
