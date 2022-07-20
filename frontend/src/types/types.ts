export type User = { _id: string; nick: string; token: string; verified: boolean };

export type initialStateType = {
	user: User | null;
	isError: boolean;
	isSuccess: boolean;
	isLoading: boolean;
	message: any;
};

export type CharacterParams = {
	characterID: string;
};

export type UserParams = {
	userID: string;
};

export type AuthType = {
	user: User | null;
	isLoading: boolean;
	isError: boolean;
	isSuccess: boolean;
	message: any;
};

export type CharacterType = {
	_id: string;
	user: UserReducedType;
	name: string;
	images: ImageType[];
	totalLikes: number;
};

export type UserType = {
	_id: string;
	nick: string;
	createdAt: string;
	characterCount: number;
	mediaCount: number;
};

export type ImageType = {
	_id: string;
	hash: string;
	fileName: string;
	fileType: string;
	likes: string[];
	user: string;
};

export type UserReducedType = {
	_id: string;
	nick: string;
};

export type MediaType = {
	_id: string;
	hash: string;
	fileName: string;
	fileType: string;
	likes: string[];
	user: UserReducedType;
};

export type ParentCompProps = {
	children: JSX.Element;
};

export enum statusTypes {
	ERROR = 'error',
	SUCCESS = 'success',
}

export type AlertType = {
	open: boolean;
	type: statusTypes | null;
	message: null | string;
};
