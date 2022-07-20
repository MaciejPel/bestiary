import { createSlice } from '@reduxjs/toolkit';

const theme = localStorage.getItem('theme');

const initialState = {
	theme: theme ? theme : 'light',
};

export const themeSlice = createSlice({
	name: 'theme',
	initialState,
	reducers: {
		setTheme: (state, action) => {
			action.payload.theme && localStorage.setItem('theme', action.payload.theme);
			if (action.payload.theme) state.theme = action.payload.theme;
		},
		resetTheme: (state) => {
			state.theme = '';
		},
	},
});

export const { setTheme, resetTheme } = themeSlice.actions;
export default themeSlice.reducer;
