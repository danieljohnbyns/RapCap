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

		imageTemplate: 'https://scontent.fmnl32-1.fna.fbcdn.net/v/t1.15752-9/486201425_1352028196055567_4472596194566381759_n.png?_nc_cat=106&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeG0H45iUrOAV41tbqcZ5FchYmUrP4nmBbpiZSs_ieYFusoCKQ3K_BYS_bSIWC5TgIuLh7sWKdpVDepF0Bjs2TK4&_nc_ohc=PzCCgGgPj5MQ7kNvgHkccSY&_nc_oc=AdnpJ24JJOVSIWW9JI-FPAbsfRThLmh10Wul3rWVukSgTdMkJQfICJ0VjPLkf6xXXlA&_nc_zt=23&_nc_ht=scontent.fmnl32-1.fna&oh=03_Q7cD1wG76asTo1bD0ppkVTdPc8dJFvOrzXpXPUTZZHVndwmIPg&oe=6813B08F',

		continuousCapture: false,
		frames: [
			{
				size: {
					width: 100,
					height: 100
				},
				position: {
					x: 0,
					y: 0
				},
				resolution: {
					width: 100,
					height: 100
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