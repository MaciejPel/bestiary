import { useState } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { ProtectedRoute } from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import AddCharacter from './pages/AddCharacter';
import Character from './pages/Character';
import Media from './pages/Media';
import User from './pages/User';
import useTheme from './hooks/useTheme';
import { Snackbar, Alert, Paper } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import '@fontsource/roboto/300.css';
import '@fontsource/roboto/400.css';
import '@fontsource/roboto/500.css';
import '@fontsource/roboto/700.css';
import './App.css';
import { AlertType } from './types/types';
import { grey } from '@mui/material/colors';
import NotFound from './pages/NotFound';

const App = () => {
	const { isDark } = useTheme();
	const [alert, setAlert] = useState<AlertType>({
		open: false,
		type: null,
		message: null,
	});

	const darkTheme = createTheme({
		palette: {
			mode: 'dark',
		},
		typography: {
			allVariants: {
				color: 'white',
			},
		},
	});

	const lightTheme = createTheme({
		palette: {
			mode: 'light',
		},
		components: {
			MuiAppBar: {
				styleOverrides: {
					colorPrimary: {
						backgroundColor: grey[900],
					},
				},
			},
		},
	});

	const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
		if (reason === 'clickaway') {
			return;
		}
		setAlert({ ...alert, open: false });
	};

	return (
		<>
			<BrowserRouter>
				<ThemeProvider theme={isDark ? darkTheme : lightTheme}>
					<Navbar />
					<Paper className="main__content" sx={{ borderRadius: '0' }}>
						<Routes>
							<Route path="/login" element={<Login setAlert={setAlert} />} />
							<Route path="/register" element={<Register setAlert={setAlert} />} />
							<Route path="/" element={<ProtectedRoute children={<Home />} />} />
							<Route path="/media" element={<ProtectedRoute children={<Media />} />} />
							<Route
								path="/add-character"
								element={<ProtectedRoute children={<AddCharacter setAlert={setAlert} />} />}
							/>
							<Route
								path="/character/:characterID"
								element={<ProtectedRoute children={<Character />} />}
							/>
							<Route path="/user/:userID" element={<ProtectedRoute children={<User />} />} />
							<Route path="/*" element={<NotFound />} />
						</Routes>
					</Paper>
				</ThemeProvider>
			</BrowserRouter>
			<Snackbar
				open={alert.open ? true : false}
				autoHideDuration={5000}
				onClose={handleClose}
				anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
				className="notification"
			>
				<Alert
					severity={alert.type !== null ? alert.type : undefined}
					onClose={handleClose}
					variant="filled"
				>
					{alert.message}
				</Alert>
			</Snackbar>
		</>
	);
};

export default App;
