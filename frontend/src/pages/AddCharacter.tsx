import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCreateCharacterMutation } from '../features/api/apiSlice';
import {
	Container,
	Button,
	Grid,
	Paper,
	TextField,
	ButtonGroup,
	Typography,
	Box,
	Grow,
} from '@mui/material';
import Loading from '../components/Loading';
import { CharacterUploadType } from '../types/types';
import { statusTypes, AlertType } from '../types/types';

const AddCharacter: React.FC<{
	setAlert: React.Dispatch<React.SetStateAction<AlertType>>;
}> = ({ setAlert }) => {
	const navigate = useNavigate();
	const [loading, setLoading] = useState<boolean>(false);
	const [character, setCharacter] = useState<CharacterUploadType>({
		name: '',
		file: null,
		fileName: '',
	});
	const [createCharacter, { data, isLoading, isSuccess }] = useCreateCharacterMutation();
	const characterForm = new FormData();

	const handleChangeImage = (e: React.FormEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		if (target.files) ImageHandle(target.files[0]);
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) ImageHandle(e.dataTransfer.files[0]);
	};

	const ImageHandle = (file: File) => {
		setLoading(true);
		new Compressor(file, {
			success: (compressedImage) => {
				setCharacter((prev) => ({
					...prev,
					file: compressedImage,
					fileName: file.name.split('.').slice(0, -1).join(''),
				}));
				setLoading(false);
			},
		});
	};

	const handleChangeName = (e: React.ChangeEvent<HTMLInputElement>) => {
		const target = e.target as HTMLInputElement;
		setCharacter((prev) => ({ ...prev, name: target.value }));
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (
			character.name.length > 2 &&
			character.name.length < 22 &&
			character.file != null &&
			character.fileName
		) {
			characterForm.append('name', character.name);
			characterForm.append('file', character.file, character.fileName);
			createCharacter(characterForm);
		} else {
			setAlert({
				open: true,
				type: statusTypes.ERROR,
				message:
					character.name.length < 3 || character.name.length > 22
						? 'Name should be 3-22 characters long'
						: 'File is missing',
			});
		}
	};

	const handleReset = () => {
		setCharacter({
			name: '',
			file: null,
			fileName: '',
		});
	};

	useEffect(() => {
		isSuccess && navigate(`/character/${data?._id}`);
	}, [isSuccess, data?._id, navigate]);

	if (isLoading) {
		return <Loading />;
	}

	return (
		<Container className="container container--content">
			<Grow in={true}>
				<Grid
					container
					spacing={2}
					columns={{ xs: 1, md: 4 }}
					component="form"
					onSubmit={handleSubmit}
					className="form"
				>
					<Grid item xs={12} md={3} className="form__label">
						<Paper
							sx={{
								height: '100%',
								display: 'flex',
								alignItems: 'center',
								justifyContent: 'center',
								cursor: 'pointer',
							}}
							elevation={3}
							component="label"
							htmlFor="file"
							onDragOver={(e: React.DragEvent<HTMLElement>) => e.preventDefault()}
							onDrop={handleDrop}
						>
							{!character.file ? (
								<Typography variant="h6">Drag & Drop or select main image</Typography>
							) : (
								<Box className="img__wrapper" sx={{ padding: '16px' }}>
									<img
										src={URL.createObjectURL(character.file)}
										alt=""
										className="img__wrapper__image"
									/>
								</Box>
							)}
							<input
								hidden
								type="file"
								id="file"
								accept=".jpeg,.jpg,.png"
								onChange={handleChangeImage}
							/>
						</Paper>
					</Grid>
					<Grid item xs={12} md={1} display="flex" justifyContent="center" alignItems="center">
						<Grid container spacing={3}>
							<Grid item xs={12} md={12}>
								<TextField
									label="Character's name"
									value={character.name}
									onChange={handleChangeName}
									fullWidth
									required
								/>
							</Grid>
							<Grid item xs={12} md={12}>
								<ButtonGroup variant="contained" fullWidth>
									<Button variant="contained" color="warning" onClick={handleReset} fullWidth>
										Reset
									</Button>
									<Button variant="contained" type="submit" fullWidth disabled={loading}>
										Submit
									</Button>
								</ButtonGroup>
							</Grid>
						</Grid>
					</Grid>
				</Grid>
			</Grow>
		</Container>
	);
};

export default AddCharacter;
