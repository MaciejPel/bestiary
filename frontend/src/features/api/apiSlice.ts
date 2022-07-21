import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { RootState } from '../../app/store';
import { CharacterType, MediaType, UserType } from '../../types/types';

export const apiSlice = createApi({
	reducerPath: 'API',
	tagTypes: ['Characters', 'Media', 'Users'],
	baseQuery: fetchBaseQuery({
		baseUrl: `${
			process.env.REACT_APP_ENVIRONMENT === 'production'
				? process.env.REACT_APP_PROD_SERVER
				: process.env.REACT_APP_DEV_SERVER
		}/api`,
		prepareHeaders: (headers, { getState }) => {
			const user = (getState() as RootState).auth.user;
			if (user) {
				headers.set('authorization', `Bearer ${user.token}`);
			}
			return headers;
		},
	}),
	endpoints: (builder) => ({
		getCharacter: builder.query<CharacterType, string>({
			query: (characterId) => ({
				url: `/characters/${characterId}`,
				method: 'GET',
			}),
			providesTags: ['Characters'],
		}),
		getCharacters: builder.query<CharacterType[], void>({
			query: () => ({
				url: '/characters',
				method: 'GET',
			}),
			providesTags: ['Characters'],
		}),
		createCharacter: builder.mutation<CharacterType, FormData>({
			query: (character) => ({
				url: '/characters',
				method: 'POST',
				body: character,
			}),
			invalidatesTags: ['Media', 'Characters'],
		}),
		updateCharacter: builder.mutation<CharacterType, { characterID: string; data: FormData }>({
			query: ({ characterID, data }) => ({
				url: `/characters/${characterID}`,
				method: 'PUT',
				body: data,
			}),
			invalidatesTags: ['Media', 'Characters'],
		}),
		deleteCharacter: builder.mutation<{ id: string }, string>({
			query: (characterID) => ({
				url: `/characters/${characterID}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Media', 'Characters', 'Users'],
		}),
		getMedia: builder.query<MediaType[], void>({
			query: () => ({
				url: '/media',
				method: 'GET',
			}),
			providesTags: ['Media'],
		}),
		likeMedia: builder.mutation<MediaType, string>({
			query: (mediaID) => ({
				url: `/media/${mediaID}`,
				method: 'PUT',
			}),
			invalidatesTags: ['Media', 'Characters'],
		}),
		deleteMedia: builder.mutation<{ id: string }, string>({
			query: (mediaID) => ({
				url: `/media/${mediaID}`,
				method: 'DELETE',
			}),
			invalidatesTags: ['Media', 'Characters', 'Users'],
		}),
		getUser: builder.query<UserType, string>({
			query: (userID) => ({
				url: `/users/${userID}`,
				method: 'GET',
			}),
			providesTags: ['Users'],
		}),
	}),
});

export const {
	useGetCharacterQuery,
	useGetCharactersQuery,
	useCreateCharacterMutation,
	useUpdateCharacterMutation,
	useDeleteCharacterMutation,
	useGetMediaQuery,
	useLikeMediaMutation,
	useDeleteMediaMutation,
	useGetUserQuery,
} = apiSlice;
