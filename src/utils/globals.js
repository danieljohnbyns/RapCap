
const globals = {
	/**
	 * @type {(deviceId: String) => Void}
	 */
	changeCamera: null,

	/**
	 * @type {() => Promise<InputDeviceInfo[]>}
	 */
	getMediaDevices: null,

	/**
	 * @type {(buffer: String) => Void}
	 */
	snapshot: null,

	options: {
		countdown: 3,
		brightness: 100,
		contrast: 100,
		faceDetection: false,

		imageTemplate: '',

		continuousCapture: false,
		/**
		 * @type {{
		 * 		size: {
		 * 			width: Number,
		 * 			height: Number
		 *  	},
		 * 		position: {
		 * 			x: Number,
		 * 			y: Number
		 * 		}
		 * }[]}
		 */
		frames: [
			{
				size: {
					width: 100,
					height: 100
				},
				position: {
					x: 0,
					y: 0
				}
			}
		],
	},

	saveOptions: () => {
		// Save options to local storage
		localStorage.setItem('options', JSON.stringify(globals.options));
	},
	loadOptions: () => {
		// Load options from local storage
		const options = localStorage.getItem('options');
		if (options) {
			globals.options = JSON.parse(options);
		};
	}
};

// Load options from local storage on startup
globals.loadOptions();
setInterval(() => {
	globals.saveOptions();
}, 1000 * 5);

window.globals = globals;

export default globals;