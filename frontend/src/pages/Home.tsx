import useAuth from '../hooks/useAuth';
import { useGetCharactersQuery } from '../features/api/apiSlice';
import { Link } from 'react-router-dom';
import {
	Container,
	Card,
	CardActionArea,
	CardMedia,
	CardContent,
	Box,
	Icon,
	CircularProgress,
	Typography,
	Grow,
} from '@mui/material';
import { Favorite } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';

const Home = () => {
	const { user } = useAuth();
	const { data, isLoading, isSuccess, isError } = useGetCharactersQuery(undefined, { skip: !user });

	let content;
	if (isLoading) {
		content = (
			<Box display="flex" justifyContent="center" alignItems="center">
				<CircularProgress />
			</Box>
		);
	} else if (isSuccess) {
		content = (
			<>
				{data.length ? (
					<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
						{data.map((character) => (
							<Grow in={true} key={character._id}>
								<Card component={Link} to={`/character/${character._id}`} variant="outlined">
									<CardActionArea>
										<CardMedia
											component="img"
											image={`https://i.imgur.com/${
												character.images.length ? character.images[0].hash : 'WxNkK7J'
											}.${character.images.length ? character.images[0].fileType : 'png'}`}
											alt={character.name}
										/>
										<CardContent
											sx={{ padding: '12px', display: 'flex', justifyContent: 'space-between' }}
										>
											<Typography variant="h5" component="span">
												{character.name}
											</Typography>
											<Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
												<Icon>
													<Favorite />
												</Icon>
												<Typography variant="h5" component="span">
													{character.totalLikes}
												</Typography>
											</Box>
										</CardContent>
									</CardActionArea>
								</Card>
							</Grow>
						))}
					</Masonry>
				) : (
					<Box display="flex" alignItems="center">
						<Typography variant="h6" color="inherit">
							Characters will appear here
						</Typography>
					</Box>
				)}
			</>
		);
	} else if (isError) {
		content = (
			<Box display="flex" justifyContent="center" alignItems="center">
				Error occured
			</Box>
		);
	}

	return <Container className="container container--content">{content}</Container>;
};
export default Home;
