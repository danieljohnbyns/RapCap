import Swal from 'sweetalert2';
import withReactContent from 'sweetalert2-react-content';

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
	 * @type {(filename: String, format: String, scale: Number) => Promise<Blob>}
	 */
	downloadImage: null,

	/**
	 * @type {withReactContent}
	 */
	swal: withReactContent(Swal),

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
			name: 'output',
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