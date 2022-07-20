import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../app/store';
import { login, reset } from '../features/auth/authSlice';
import useAuth from '../hooks/useAuth';
import {
	Button,
	Container,
	Box,
	CircularProgress,
	Typography,
	TextField,
	Card,
	InputAdornment,
	Grow,
} from '@mui/material';
import { Visibility, VisibilityOff } from '@mui/icons-material';
import { statusTypes, AlertType } from '../types/types';

const Login: React.FC<{ setAlert: React.Dispatch<React.SetStateAction<AlertType>> }> = ({
	setAlert,
}) => {
	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [formData, setFormData] = useState({ nick: '', password: '' });
	const { nick, password } = formData;
	const navigate = useNavigate();
	const dispatch = useDispatch<AppDispatch>();
	const { user, isLoading, isError, message } = useAuth();

	useEffect(() => {
		isError && setAlert({ open: true, type: statusTypes.ERROR, message: message });
		user && navigate('/');
		dispatch(reset());
	}, [user, isError, message, navigate, dispatch, setAlert]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		setFormData((prev) => ({
			...prev,
			[target.id]: target.value,
		}));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		const userData = { nick, password };
		dispatch(login(userData));
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
							Login
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
							type={showPassword ? 'text' : 'password'}
							size="small"
							value={password}
							onChange={handleChange}
							InputProps={{
								endAdornment: (
									<InputAdornment
										position="end"
										sx={{ cursor: 'pointer' }}
										onClick={() => setShowPassword(!showPassword)}
									>
										{showPassword ? <Visibility /> : <VisibilityOff />}
									</InputAdornment>
								),
							}}
						/>
						<Button variant="contained" type="submit">
							Login
						</Button>
						<Typography component={Link} to="/register" variant="body2" textAlign="center">
							Don't have an account yet?
						</Typography>
					</Box>
				</Card>
			</Grow>
		</Container>
	);
};
export default Login;
