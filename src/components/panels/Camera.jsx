import React from 'react';

import {
	CameraOutlined,
	ClockCircleOutlined,
	DownOutlined
} from '@ant-design/icons';
import {
	Button,
	Select,
	Row, Col
} from 'antd';

import globals from '../../utils/globals.js';

export default class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.canvasRef = React.createRef();
		this.context = null;

		this.state = {
			countdown: globals.options.countdown,
			currentCountdown: 0,
			mediaDevices: globals.options.mediaDevices,
			mediaDevice: globals.options.mediaDevice,
			frames: []
		};
	};

	resolveDevices = async () => {
		await new Promise((resolve, reject) => {
			navigator.mediaDevices.enumerateDevices()
				.then((devices) => {
					const mediaDevices = devices.filter((device) => device.kind === 'videoinput');
					const mediaDevice = mediaDevices[0];
					if (!mediaDevices || mediaDevices.length === 0) {
						alert('No camera found');
						reject('No camera found');
						return;
					};

					globals.setOptions({
						mediaDevices: mediaDevices,
						mediaDevice: null
					});
					this.setState({
						mediaDevices: mediaDevices,
						mediaDevice: null
					});
					resolve(mediaDevice);
				})
				.catch((error) => {
					alert('Error getting media devices: ' + error);
					reject(error);
				});
		});
	};

	startDevice = async (device = null) => {
		if (!device && this.state.mediaDevices.length === 0)
			return;
		if (!device)
			device = this.state.mediaDevices[0];
		globals.setOptions({
			mediaDevice: device
		}, true);
		this.videoRef.current.srcObject = null;
		this.videoRef.current.srcObject = await navigator.mediaDevices.getUserMedia({
			video: {
				deviceId: device.deviceId
			}
		});
		this.videoRef.current.addEventListener('loadedmetadata', () => {
			this.videoRef.current.play();
			this.canvasRef.current.width = this.videoRef.current.videoWidth;
			this.canvasRef.current.height = this.videoRef.current.videoHeight;
			this.draw();
		});
	};

	stopDevice = () => {
		if (this.videoRef.current.srcObject) {
			const tracks = this.videoRef.current.srcObject.getTracks();
			tracks.forEach((track) => {
				track.stop();
			});
			this.videoRef.current.srcObject = null;
		};
	};

	draw = () => {
		if (this.videoRef.current.paused || this.videoRef.current.ended)
			return;
		if (!this.context || !this.context.drawImage)
			this.context = this.canvasRef.current.getContext('2d');
		this.context.drawImage(this.videoRef.current, 0, 0, this.canvasRef.current.width, this.canvasRef.current.height);
		requestAnimationFrame(this.draw);

		const parent = this.canvasRef.current.parentElement;
		const parentWidth = parent.clientWidth;
		const parentHeight = parent.clientHeight;

		const canvasWidth = this.canvasRef.current.width;
		const canvasHeight = this.canvasRef.current.height;

		const scaleX = parentWidth / canvasWidth;
		const scaleY = parentHeight / canvasHeight;
		const scale = Math.min(scaleX, scaleY);

		const overlay = document.getElementById('cameraOverlay');
		const style = {
			transform: `scale(${scale})`,
			transformOrigin: 'top left',
			width: `${this.canvasRef.current.offsetWidth}px`,
			height: `${this.canvasRef.current.offsetHeight}px`,
			position: 'absolute',
			left: `${(parentWidth - canvasWidth * scale) / 2}px`,
			top: `${(parentHeight - canvasHeight * scale) / 2}px`,
			pointerEvents: 'none',
			borderRadius: `${1 / scale}rem`
		};
		for (const [key, value] of Object.entries(style)) {
			this.canvasRef.current.style[key] = value;
			overlay.style[key] = value;
		};

		this.canvasRef.current.style.zIndex = '1';
		overlay.style.zIndex = '2';

		const border = document.getElementById('border');
		const currentFrame = globals.options.frames.find((frame) => !frame.buffer);
		if (currentFrame) {
			const ratio = Math.min(canvasWidth / currentFrame.size.width, canvasHeight / currentFrame.size.height);
			const borderWidth = currentFrame.size.width * ratio;
			const borderHeight = currentFrame.size.height * ratio;
			const borderStyle = {
				width: `${borderWidth}px`,
				height: `${borderHeight}px`,
				top: `${(canvasHeight - borderHeight) / 2}px`,
				left: `${(canvasWidth - borderWidth) / 2}px`,
				backgroundColor: 'transparent',
				border: `solid ${0.25 / scale}rem var(--color-light)`,
				boxShadow: `0 0 ${0.5 / scale}rem var(--color-dark)`,
				position: 'absolute',
				pointerEvents: 'none'
			};
			for (const [key, value] of Object.entries(borderStyle)) {
				border.style[key] = value;
			};
			border.style.zIndex = '3';
			border.style.boxSizing = 'border-box';
			border.style.pointerEvents = 'none';
			const counter = document.getElementById('counter');
			counter.style.fontSize = `${20 / scale}rem`;
			counter.style.color = 'var(--color-light)';
		};
	};

	async componentDidMount() {
		await this.resolveDevices();
		await this.startDevice();

		this.setState({
			countdown: globals.options.countdown,
			currentCountdown: 0,
			frames: globals.options.frames
		});

		window.addEventListener('optionsUpdated', (event) => {
			this.setState({
				frames: globals.options.frames
			});

			if (this.state.mediaDevice !== globals.options.mediaDevice) {
				this.stopDevice();
				this.startDevice(globals.options.mediaDevice);

				return;
			};

			this.setState({
				countdown: globals.options.countdown,
				currentCountdown: 0
			});
		});

		// Listen for media devices changes
		navigator.mediaDevices.ondevicechange = async () => {
			await this.resolveDevices();
			if (this.state.mediaDevice !== globals.options.mediaDevice) {
				this.stopDevice();
				this.startDevice(globals.options.mediaDevice);
			};
		};
	};

	shoot = () => {
		// Save the current frame to buffer and emit an event
		const canvas = this.canvasRef.current;
		const currentFrame = globals.options.frames.find((frame) => !frame.buffer);
		if (!currentFrame) return;

		const base64 = canvas.toDataURL('image/png');
		currentFrame.buffer = base64;

		currentFrame.resolution = {
			width: canvas.width,
			height: canvas.height
		};

		globals.setOptions({
			frames: globals.options.frames
		});
	};

	render() {
		return (
			<>
				<div id='cameraContainer'>
					<video
						ref={this.videoRef}
						style={{ display: 'none' }}
					></video>
					<canvas
						id='cameraCanvas'
						ref={this.canvasRef}
					></canvas>

					<div id='cameraOverlay'>
						<div id='border' />
						<div id='counter'>
							{this.state.currentCountdown > 0 ? this.state.currentCountdown : ''}
						</div>
					</div>
				</div>

				<div id='cameraControls'>
					<Row
						style={{ width: '100%', alignItems: 'center' }}
					>
						<Col span={17}>
							<Button
								type='primary'
								icon={<CameraOutlined />}
								disabled={
									(this.state.currentCountdown > 0) || !this.state.frames.find((frame) => !frame.buffer)
								}
								onClick={async () => {
									this.setState({
										currentCountdown: globals.options.countdown
									});
									for (let i = globals.options.countdown; i > 0; i--) {
										this.setState({
											currentCountdown: i
										});
										await new Promise((resolve) => setTimeout(resolve, 1000));
									};
									this.shoot();
									this.setState({
										currentCountdown: 0
									});
								}}
							>
								Shoot
							</Button>
						</Col>

						<Col span={1} />

						<Col span={6}>
							<Select
								id='countdown'
								defaultValue={globals.options.countdown}
								value={this.state.countdown}
								style={{ width: '100%' }}
								placeholder='Countdown'
								options={[
									{
										value: 0,
										label: 'Instant'
									},
									{
										value: 3,
										label: '3 Seconds'
									},
									{
										value: 5,
										label: '5 Seconds'
									}
								]}
								optionRender={(option) => {
									return (
										<div style={{
											position: 'relative',
											height: '100%',
											display: 'flex',
											alignItems: 'center'
										}}>
											{option.label}
										</div>
									);
								}}
								variant='outlined'
								menuItemSelectedIcon={<ClockCircleOutlined />}
								onChange={(value) => {
									globals.setOptions({
										countdown: value
									});
									this.setState({
										countdown: value
									});
								}}
							/>
						</Col>
					</Row>
				</div>
			</>
		);
	};
};