import { Navigate } from 'react-router-dom';
import useAuth from '../hooks/useAuth';
import { ParentCompProps } from '../types/types';

export const ProtectedRoute = ({ children }: ParentCompProps) => {
	const { user } = useAuth();

	if (!user) {
		return <Navigate to="/login" />;
	}

	return children;
};
