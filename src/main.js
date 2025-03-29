import { app, BrowserWindow, protocol, Menu } from 'electron';

if (require('electron-squirrel-startup')) {
	app.quit();
};

const mainMenuTemplate = [
	{
		label: 'File',
		submenu: [
			{
				label: 'Import',
				accelerator: 'CommandOrControl+I',
				submenu: [
					{
						label: 'Import from File',
						click() {
							app.emit('import-file');
						}
					},
					{
						label: 'Import from URL',
						click() {
							app.emit('import-url');
						}
					}
				]
			},
			{
				label: 'Export',
				accelerator: 'CommandOrControl+E',
				submenu: [
					{
						label: 'Export to File',
						click() {
							app.emit('export-file');
						}
					},
					{
						label: 'Export to URL',
						click() {
							app.emit('export-url');
						}
					}
				]
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
		label: 'Edit',
		submenu: [
			{
				label: 'Undo',
				accelerator: 'CommandOrControl+Z',
				role: 'undo'
			},
			{
				label: 'Redo',
				accelerator: 'Shift+CommandOrControl+Z',
				role: 'redo'
			},
			{
				type: 'separator'
			},
			{
				label: 'Cut',
				accelerator: 'CommandOrControl+X',
				role: 'cut'
			},
			{
				label: 'Copy',
				accelerator: 'CommandOrControl+C',
				role: 'copy'
			},
			{
				label: 'Paste',
				accelerator: 'CommandOrControl+V',
				role: 'paste'
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
					}
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
				label: 'About',
				click() {
					app.emit('show-about');
				}
			}
		]
	},
];
const menu = Menu.buildFromTemplate(mainMenuTemplate);
Menu.setApplicationMenu(menu);

const createWindow = () => {
	const mainWindow = new BrowserWindow({
		width: 800,
		height: 600,

		minWidth: 550,
		minHeight: 600,

		webPreferences: {
			preload: MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY,
			nodeIntegration: true,
			webSecurity: false,
			contextIsolation: false
		},
		title: 'RapCap'
	});


	mainWindow.loadURL(MAIN_WINDOW_WEBPACK_ENTRY);

	const webContents = mainWindow.webContents;

	webContents.on('did-finish-load', () => {
		webContents.setZoomFactor(1);
		webContents.setVisualZoomLevelLimits(1, 1);
	});
};

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