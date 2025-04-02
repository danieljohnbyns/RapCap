import { app, BrowserWindow, protocol, Menu, ipcMain, dialog } from 'electron';
import mime from 'mime';
import fs from 'fs/promises';
import path from 'path';
import log from 'electron-log';

if (require('electron-squirrel-startup')) {
	app.quit();
};

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,

		minWidth: 880,
		minHeight: 600,

		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			contextIsolation: true,
			nodeIntegration: false
		},
		title: 'RapCap'
	});

	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	const webContents = mainWindow.webContents;

	webContents.on('did-finish-load', () => {
		webContents.setZoomFactor(1);
		webContents.setVisualZoomLevelLimits(1, 1);
	});

	const mainMenuTemplate = [
		{
			label: 'File',
			submenu: [
				{
					label: 'Import Image Template',
					accelerator: 'CommandOrControl+I',
					click() {
						mainWindow.webContents.send('import-image-template');
					}
				},
				{
					label: 'Quit',
					accelerator: 'CommandOrControl+Q',
					click() {
						app.quit();
					}
				}
			]
		},
		{
			label: 'View',
			submenu: [
				{
					label: 'Reload',
					accelerator: 'CommandOrControl+R',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.reload();
						};
					}
				},
				{
					label: 'Toggle Developer Tools',
					accelerator: 'Alt+CommandOrControl+I',
					click(item, focusedWindow) {
						if (focusedWindow) {
							focusedWindow.toggleDevTools();
						}
					}
				}
			]
		},
		{
			label: 'Window',
			submenu: [
				{
					label: 'Minimize',
					accelerator: 'CommandOrControl+M',
					role: 'minimize'
				},
				{
					label: 'Close',
					accelerator: 'CommandOrControl+W',
					role: 'close'
				}
			]
		},
		{
			label: 'Help',
			submenu: [
				{
					label: 'Github',
					click() {
						const { shell } = require('electron');
						shell.openExternal('https://github.com/danieljohnbyns/RapCap');
					}
				}
			]
		},
	];
	const menu = Menu.buildFromTemplate(mainMenuTemplate);
	Menu.setApplicationMenu(menu);
};

ipcMain.handle('open-image-dialog', async () => {
	try {
		const result = await dialog.showOpenDialog({
			properties: ['openFile'],
			filters: [{ name: 'Images', extensions: ['jpg', 'jpeg', 'png', 'gif'] }]
		});

		if (result.canceled || !result.filePaths.length) return null;

		const filePath = result.filePaths[0];
		const data = await fs.readFile(filePath);
		const base64 = data.toString('base64');
		const mimeType = mime.getType(filePath);

		if (!mimeType) throw new Error('Unsupported file type');

		return `data:${mimeType};base64,${base64}`;
	} catch (error) {
		console.error('File open error:', error);
		return { error: error.message };
	};
});
ipcMain.handle('save-file', async (_, { fileName, data }) => {
	try {
		log.info('Starting file save...');
		const downloadsPath = app.getPath('downloads');
		log.debug('Downloads path:', downloadsPath);
		
		const filePath = path.join(downloadsPath, fileName);
		log.debug('Full path:', filePath);

		// Convert base64 to Buffer if needed
		const fileData = typeof data === 'string' && data.startsWith('data:')
			? Buffer.from(data.split(',')[1], 'base64')
			: Buffer.from(data);

		await fs.writeFile(filePath, fileData);
		return { success: true, path: filePath };
	} catch (error) {
		console.error('Save failed:', error);
		return { success: false, error: error.message };
	};
});
ipcMain.handle('load-image', async (_, url) => {
	try {
		const response = await fetch(url);
		const blob = await response.blob();
		return URL.createObjectURL(blob);
	} catch (error) {
		console.error('Image load error:', error);
		throw error;
	};
});


protocol.registerSchemesAsPrivileged([
	{
		scheme: 'http',
		privileges: {
			standard: true,
			secure: true,
			allowServiceWorkers: true,
			supportFetchAPI: true,
			corsEnabled: true
		}
	},
	{
		scheme: 'https',
		privileges: {
			standard: true,
			secure: true,
			allowServiceWorkers: true,
			supportFetchAPI: true,
			corsEnabled: true
		}
	}
]);

app.whenReady().then(() => {
	createWindow();

	app.on('activate', () => {
		if (BrowserWindow.getAllWindows().length === 0) {
			createWindow();
		};
	});
});

app.on('window-all-closed', () => {
	if (process.platform !== 'darwin') {
		app.quit();
	};
});
