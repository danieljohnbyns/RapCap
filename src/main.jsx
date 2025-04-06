import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';

import {
	HashRouter,
	Routes,
	Route
} from 'react-router-dom';

// import './styles/font-face.css';
import './styles/index.css';

import Viewport from './pages/Viewport.jsx';

const rootToHex = (variable) => {
	const root = getComputedStyle(document.documentElement);
	const rootValue = root.getPropertyValue(variable);
	const hex = rootValue.replace(/rgba?\((\d+), (\d+), (\d+)(?:, \d+)?\)/, (_, r, g, b) => {
		return `#${((1 << 24) + (+r << 16) + (+g << 8) + +b).toString(16).slice(1)}`;
	});
	return hex;
};

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<ConfigProvider
			theme={{
				token: {
					colorPrimary: rootToHex('--color-plain-complement'),
					colorBgBase: rootToHex('--color-plain-complement'),
					colorBgContainer: rootToHex('--color-plain-complement'),
					colorBgLayout: rootToHex('--color-plain-complement'),
					colorBgElevated: rootToHex('--color-plain-complement'),
					colorBgSpotlight: rootToHex('--color-plain-complement'),
					colorFill: rootToHex('--color-plain-complement'),
					colorFillContent: rootToHex('--color-plain-complement'),
					colorFillAlter: rootToHex('--color-plain-complement'),
					colorFillSecondary: rootToHex('--color-plain-complement'),

					colorFillContentHover: rootToHex('--color-plain-complement'),

					colorBorder: rootToHex('--color-plain-complement'),
					colorBorderSecondary: rootToHex('--color-plain-complement'),

					colorTextBase: rootToHex('--color-light'),
					colorTextLightSolid: rootToHex('--color-light'),
					colorTextHeading: rootToHex('--color-light'),
					colorTextPlaceholder: rootToHex('--color-light'),
					colorTextDescription: rootToHex('--color-light'),
					colorTextSecondary: rootToHex('--color-light'),

					colorIcon: rootToHex('--color-light'),
					colorIconHover: rootToHex('--color-light'),

					borderRadius: '1rem',
					borderRadiusLG: '1rem',
					borderRadiusSM: '1rem',
					borderRadiusXS: '1rem',
				},
				components: {
					Button: {
						boxShadow: 'none'
					}
				},
				algorithm: [
					theme.defaultAlgorithm
				]
			}}
		>
			<HashRouter basename='/'>
				<Routes>
					<Route path='/' element={<Viewport />} />
				</Routes>
			</HashRouter>
		</ConfigProvider>
	</React.StrictMode>
);