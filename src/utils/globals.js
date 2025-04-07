import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

const globals = {
	/**
	 * @type {withReactContent}
	 */
	swal: withReactContent(Swal),

	/**
	 * @typedef {{
	 * 		mediaDevices: MediaDeviceInfo[],
	 * 		mediaDevice: MediaDeviceInfo,
	 * 		countdown: Number,
	 * 		brightness: Number,
	 * 		contrast: Number,
	 * 		faceDetection: Boolean,
	 * 		imageTemplate: String,
	 * 		continuousCapture: Boolean,
	 * 		frames: {
	 * 			size: {
	 * 				width: Number,
	 * 				height: Number
	 * 			},
	 * 			position: {
	 * 				x: Number,
	 * 				y: Number
	 * 			},
	 * 			resolution: {
	 * 				width: Number,
	 * 				height: Number
	 * 			},
	 * 			buffer: String | null
	 * 		}[],
	 * 		output: {
	 * 			name: String,
	 * 			scale: Number,
	 * 			format: 'png' | 'jpeg' | 'webp'
	 * 		}
	 * }} Options
	 */
	/** @type {Options} */
	options: {
		mediaDevices: [],
		mediaDevice: null,

		countdown: 3,
		brightness: 100,
		contrast: 100,
		faceDetection: false,

		imageTemplate: 'https://raw.githubusercontent.com/danieljohnbyns/RapCap/refs/heads/main/src/assets/images/Default%20Frame.png',

		continuousCapture: false,
		frames: [
			{
				size: {
					width: 360,
					height: 200
				},
				position: {
					x: 40,
					y: 60
				},
				resolution: {
					width: 360,
					height: 200
				},
				buffer: null
			},
			{
				size: {
					width: 360,
					height: 200
				},
				position: {
					x: 40,
					y: 300
				},
				resolution: {
					width: 360,
					height: 200
				},
				buffer: null
			},
			{
				size: {
					width: 360,
					height: 200
				},
				position: {
					x: 40,
					y: 540
				},
				resolution: {
					width: 360,
					height: 200
				},
				buffer: null
			},
			{
				size: {
					width: 622,
					height: 680
				},
				position: {
					x: 458,
					y: 60
				},
				resolution: {
					width: 458,
					height: 60
				},
				buffer: null
			}
		],

		output: {
			name: 'output',
			scale: 1,
			format: 'png'
		}
	},

	/** @type {() => Options} */
	getOptions: () => {
		return globals.options;
	},
	/** @type {(options: Partial<Options>, silent: Boolean) => Void} */
	setOptions: (options, silent = false) => {
		globals.options = { ...globals.options, ...options };

		if (silent) return;
		window.dispatchEvent(new CustomEvent('optionsUpdated', {
			detail: globals.options
		}));
	},

	saveOptions: () => {
		localStorage.setItem('options', JSON.stringify(globals.options));
	},

	loadOptions: () => {
		const version = localStorage.getItem('version');
		if (version !== '1.0.0') {
			localStorage.clear();
			localStorage.setItem('version', '1.0.0');
		};

		const options = localStorage.getItem('options');
		if (options) {
			try {
				globals.options = JSON.parse(options);
				window.dispatchEvent(new CustomEvent('optionsUpdated', {
					detail: globals.options
				}));
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