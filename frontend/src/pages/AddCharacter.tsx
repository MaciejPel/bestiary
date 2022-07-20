import Compressor from 'compressorjs';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';
import { useCreateCharacterMutation } from '../features/api/apiSlice';
import { Container, Card } from '@mui/material';

type CharacterUploadType = {
	name: string;
	file: File | Blob | null;
	fileName: string;
};

const AddCharacter = () => {
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
		setLoading(true);
		const target = e.target as HTMLInputElement;
		if (target.files) ImageHandle(target.files[0]);
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) ImageHandle(e.dataTransfer.files[0]);
	};

	const ImageHandle = (file: File) => {
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
		if (character.name.length >= 2 && character.name.length <= 25) {
			characterForm.append('name', character.name);
			character.file && characterForm.append('file', character.file, character.fileName);
			createCharacter(characterForm);
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

	return (
		<Container
			className="container"
			sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}
		>
			<Card variant="outlined">
				{isLoading ? (
					<Spinner />
				) : (
					<div className="add-character__form__wrapper">
						<form
							onSubmit={handleSubmit}
							encType="multipart/form-data"
							className="add-character__form"
						>
							<div className="add-character__drop-area">
								<label
									htmlFor="file"
									className="add-character__label"
									onDragOver={(e) => e.preventDefault()}
									onDrop={handleDrop}
								>
									<div className="add-character__drop">
										{character.file ? (
											<div>
												<img
													src={URL.createObjectURL(character.file)}
													alt=""
													className="add-character__image"
												/>
											</div>
										) : (
											'Drag & Drop (or select) character main picture'
										)}
									</div>
								</label>
								<input
									type="file"
									id="file"
									accept=".jpeg,.jpg,.png,.gif"
									onChange={handleChangeImage}
									className="add-character__input__file"
								/>
							</div>
							<div className="add-character__form-area">
								<input
									type="text"
									name="name"
									onChange={handleChangeName}
									value={character.name}
									required
									minLength={2}
									maxLength={25}
									className="add-character__input__text"
									placeholder="Character name"
								/>
								<input
									type="reset"
									onClick={handleReset}
									className="add-character__input__reset"
									value="Reset"
								/>
								<input
									type="submit"
									disabled={loading}
									className="add-character__input__submit"
									value="Submit"
								/>
							</div>
						</form>
					</div>
				)}
			</Card>
		</Container>
	);
};

export default AddCharacter;
