const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('import-image-template', (event, arg) => {
	window.dispatchEvent(new CustomEvent('import-image-template', { detail: arg }));
});
ipcRenderer.on('reset-options', () => {
	window.dispatchEvent(new CustomEvent('reset-options'));
});

contextBridge.exposeInMainWorld('api', {
	openImageDialog: () => ipcRenderer.invoke('open-image-dialog'),
	saveFile: (fileName, data) => ipcRenderer.invoke('save-file', { fileName, data }),
	loadImage: (url) => ipcRenderer.invoke('load-image', url)
});