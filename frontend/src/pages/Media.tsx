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
	Typography,
	CardActions,
	IconButton,
	Grow,
	Modal,
	Button,
} from '@mui/material';
import { Favorite, Delete, Launch, AssignmentInd } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';
import useAuth from '../hooks/useAuth';
import Loading from '../components/Loading';
import Error from '../components/Error';

const Media = () => {
	const { data, isLoading, isSuccess, isError } = useGetMediaQuery();
	const [modalState, setModalState] = useState<{ open: boolean; mediaID: string }>({
		open: false,
		mediaID: '',
	});
	const handleModal = (state: boolean, mediaID: string) => setModalState({ open: state, mediaID });

	const [likeMedia] = useLikeMediaMutation();
	const [deleteMedia] = useDeleteMediaMutation();
	const { user } = useAuth();

	const style = {
		position: 'absolute' as 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%, -50%)',
		width: { xs: 300, md: 400 },
		bgcolor: 'background.paper',
		boxShadow: 6,
		borderRadius: '8px',
		p: 2,
	};

	let content;
	if (isLoading) {
		content = <Loading />;
	} else if (isSuccess) {
		content = data.length ? (
			<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} sx={{ margin: 0 }}>
				{data.map((media) => (
					<Grow in={true} key={media._id}>
						<Card variant="outlined">
							<CardMedia
								component="img"
								image={`https://i.imgur.com/${media.hash}.${media.fileType}`}
								alt={media.fileName}
							/>
							<CardContent sx={{ padding: '8px 8px 0px 8px' }}>
								<Typography variant="h6" component="div" noWrap>
									{media.fileName}
								</Typography>
							</CardContent>
							<CardActions
								disableSpacing
								sx={{ justifyContent: 'flex-end', padding: '0px 8px 0px 8px' }}
							>
								<IconButton
									onClick={() => likeMedia(media._id)}
									color={user && media.likes.includes(user._id) ? 'error' : 'default'}
								>
									<Favorite />
									<Typography variant="h6" component="div">
										{media.likes.length}
									</Typography>
								</IconButton>
								<IconButton
									onClick={() => {
										handleModal(true, media._id);
									}}
								>
									<Delete />
								</IconButton>
								<IconButton
								// onClick={() => {
								// }}
								>
									<AssignmentInd />
								</IconButton>
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
				<Modal open={modalState.open} onClose={() => handleModal(false, '')}>
					<Box sx={style}>
						<Typography variant="h6">Are you sure?</Typography>
						<Typography>Media is about to be deleted pernamentaly.</Typography>
						<Box display="flex" justifyContent="flex-end" alignItems="flex-end" marginTop={2}>
							<Button
								variant="contained"
								color="error"
								onClick={() => {
									deleteMedia(modalState.mediaID);
									handleModal(false, '');
								}}
								endIcon={<Delete />}
							>
								Delete
							</Button>
						</Box>
					</Box>
				</Modal>
			</Masonry>
		) : (
			<Box display="flex" justifyContent="center" alignItems="center" height="80vh">
				<Typography variant="h6" color="inherit">
					Media will appear here
				</Typography>
			</Box>
		);
	} else if (isError) {
		content = <Error />;
	}

	return <Container className="container container--content">{content}</Container>;
};
export default Media;
