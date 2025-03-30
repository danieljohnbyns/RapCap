
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

	/**
	 * @type {(filename: String, format: String, scale: Number) => Void}
	 */
	downloadImage: null,

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

		output: {
			name: (() => {
				const date = new Date();
				return `photo_${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}_${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}`;
			})(),
			scale: 1,
			/**
			 * @type {'png' | 'jpeg' | 'webp'}
			 */
			format: 'png'
		}
	},

	saveOptions: () => {
		localStorage.setItem('options', JSON.stringify(globals.options));
	},
	loadOptions: () => {
		const options = localStorage.getItem('options');
		if (options) {
			try {
				globals.options = JSON.parse(options);
			} catch (e) { };
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