import React from 'react';
import ReactDOM from 'react-dom/client';
import { ConfigProvider, theme } from 'antd';

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
					colorPrimary: rootToHex('--color-primary'),
					colorBgBase: rootToHex('--color-primary'),
					colorBgContainer: rootToHex('--color-primary'),
					colorBgLayout: rootToHex('--color-primary'),
					colorBgElevated: rootToHex('--color-primary'),
					colorBgSpotlight: rootToHex('--color-primary'),
					colorFill: rootToHex('--color-primary'),
					colorFillContent: rootToHex('--color-primary'),
					colorFillAlter: rootToHex('--color-primary'),
					colorFillSecondary: rootToHex('--color-primary'),

					colorFillContentHover: rootToHex('--color-primary'),

					borderRadius: '1rem',
					colorBorder: rootToHex('--color-primary'),
					colorBorderSecondary: rootToHex('--color-primary'),

					colorTextBase: rootToHex('--color-light'),
					colorTextLightSolid: rootToHex('--color-light'),
					colorTextHeading: rootToHex('--color-light'),
					colorTextPlaceholder: rootToHex('--color-light'),
					colorTextDescription: rootToHex('--color-light'),
					colorTextSecondary: rootToHex('--color-light'),
				},
				algorithm: theme.darkAlgorithm,
			}}
		>
			<Viewport />
		</ConfigProvider>
	</React.StrictMode>
);