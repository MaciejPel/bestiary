import { Box, CircularProgress } from '@mui/material';

const Loading = () => {
	return (
		<Box display="flex" justifyContent="center" alignItems="center" height="80vh">
			<CircularProgress thickness={5} />
		</Box>
	);
};
export default Loading;
