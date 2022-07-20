import { useSelector } from 'react-redux';
import { RootState } from '../app/store';
import { AuthType } from '../types/types';

const useAuth = (): AuthType => {
	const { user, isLoading, isError, isSuccess, message } = useSelector(
		(state: RootState) => state.auth
	);

	return { user, isLoading, isSuccess, isError, message };
};

export default useAuth;
