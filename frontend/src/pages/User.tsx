import { useParams } from 'react-router-dom';
import { UserParams } from '../types/types';
import { useGetUserQuery } from '../features/api/apiSlice';
import {
	Container,
	Box,
	Typography,
	List,
	ListItem,
	ListItemText,
	Avatar,
	ListItemAvatar,
	Paper,
	Grow,
} from '@mui/material';
import { CalendarMonth, Image, GroupAdd } from '@mui/icons-material';
import Error from '../components/Error';
import Loading from '../components/Loading';

const User = () => {
	const { userID } = useParams<keyof UserParams>() as UserParams;
	const { data, isLoading, isSuccess, isError } = useGetUserQuery(userID);

	let content;
	if (isLoading) {
		content = <Loading />;
	} else if (isSuccess) {
		content = (
			<Grow in={true}>
				<Box>
					<Typography variant="h6" component="div">
						{data.nick}
					</Typography>
					<Paper elevation={3}>
						<List sx={{ bgcolor: 'background.paper' }}>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<CalendarMonth color="action" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Account created" secondary={data.createdAt} />
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<GroupAdd color="action" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText
									primary="Number of created characters"
									secondary={data.characterCount}
								/>
							</ListItem>
							<ListItem>
								<ListItemAvatar>
									<Avatar>
										<Image color="action" />
									</Avatar>
								</ListItemAvatar>
								<ListItemText primary="Number of uploaded images" secondary={data.mediaCount} />
							</ListItem>
						</List>
					</Paper>
				</Box>
			</Grow>
		);
	} else if (isError) {
		<Error />;
	}

	return (
		<Container
			className="container"
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			{content}
		</Container>
	);
};

export default User;
