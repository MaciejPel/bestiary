import useTheme from '../hooks/useTheme';
import { BsSun, BsMoon } from 'react-icons/bs';

const Switch: React.FC = () => {
	const { isDark } = useTheme();

	return (
		<div className="switch">
			{isDark ? (
				<BsMoon className="switch__icon" strokeWidth={0.4} />
			) : (
				<BsSun className="switch__icon" strokeWidth={0.4} />
			)}
		</div>
	);
};
export default Switch;
