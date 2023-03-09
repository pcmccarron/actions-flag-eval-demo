import React, { useState, useEffect } from "react";
import { Modal, Button, Box, Stack, TextField, createTheme, CssBaseline } from '@mui/material';
import ls from 'local-storage';
import PropTypes from 'prop-types';
import { ThemeProvider } from "@emotion/react";
import { useLDClient, useFlags } from "launchdarkly-react-client-sdk";

export default function Login({ useObj, setUserObj }) {
    const LDClient = useLDClient();
    const {darkMode} = useFlags(); // update with your flags as needed 

    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light'
        },
    });

    const [userState, setUserState] = useState({
        username: "",
    });

    async function setCurrLDUser() {
        const obj = await LDClient.getUser();
        return obj;
    }

    const submitUser = async (e) => {
        e.preventDefault();
        const lduser = await setCurrLDUser();
        lduser.key = userState.username;
        await LDClient.identify(lduser);
        const response = await fetch(
            "/login", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(lduser)
        }
        )
        await ls.remove('LD_User_Key')
        await ls.set('LD_User_Key', userState.username)
        LDClient.track('userLogin', { customProperty: userState.username });
        setUserObj(userState.username)
        Array.from(document.querySelectorAll("input")).forEach(
            (input) => (input.value = "")
        );
        console.log(lduser);
    };

    useEffect(() => {
        setUserState(LDClient.getUser())
    }, [])

    const handleChange = (e) => {
        const { id, value } = e.target;
        setUserState((prevState) => ({
            ...prevState,
            [id]: value,
        }));
    };

    async function setCurrLDUser() {
        const obj = await LDClient.getUser();
        return obj;
    }

    const submitLogout = async (e) => {
        e.preventDefault();
        const lduser = await setCurrLDUser();
        lduser.key = "anonymous";
        await LDClient.identify(lduser);
        await fetch(
            "/logout", {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        }
        )
        await ls.remove('LD_User_Key')
        LDClient.track('userClear', { customProperty: userState.username });
        Array.from(document.querySelectorAll("input")).forEach(
            (input) => (input.value = "")
        );
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline>
                <Stack spacing={2} direction="row">
                    <Box
                        noValidate
                        component="form"
                        sx={{
                            '& > :not(style)': { m: 1, width: '25ch' },
                        }}
                        autoComplete="off"
                    >

                        <div>
                            <TextField
                                fullWidth
                                id="username"
                                placeholder="Enter Username"
                                variant="outlined"
                                onChange={handleChange}
                            />
                        </div>
                    </Box>
                    <Box sx={{ pt: '20px' }}>
                        <div>
                            <Button
                                variant="text"
                                color="primary"
                                onClick={submitUser.bind(userState)}
                            >
                                Login
                            </Button>
                        </div>
                    </Box>
                    <Box sx={{ pt: '20px' }}>

                        <div>
                            <Button
                                variant="text"
                                color="secondary"
                                onClick={submitLogout.bind(userState)}
                            >
                                Clear User
                            </Button>
                        </div>
                    </Box>
                </Stack>
            </CssBaseline >
        </ThemeProvider >
    )
}

Login.propTypes = {
    login: PropTypes.func,
    handleClose: PropTypes.func,
    open: PropTypes.bool
};