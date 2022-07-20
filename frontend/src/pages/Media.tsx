import { useState } from 'react';
import {
	useGetMediaQuery,
	useLikeMediaMutation,
	useDeleteMediaMutation,
} from '../features/api/apiSlice';
import {
	Container,
	Card,
	CardMedia,
	CardContent,
	Box,
	CircularProgress,
	Typography,
	CardActions,
	IconButton,
	Grow,
	Modal,
	Button,
} from '@mui/material';
import { Favorite, Delete, Launch } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';
import useAuth from '../hooks/useAuth';

const Media = () => {
	const { data, isLoading, isSuccess, isError } = useGetMediaQuery();
	const [open, setOpen] = useState(false);
	const handleModal = (state: boolean) => setOpen(state);

	const [likeMedia] = useLikeMediaMutation();
	const [deleteMedia] = useDeleteMediaMutation();
	const { user } = useAuth();

	const style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: 400,
		bgcolor: 'background.paper',
		boxShadow: 6,
		borderRadius: '8px',
		p: 2,
	};

	let content;
	if (isLoading) {
		content = (
			<Box display="flex" justifyContent="center" alignItems="center">
				<CircularProgress />
			</Box>
		);
	} else if (isSuccess) {
		content = data.length && (
			<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
				{data.map((media) => (
					<Grow in={true} key={media._id}>
						<Card variant="outlined">
							<CardMedia
								component="img"
								image={`https://i.imgur.com/${media.hash}.${media.fileType}`}
								alt={media.fileName}
							/>
							<CardContent sx={{ padding: '12px 12px 0px 12px' }}>
								<Typography variant="h6" component="div" noWrap>
									{media.fileName}
								</Typography>
							</CardContent>
							<CardActions
								disableSpacing
								sx={{ justifyContent: 'flex-end', padding: '0px 12px 6px 12px' }}
							>
								<IconButton
									onClick={() => likeMedia(media._id)}
									color={user && media.likes.includes(user._id) ? 'error' : 'default'}
								>
									<Favorite />
								</IconButton>
								<Typography variant="h6" component="div">
									{media.likes.length}
								</Typography>
								<IconButton onClick={() => handleModal(true)}>
									<Delete />
								</IconButton>
								<Modal open={open} onClose={() => handleModal(false)}>
									<Box sx={style}>
										<Typography variant="h6" color="primary">
											Are you sure?
										</Typography>
										<Typography color="primary">
											Media is about to be deleted pernamentaly.
										</Typography>
										<Box display="flex" justifyContent="flex-end" alignItems="flex-end">
											<Button
												variant="text"
												color="error"
												onClick={() => {
													deleteMedia(media._id);
													handleModal(false);
												}}
												endIcon={<Delete />}
											>
												DELETE
											</Button>
										</Box>
									</Box>
								</Modal>
								<a
									href={`https://i.imgur.com/${media.hash}.${media.fileType}`}
									target="_blank"
									rel="noopener noreferrer"
								>
									<IconButton>
										<Launch />
									</IconButton>
								</a>
							</CardActions>
						</Card>
					</Grow>
				))}
			</Masonry>
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
export default Media;
