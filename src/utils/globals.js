
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
	buffer: ''
};

window.globals = globals;

export default globals;