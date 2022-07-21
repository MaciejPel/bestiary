import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
	useGetCharacterQuery,
	useLikeMediaMutation,
	useUpdateCharacterMutation,
	useDeleteCharacterMutation,
} from '../features/api/apiSlice';
import Compressor from 'compressorjs';
import {
	AlertType,
	CharacterParams,
	CharacterUploadTypeExtended,
	statusTypes,
} from '../types/types';
import {
	Container,
	Button,
	Grid,
	TextField,
	ButtonGroup,
	Typography,
	Box,
	Grow,
	Card,
	CardMedia,
	CardContent,
	CardActions,
	Paper,
	IconButton,
	Modal,
	Tooltip,
} from '@mui/material';
import Loading from '../components/Loading';
import Error from '../components/Error';
import { Edit, Delete, Favorite, Launch, CropOriginal } from '@mui/icons-material';
import Masonry from '@mui/lab/Masonry';
import useAuth from '../hooks/useAuth';

const uploadLimit = 8;
const uploadSize = 8;

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

const Character: React.FC<{ setAlert: React.Dispatch<React.SetStateAction<AlertType>> }> = ({
	setAlert,
}) => {
	const navigate = useNavigate();
	const { characterID } = useParams<keyof CharacterParams>() as CharacterParams;
	const { user } = useAuth();
	const { data, isLoading, isSuccess, isError } = useGetCharacterQuery(characterID);

	const [character, setCharacter] = useState<CharacterUploadTypeExtended>({
		name: '',
		files: [],
		fileNames: [],
	});

	const [likeMedia] = useLikeMediaMutation();
	const [updateCharacter] = useUpdateCharacterMutation();
	const [deleteCharacter] = useDeleteCharacterMutation();

	const handleModal = (state: boolean) =>
		setStateManager((prev) => ({ ...prev, modalState: state }));

	const [stateManager, setStateManager] = useState<{
		editCard: boolean;
		modalState: boolean;
	}>({ editCard: false, modalState: false });

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files) {
			let fileList = manageListOfFiles(e.target.files);
			imageCompressor(fileList, fileList.length);
		}
		if (e.target.files && e.target.files.length > uploadLimit) {
			setAlert({ open: true, type: statusTypes.ERROR, message: 'Input has been reduced' });
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			let fileList = manageListOfFiles(e.dataTransfer.files);
			imageCompressor(fileList, fileList.length);
		}
		if (e.dataTransfer.files.length > uploadLimit) {
			setAlert({ open: true, type: statusTypes.ERROR, message: 'Input has been reduced' });
		}
	};

	const manageListOfFiles = (files: FileList) => {
		let fileList = [];
		for (let i = 0; i < Math.min(files.length, uploadLimit); i++) {
			if (files[i].type.includes('image') && fileList.length < uploadLimit) {
				fileList.push(files[i]);
			}
		}
		return fileList;
	};

	const imageCompressor = (files: File[], filesLength: number) => {
		let filesTemp: Blob[] = [];
		let fileNamesTemp: string[] = [];
		for (let i = 0; i < filesLength; i++) {
			const file = files[i];
			if (!file.type.includes('image') || file.size > uploadSize * 1024 * 1024) {
				setAlert({ open: true, type: statusTypes.ERROR, message: 'Input has been reduced' });
				continue;
			}
			new Compressor(file, {
				success: (compressedImage) => {
					filesTemp.push(compressedImage);
					fileNamesTemp.push(file.name.split('.').slice(0, -1).join(''));
					setCharacter((prev) => ({
						...prev,
						files: filesTemp,
						fileNames: fileNamesTemp,
					}));
				},
			});
		}
	};

	const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		setCharacter((prev) => ({ ...prev, name: target.value }));
	};

	const handleReset = () => {
		setCharacter({
			name: data ? data.name : '',
			files: [],
			fileNames: [],
		});
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		const characterForm = new FormData();
		e.preventDefault();
		for (let i = 0; i < character.files.length; i++) {
			characterForm.append(`file-${i}`, character.files[i], character.fileNames[i]);
		}
		characterForm.append('name', character.name);
		updateCharacter({ characterID, data: characterForm });
		setCharacter((prev) => ({ ...prev, files: [], fileNames: [] }));
	};

	useEffect(() => {
		data &&
			setCharacter((prev) => ({
				...prev,
				name: data.name,
			}));
	}, [data]);

	let content;
	if (isLoading) {
		content = <Loading />;
	} else if (isSuccess) {
		content = data && (
			<>
				<Grid
					container
					spacing={2}
					columns={{ xs: 1, md: 4 }}
					component="form"
					onSubmit={handleSubmit}
				>
					<Grid item xs={1} md={1}>
						<Grow in={true}>
							<Card variant="outlined">
								<Modal open={stateManager.modalState} onClose={() => handleModal(false)}>
									<Box sx={style}>
										<Typography variant="h6">Are you sure?</Typography>
										<Typography>
											Character is about to be deleted pernamentaly. However, the images will be
											available on the media tab.
										</Typography>
										<Box
											display="flex"
											justifyContent="flex-end"
											alignItems="flex-end"
											marginTop={2}
										>
											<Button
												variant="contained"
												color="error"
												endIcon={<Delete />}
												onClick={() => {
													deleteCharacter(characterID);
													navigate('/');
												}}
											>
												Delete
											</Button>
										</Box>
									</Box>
								</Modal>
								<CardMedia
									component="img"
									image={`https://i.imgur.com/${
										data.images.length ? data.images[0].hash : 'WxNkK7J'
									}.${data.images.length ? data.images[0].fileType : 'png'}`}
									alt={data.name}
								/>
								<CardContent
									sx={{
										padding: '8px 8px 0px 8px',
									}}
								>
									<Typography variant="h6" component="div" noWrap>
										{data.name}
									</Typography>
								</CardContent>
								<CardActions
									disableSpacing
									sx={{ justifyContent: 'flex-end', padding: '0px 8px 0px 8px' }}
								>
									<Tooltip title="Edit character">
										<IconButton
											onClick={() => {
												setStateManager((prev) => ({ ...prev, editCard: !prev.editCard }));
											}}
										>
											<Edit />
										</IconButton>
									</Tooltip>
									<Tooltip title="Like" arrow>
										<IconButton
											onClick={() => likeMedia(data.images[0]._id)}
											color={user && data.images[0].likes.includes(user._id) ? 'error' : 'default'}
										>
											<Favorite />
											<Typography variant="h5" component="span">
												{data.totalLikes}
											</Typography>
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete character" arrow>
										<IconButton
											onClick={() => {
												handleModal(true);
											}}
										>
											<Delete />
										</IconButton>
									</Tooltip>
									<Tooltip title="Open in new tab" arrow>
										<a
											href={`https://i.imgur.com/${data.images[0].hash}.${data.images[0].fileType}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<IconButton>
												<Launch />
											</IconButton>
										</a>
									</Tooltip>
								</CardActions>
							</Card>
						</Grow>
					</Grid>
					<Grid item xs={1} md={1}>
						<Grow in={stateManager.editCard}>
							<Paper
								elevation={3}
								sx={{
									height: '100%',
									paddingX: '8px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									gap: '8px',
								}}
							>
								<TextField
									label="Character's name"
									value={character.name}
									fullWidth
									required
									onChange={handleChangeName}
									sx={{ marginTop: '8px' }}
								/>
								<ButtonGroup variant="contained" fullWidth sx={{ marginBottom: '8px' }}>
									<Button variant="contained" color="warning" fullWidth onClick={handleReset}>
										Reset
									</Button>
									<Button variant="contained" type="submit" fullWidth>
										Submit
									</Button>
								</ButtonGroup>
							</Paper>
						</Grow>
					</Grid>
					<Grid item xs={12} md={2}>
						<Grow in={stateManager.editCard}>
							<Paper
								elevation={3}
								sx={{
									height: '100%',
									paddingX: '8px',
									display: 'flex',
									flexDirection: 'column',
									justifyContent: 'center',
									gap: '6px',
									cursor: 'pointer',
								}}
								component="label"
								htmlFor="file"
								onDragOver={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
								onDrop={handleDrop}
							>
								{!character.files.length ? (
									<Typography
										variant="h6"
										component="div"
										display="flex"
										justifyContent="center"
										alignItems="center"
										minHeight={100}
									>
										Drag & Drop or select images
									</Typography>
								) : (
									<Grid container columns={{ xs: 2, md: 4 }} spacing={2} padding="8px">
										{character.files.map((image, index) => (
											<Grid item key={index} xs={1} md={1}>
												<img src={URL.createObjectURL(image)} alt="" className="image" />
											</Grid>
										))}
									</Grid>
								)}
								<input
									hidden
									type="file"
									id="file"
									multiple
									accept=".jpeg,.jpg,.png"
									onChange={handleChangeImage}
								/>
							</Paper>
						</Grow>
					</Grid>
				</Grid>
				{data.images.length && (
					<Typography variant="h5" sx={{ margin: '24px 0 16px 0' }} textAlign="center">
						Images of {data.name}
					</Typography>
				)}
				<Masonry columns={{ xs: 1, sm: 2, md: 3, lg: 4 }} spacing={2}>
					{data.images.slice(1).map((image) => (
						<Grow in={true} key={image._id}>
							<Card variant="outlined">
								<CardMedia
									component="img"
									image={`https://i.imgur.com/${image.hash}.${image.fileType}`}
									alt={image.fileName}
								/>
								<CardContent sx={{ padding: '8px 8px 0px 8px' }}>
									<Typography variant="h6" component="div" noWrap>
										{image.fileName}
									</Typography>
								</CardContent>
								<CardActions
									disableSpacing
									sx={{ justifyContent: 'flex-end', padding: '0px 8px 0px 8px' }}
								>
									<Tooltip title="Set image as main" arrow>
										<IconButton
											onClick={() => {
												const characterForm = new FormData();
												characterForm.append('setImageAsMain', image._id);
												updateCharacter({ characterID, data: characterForm });
											}}
										>
											<CropOriginal />
										</IconButton>
									</Tooltip>
									<Tooltip title="Like" arrow>
										<IconButton
											onClick={() => likeMedia(image._id)}
											color={user && image.likes.includes(user._id) ? 'error' : 'default'}
										>
											<Favorite />
											<Typography variant="h6" component="div">
												{image.likes.length}
											</Typography>
										</IconButton>
									</Tooltip>
									<Tooltip title="Delete image from character" arrow>
										<IconButton
											onClick={() => {
												const characterForm = new FormData();
												characterForm.append('removeImageFromCharacter', image._id);
												updateCharacter({ characterID, data: characterForm });
											}}
										>
											<Delete />
										</IconButton>
									</Tooltip>
									<Tooltip title="Open in new tab" arrow>
										<a
											href={`https://i.imgur.com/${data.images[0].hash}.${data.images[0].fileType}`}
											target="_blank"
											rel="noopener noreferrer"
										>
											<IconButton>
												<Launch />
											</IconButton>
										</a>
									</Tooltip>
								</CardActions>
							</Card>
						</Grow>
					))}
				</Masonry>
			</>
		);
	} else if (isError) {
		content = <Error />;
	}

	return <Container className="container container--content">{content}</Container>;
};

export default Character;
