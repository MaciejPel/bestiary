import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { register, reset } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';
import useAuth from '../hooks/useAuth';
import {
	Button,
	Container,
	Box,
	CircularProgress,
	Typography,
	TextField,
	Card,
	Grow,
} from '@mui/material';
import { statusTypes, AlertType } from '../types/types';

const Register: React.FC<{ setAlert: React.Dispatch<React.SetStateAction<AlertType>> }> = ({
	setAlert,
}) => {
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const [formData, setFormData] = useState({
		nick: '',
		password: '',
		passwordRepeat: '',
	});
	const { nick, password, passwordRepeat } = formData;
	const { user, isLoading, isError, isSuccess, message } = useAuth();

	useEffect(() => {
		if (isError) {
			setAlert({ open: true, type: statusTypes.ERROR, message: message });
		}
		if (isSuccess) {
			setAlert({
				open: true,
				type: statusTypes.SUCCESS,
				message: 'Account created, wait or contact admin for verification',
			});
		}
		if (isSuccess || user) {
			navigate('/');
		}
		dispatch(reset());
	}, [user, isError, isSuccess, message, navigate, dispatch, setAlert]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		setFormData((prev) => ({
			...prev,
			[target.id]: target.value.trim(),
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();

		if (!password || !passwordRepeat || !nick) {
			setAlert({ open: true, type: statusTypes.ERROR, message: 'All fields have to be filled' });
		} else if (password !== passwordRepeat) {
			setAlert({ open: true, type: statusTypes.ERROR, message: 'Passwords do not match' });
		} else {
			const userData = {
				nick,
				password,
			};
			dispatch(register(userData));
		}
	};

	if (isLoading) {
		return (
			<Container
				className="container"
				sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
			>
				<CircularProgress />
			</Container>
		);
	}

	return (
		<Container
			className="container"
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<Grow in={true}>
				<Card variant="outlined">
					<Box minWidth="300px">
						<Typography variant="h5" textAlign="center" paddingY="10px">
							Register
						</Typography>
					</Box>
					<Box
						sx={{
							'& > :not(style)': { m: 1, width: '30ch' },
						}}
						component="form"
						noValidate
						autoComplete="off"
						onSubmit={handleSubmit}
						display="flex"
						alignItems="center"
						flexDirection="column"
					>
						<TextField
							id="nick"
							label="Your nickname"
							variant="outlined"
							size="small"
							value={nick}
							onChange={handleChange}
						/>
						<TextField
							id="password"
							label="Your password"
							variant="outlined"
							type="password"
							size="small"
							value={password}
							onChange={handleChange}
						/>
						<TextField
							id="passwordRepeat"
							label="Repeat password"
							variant="outlined"
							type="password"
							size="small"
							value={passwordRepeat}
							onChange={handleChange}
						/>
						<Button variant="contained" type="submit">
							Register
						</Button>
						<Typography component={Link} to="/login" variant="body2" textAlign="center">
							Already have an account?
						</Typography>
					</Box>
				</Card>
			</Grow>
		</Container>
	);
};
export default Register;
