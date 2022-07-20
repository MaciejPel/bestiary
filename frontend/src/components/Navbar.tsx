import { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout, reset, me } from '../features/auth/authSlice';
import { AppDispatch } from '../app/store';
import useAuth from '../hooks/useAuth';
import useTheme from '../hooks/useTheme';
import useWindowSize from '../hooks/useWindowSize';
import {
	AppBar,
	Toolbar,
	IconButton,
	Icon,
	Typography,
	Stack,
	Container,
	Button,
	Paper,
	BottomNavigation,
	BottomNavigationAction,
	Tooltip,
	Box,
	Drawer,
	List,
	ListItem,
	ListItemButton,
	ListItemIcon,
	Divider,
	ListItemText,
} from '@mui/material';
import {
	AutoStories,
	DarkModeOutlined,
	LightModeOutlined,
	Home,
	AddCircleOutline,
	PermMedia,
	Logout,
	Login,
	Person,
	AccountCircle,
	MoreVert,
} from '@mui/icons-material';

const Navbar = () => {
	const navigate = useNavigate();
	const location = useLocation();
	const dispatch = useDispatch<AppDispatch>();
	const [theme, setTheme] = useState<string>();
	const [value, setValue] = useState('home');
	const { user } = useAuth();
	const { isDark } = useTheme(theme);
	const window = useWindowSize();

	const handleTheme = () => {
		setTheme(isDark ? 'light' : 'dark');
	};

	const handleLogout = () => {
		dispatch(logout());
		dispatch(reset());
		navigate('/');
	};

	useEffect(() => {
		user && dispatch(me(user.token));
	}, [user, dispatch]);

	useEffect(() => {
		const currentLocation = location.pathname.split('/')[1];
		setValue(currentLocation ? currentLocation : 'home');
	}, [location]);

	const [state, setState] = useState(false);

	const toggleDrawer = () => (event: React.KeyboardEvent | React.MouseEvent) => {
		if (
			event.type === 'keydown' &&
			((event as React.KeyboardEvent).key === 'Tab' ||
				(event as React.KeyboardEvent).key === 'Shift')
		) {
			return;
		}

		setState(!state);
	};

	return (
		<>
			{window.width > 768 ? (
				<AppBar position="fixed">
					<Container>
						<Toolbar sx={{ display: 'flex', justifyContent: 'space-between' }}>
							<Box className="navbar__title" to="/" component={Link}>
								<Icon>
									<AutoStories />
								</Icon>
								<Typography variant="h6" sx={{ textDecoration: 'none' }} color="inherit">
									Bestiary
								</Typography>
							</Box>
							<Stack direction="row">
								{user ? (
									<>
										<Button to="/" component={Link} color="inherit">
											Home
										</Button>
										<Button to="/media" component={Link} color="inherit">
											Media
										</Button>
										<Button to="/add-character" component={Link} color="inherit">
											New Character
										</Button>
										<Button to={`/user/${user._id}`} component={Link} color="inherit">
											Profile
										</Button>
										<Tooltip title="Change theme">
											<IconButton size="medium" color="inherit" onClick={handleTheme}>
												{isDark ? <DarkModeOutlined /> : <LightModeOutlined />}
											</IconButton>
										</Tooltip>
										<Tooltip title="Logout">
											<IconButton size="medium" color="inherit" onClick={handleLogout}>
												{<Logout />}
											</IconButton>
										</Tooltip>
									</>
								) : (
									<>
										<Button to="/login" component={Link} color="inherit">
											Login
										</Button>
										<Button to="/register" component={Link} color="inherit">
											Register
										</Button>
										<Tooltip title="Change theme">
											<IconButton size="medium" color="inherit" onClick={handleTheme}>
												{isDark ? <DarkModeOutlined /> : <LightModeOutlined />}
											</IconButton>
										</Tooltip>
									</>
								)}
							</Stack>
						</Toolbar>
					</Container>
				</AppBar>
			) : (
				<Paper sx={{ position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 1 }} elevation={3}>
					<Drawer anchor="left" open={state} onClose={toggleDrawer()}>
						<Box
							sx={{ width: 250 }}
							role="presentation"
							onClick={toggleDrawer()}
							onKeyDown={toggleDrawer()}
						>
							<List>
								<ListItem
									disablePadding
									button
									component={Link}
									to={`/user/${user && user._id}`}
									selected={value === 'user'}
								>
									<ListItemButton>
										<ListItemIcon>
											<Person />
										</ListItemIcon>
										<ListItemText primary="Profile" />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding onClick={handleTheme}>
									<ListItemButton>
										<ListItemIcon>
											{isDark ? <DarkModeOutlined /> : <LightModeOutlined />}
										</ListItemIcon>
										<ListItemText primary={`${isDark ? 'Light' : 'Dark'} mode`} />
									</ListItemButton>
								</ListItem>
								<ListItem disablePadding onClick={handleLogout}>
									<ListItemButton>
										<ListItemIcon>
											<Logout />
										</ListItemIcon>
										<ListItemText primary="Logout" />
									</ListItemButton>
								</ListItem>
							</List>
							<Divider />
						</Box>
					</Drawer>
					{user ? (
						<BottomNavigation
							onChange={(e, newValue) => {
								newValue !== 'more' && setValue(newValue);
							}}
							value={value}
						>
							<BottomNavigationAction
								component={Link}
								to="/"
								label="Home"
								value="home"
								icon={<Home />}
							/>
							<BottomNavigationAction
								component={Link}
								to="/media"
								label="Media"
								value="media"
								icon={<PermMedia />}
							/>
							<BottomNavigationAction
								component={Link}
								to="/add-character"
								label="New beast"
								value="add-character"
								icon={<AddCircleOutline />}
							/>
							<BottomNavigationAction
								icon={<MoreVert />}
								onClick={toggleDrawer()}
								label="More"
								value="more"
							></BottomNavigationAction>
						</BottomNavigation>
					) : (
						<BottomNavigation
							onChange={(e, newValue) => {
								newValue !== 'theme' && setValue(newValue);
							}}
							value={value}
						>
							<BottomNavigationAction
								component={Link}
								to="/login"
								label="Login"
								value="login"
								icon={<Login />}
							/>
							<BottomNavigationAction
								component={Link}
								to="/register"
								label="Register"
								value="register"
								icon={<AccountCircle />}
							/>
							<BottomNavigationAction
								icon={isDark ? <DarkModeOutlined /> : <LightModeOutlined />}
								value="theme"
								onClick={handleTheme}
							/>
						</BottomNavigation>
					)}
				</Paper>
			)}
		</>
	);
};

export default Navbar;
