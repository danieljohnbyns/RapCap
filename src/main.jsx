import React from 'react';
import ReactDOM from 'react-dom/client';

import { ConfigProvider as DesignConfig, App, theme as DesignTheme } from 'antd';

import {
	HashRouter,
	Routes,
	Route
} from 'react-router-dom';

import '@fontsource/source-sans-pro';
import '@fontsource/source-sans-pro/300.css';
import '@fontsource/source-sans-pro/400.css';
import '@fontsource/source-sans-pro/600.css';
import '@fontsource/source-sans-pro/700.css';
import '@fontsource/source-sans-pro/900.css';

import './styles/index.css';

import Viewport from './pages/Viewport.jsx';

import remToPx from './utils/remToPx';
import rootToHex from './utils/rootToHex';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<DesignConfig
			theme={{
				algorithm: [
					DesignTheme.defaultAlgorithm
				],
				cssVar: true,
				token: {
					colorPrimary: rootToHex('var(--primary)'),
					colorInfo: rootToHex('var(--primary)'),
					fontSize: remToPx(1.5),
					sizeUnit: remToPx(0.5),
					borderRadius: remToPx(0.75)
				}
			}}
		>
			<App>
				<HashRouter basename='/'>
					<Routes>
						<Route path='/' element={<Viewport />} />
					</Routes>
				</HashRouter>
			</App>
		</DesignConfig>
	</React.StrictMode>
);