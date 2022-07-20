import { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useGetCharacterQuery } from '../features/api/apiSlice';
import { toast } from 'react-toastify';
import Compressor from 'compressorjs';
import Masonry from 'react-masonry-css';
import Spinner from '../components/Spinner';
import { CharacterParams } from '../types/types';
import { BiImageAdd } from 'react-icons/bi';

type CharacterType = {
	name: string;
	files: Blob[];
	fileNames: string[];
};

const Character: React.FC = () => {
	const uploadLimit = 12;
	const characterForm = new FormData();
	const { characterID } = useParams<keyof CharacterParams>() as CharacterParams;
	const [formState, setFormState] = useState<boolean>(true);
	const [loading, setLoading] = useState<boolean>(false);
	const [character, setCharacter] = useState<CharacterType>({
		name: '',
		files: [],
		fileNames: [],
	});
	const { data, isLoading, isSuccess, isError } = useGetCharacterQuery(characterID);

	const handleChangeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
		e.preventDefault();
		if (e.target.files) {
			let fileList = manageListOfFiles(e.target.files);
			setLoading(true);
			ImageHandle(fileList, fileList.length);
		}
		if (e.target.files && e.target.files.length >= uploadLimit) {
			toast.warning('Too many files provided, upload will be reduced');
		}
	};

	const handleDrop = (e: React.DragEvent<HTMLLabelElement>) => {
		e.preventDefault();
		if (e.dataTransfer.files) {
			let fileList = manageListOfFiles(e.dataTransfer.files);
			setLoading(true);
			ImageHandle(fileList, fileList.length);
		}
		if (e.dataTransfer.files && e.dataTransfer.files.length >= uploadLimit) {
			toast.warning('Too many files provided, upload will be reduced');
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

	const ImageHandle = (files: File[], filesLength: number) => {
		let f: Blob[] = [];
		let g: string[] = [];
		for (let i = 0; i < filesLength; i++) {
			const file = files[i];
			if (!file.type.includes('image')) continue;
			new Compressor(file, {
				success: (compressedImage) => {
					f.push(compressedImage);
					g.push(file.name.split('.').slice(0, -1).join(''));
					setCharacter((prev) => ({
						...prev,
						files: f,
						fileNames: g,
					}));
				},
			});
			if (i + 1 === filesLength) {
				setLoading(false);
			}
		}
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		// characterForm.append(`file-${i}`,compressedImage,file.name.split('.').slice(0, -1).join(''));
	};

	let content;
	if (isLoading) {
		content = <Spinner />;
	} else if (isSuccess) {
		content = data && (
			<div className="character__wrapper">
				<div className="character__current" style={{ gridColumn: formState ? '' : '3 / span 3' }}>
					<div className="character__image__wrapper">
						<img
							className="character__image"
							src={`https://i.imgur.com/${data.images.length ? data.images[0].hash : 'WxNkK7J'}.${
								data.images.length ? data.images[0].fileType : 'png'
							}`}
							alt=""
						/>
					</div>
					<div className="character__current__info">
						<div className="character__current__info__title">{data.name}</div>
						<BiImageAdd
							onClick={() => setFormState(!formState)}
							className="character__current__info__add"
						/>
					</div>
				</div>
				<div className="character__form__wrapper">
					<form onSubmit={handleSubmit} className="character__form">
						<div className="character__upload__area">
							<label
								htmlFor="file"
								className="character__label"
								onDragOver={(e) => e.preventDefault()}
								onDrop={handleDrop}
							>
								{character.files.length ? (
									character.files.map((image, index) => (
										<div key={index} className="character__uploaded-image__wrapper">
											<img
												src={URL.createObjectURL(image)}
												alt=""
												className="character__uploaded-image"
											/>
										</div>
									))
								) : (
									<div className="character__default">
										Drag & Drop (or select) character pictures
									</div>
								)}
								<input
									type="file"
									id="file"
									className="character__file"
									multiple
									accept=".jpeg,.jpg,.png,.gif"
									onChange={handleChangeImage}
									required
								/>
							</label>
						</div>
						<div className="character__upload__buttons">
							<input type="submit" value="Submit" disabled={loading} />
						</div>
					</form>
				</div>
			</div>
		);
	} else if (isError) {
		content = <p>Error occured</p>;
	}

	return <div className="character">{content}</div>;
};

export default Character;
