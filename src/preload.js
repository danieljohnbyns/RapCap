const { contextBridge, ipcRenderer } = require('electron');

ipcRenderer.on('import-image-template', (event, arg) => {
	window.dispatchEvent(new CustomEvent('import-image-template', { detail: arg }));
});

contextBridge.exposeInMainWorld('api', {
	openImageDialog: () => ipcRenderer.invoke('open-image-dialog'),
	saveFile: (fileName, data) => ipcRenderer.invoke('save-file', { fileName, data }),
	loadImage: (url) => ipcRenderer.invoke('load-image', url)
});