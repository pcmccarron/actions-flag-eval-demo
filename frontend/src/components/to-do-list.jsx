import React, { useEffect, useState, useCallback } from 'react';
import { Container, List, Box, ListItemIcon, TextField, Button } from '@mui/material';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

export default function Tasks() {
	const [todos, setTodos] = useState([]);
	const [description, setDescription] = useState('');
	const [update, setUpdate] = useState(false);

	const onButtonClick = async (event) => {
		try {
			const body = { description };
			const response = await fetch('/api', {
				method: 'POST',
				mode: 'cors',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify(body),
			});
		} catch (error) {
			console.error(error.message);
		}
	};


	const deleteTodo = async (id) => {
		try {
			const deleteTodos = await fetch(`/api/${id}`, {
				method: 'DELETE',
				mode: 'cors',
			});
			setTodos(todos.filter((todos) => todos._id !== id));
		} catch (error) {
			console.log('there was an error');
		}
	};

	const getTodos = async () => {
		try {
			const response = await fetch('/api');
			const jsonData = await response.json();
			setTodos(jsonData);
		} catch (error) {
			console.log('there was an error');
		}
	};

	useEffect(() => {
		getTodos().then(
			setUpdate(false));
	}, [update]);

	console.log(update);
	return (
		<>
			<div>
				<Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
					<TextField
						id="outlined-basic"
						sx={{ m: 1, width: '100ch', justifyContent: 'center' }}
						label="What do you need to do today?"
						variant="outlined"
						onChange={(event) => setDescription(event.target.value)}
					/>
					<Button
						variant="contained"
						onClick={() => {
							onButtonClick(description);
							setUpdate(true);
						}}
						size="small"
						sx={{ m: 1 }}>
						Add To-Do
					</Button>
				</Box>
			</div >
			<Container>
				<Box
					sx={{
						m: 1,
						display: 'flex',
						flexWrap: 'wrap',
						paddingTop: '1ch',
						alignItems: 'left',
						justifyContent: 'left',
					}}
				>
					<h2>What we have to do today</h2>
				</Box>
				<List>
					{todos.map((todos) => (
						<ListItemButton
							key={todos._id}
							onClick={() => {
								deleteTodo(todos._id);
								setUpdate(true);
							}}
						>
							<ListItemIcon>
								<CheckCircleIcon />
							</ListItemIcon>
							<ListItem key={todos._id}>{todos.description}</ListItem>
						</ListItemButton>
					))}
				</List>
			</Container>
		</>
	);
}
