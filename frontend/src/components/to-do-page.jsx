import React, { useState, useEffect } from 'react';
import CssBaseline from '@mui/material/CssBaseline';
import { Container, Box, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import errorPage from '../assets/404-Page.png';
import Tasks from './to-do-list';
import { useFlags } from 'launchdarkly-react-client-sdk';

function TodoPage() {
	const { background, darkMode } = useFlags(); //Make sure you update with you flags, if you want to use those instead

const theme = createTheme({
	palette: {
		mode: darkMode ? 'dark' : 'light'
	},
	components: {
		MuiCssBaseline: {
			styleOverrides: `
			body {
				background-image: url(${background});
				background-size: cover;
				background-repeat: no-repeat;
				height: 500px; 
			} `
		}
	}
});
	const [error, setError] = useState(false);
	useEffect(() => {
		fetch('/api')
			.then((response) => {
				if (!response.ok) {
					throw new Error('bad connection');
				}

				return console.log(response);
			})
			.catch((error_) => {
				setError(true);
			});
	}, []);

	if (error) {
		return (
			<ThemeProvider theme={theme}>
				<CssBaseline>
					<Container>
						<Box
							sx={{ m: 1, display: 'flex', flexWrap: 'wrap', paddingTop: '5ch' }
							}
						>
							<img src={errorPage} style={{ width: '800px', height: '600px' }} />
						</ Box>
						<Box
							sx={{
								m: 1,
								display: 'flex',
								flexWrap: 'wrap',
								paddingTop: '2ch',
								alignItems: 'center',
								justifyContent: 'center',
							}}
						>
						</Box>
					</Container>
				</CssBaseline >
			</ThemeProvider >
		);
	}

	return (
		<>
				<div>
					<ThemeProvider theme={theme}>
						<CssBaseline>
							<Tasks />
						</CssBaseline>
					</ThemeProvider>
				</div>
		</>
	);
}

export default TodoPage;
