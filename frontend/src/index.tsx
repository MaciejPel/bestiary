import ReactDOM from 'react-dom/client';
import App from './App';
import { Provider } from 'react-redux';
import { store } from './app/store';
import { ApiProvider } from '@reduxjs/toolkit/dist/query/react';
import { apiSlice } from './features/api/apiSlice';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
	<ApiProvider api={apiSlice}>
		<Provider store={store}>
			<App />
		</Provider>
	</ApiProvider>
);
