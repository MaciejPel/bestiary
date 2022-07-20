import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../app/store';
import { setTheme } from '../features/theme/themeSlice';

const useTheme = (mode?: string): { isDark: boolean; currentMode: string } => {
	const dispatch = useDispatch();
	const { theme } = useSelector((state: RootState) => state.theme);

	useEffect(() => {
		mode && dispatch(setTheme({ theme: mode }));
	}, [mode, dispatch, theme]);

	return {
		isDark: theme === 'light' ? false : true,
		currentMode: theme === 'light' ? 'light' : 'dark',
	};
};
export default useTheme;
