import React from 'react';
import ReactDOM from 'react-dom/client';
import { Menu } from '@tauri-apps/api/menu';


import './fonts/font-face.css';
import './styles/index.css';

import Viewport from './pages/Viewport';

ReactDOM.createRoot(document.getElementById('root')).render(
	<React.StrictMode>
		<Viewport />
	</React.StrictMode>
);

const menu = await Menu.new({
	items: [
		{
			id: 'file',
			text: 'File',
			items: [
				{
					id: 'new',
					text: 'New',
					accelerator: 'CmdOrCtrl+N',
					action: () => {
						console.log('New File');
					}
				},
				{
					id: 'reload',
					text: 'Reload',
					accelerator: 'CmdOrCtrl+R',
					action: () => {
						window.location.reload();
					}
				}
			]
		},
		{
			id: 'view',
			text: 'View',
			items: [
				{
					id: 'zoom-in',
					text: 'Zoom In',
					accelerator: 'CmdOrCtrl+=',
					action: () => {
						const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
						const newRem = rem * 1.1;
						document.documentElement.style.fontSize = `${newRem}px`;
						console.log('Zoom In', newRem);
					}
				},
				{
					id: 'zoom-out',
					text: 'Zoom Out',
					accelerator: 'CmdOrCtrl+-',
					action: () => {
						const rem = parseFloat(getComputedStyle(document.documentElement).fontSize);
						const newRem = rem * 0.9;
						document.documentElement.style.fontSize = `${newRem}px`;
						console.log('Zoom Out', newRem);
					}
				},
				{
					id: 'reset-zoom',
					text: 'Reset Zoom',
					accelerator: 'CmdOrCtrl+0',
					action: () => {
						document.documentElement.style.fontSize = '';
						console.log('Reset Zoom');
					}
				}
			]
		},
		{
			id: 'help',
			text: 'Help',
			items: [
				{
					id: 'about',
					text: 'About',
					action: () => {
						console.log('About');
					}
				}
			]
		}
	]
});

await menu.setAsAppMenu().then((res) => {
	console.log('menu set success', res);
});