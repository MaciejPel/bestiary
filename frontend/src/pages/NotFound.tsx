import { Link } from 'react-router-dom';
import { Container, Typography, Button } from '@mui/material';

const NotFound = () => {
	return (
		<Container
			className="container container--content"
			sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			<Typography variant="h2" sx={{ fontWeight: 700 }}>
				404
			</Typography>
			<Typography variant="body1" mb={1}>
				This page does not yet exist
			</Typography>
			<Button component={Link} to="/" variant="outlined">
				Return
			</Button>
		</Container>
	);
};
export default NotFound;
