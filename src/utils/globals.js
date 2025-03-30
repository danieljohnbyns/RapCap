
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
	 * @type {(countdown: Number) => Void}
	 */
	shoot: null,

	/**
	 * @type {String}
	 */
	buffer: '',

	options: {
		countdown: 0,
		deviceId: null,
		brightness: 0,
		contrast: 0,
		faceDetection: false,

		imageTemplate: 'https://scontent.fmnl32-1.fna.fbcdn.net/v/t1.15752-9/487060082_1765414607720663_975681901043707618_n.png?_nc_cat=104&ccb=1-7&_nc_sid=9f807c&_nc_eui2=AeFY55F9rLdqYFsMzPlO4HgWw1R6eicglofDVHp6JyCWh2alF8g2bKHB1Pj-D68wtkIAZzWrvVjSewAfPBnb3AB_&_nc_ohc=w-_hY3QLN14Q7kNvgGGfF0J&_nc_oc=AdkJhU-6CAqeZT53v299INJ6ExfCCS0xmTRMymSRW2vKHhKcFy5N6etN5FvNA9ot-rY&_nc_zt=23&_nc_ht=scontent.fmnl32-1.fna&oh=03_Q7cD1wESsbcv5wOaepqwTAZ-lK4FURb5QNPNk_l2jhlGFKEp6Q&oe=68106244',

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
		frames: [],
	}
};

window.globals = globals;

export default globals;