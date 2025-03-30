import React from 'react';

import {
	CameraOutlined,
	DownOutlined
} from '@ant-design/icons';
import {
	Button,
	Select
} from 'antd';

import globals, {
	
} from '../../utils/globals.js';

export default class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.canvasRef = React.createRef();
		this.parentRef = React.createRef();
		this.state = {
			devices: [],
			selectedDeviceId: null,
		};
	};

	componentDidMount() {
		this.getMediaDevices();
		this.startCamera();

		globals.changeCamera = this.changeCamera;
		globals.getMediaDevices = this.getMediaDevices;
	};

	getMediaDevices = async () => {
		try {
			const devices = await navigator.mediaDevices.enumerateDevices();
			const videoDevices = devices.filter(device => device.kind === 'videoinput');

			this.setState({
				devices: videoDevices,
				selectedDeviceId: videoDevices.length > 0 ? videoDevices[0].deviceId : null,
			});

			if (videoDevices.length > 0) {
				this.startCamera(videoDevices[0].deviceId);
			};

			return videoDevices;
		} catch (err) {
			console.error('Error getting media devices:', err);
		};
	};

	startCamera = (deviceId = null) => {
		const constraints = {
			video: deviceId ? { deviceId: { exact: deviceId } } : true,
		};

		navigator.mediaDevices
			.getUserMedia(constraints)
			.then((stream) => {
				// Set the video source to the webcam stream
				this.videoRef.current.srcObject = stream;
				this.videoRef.current.onloadedmetadata = () => {
					this.videoRef.current.play();
					this.updateCanvas();
				};
			})
			.catch((err) => {
				console.error('Error accessing webcam:', err);
			});
	};

	changeCamera = (deviceId) => {
		// Stop the current video stream
		const stream = this.videoRef.current.srcObject;
		if (stream) {
			stream.getTracks().forEach(track => track.stop());
		}

		// Start the camera with the new device
		this.startCamera(deviceId);
		this.setState({ selectedDeviceId: deviceId });
	};

	updateCanvas = () => {
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		const video = this.videoRef.current;
		const parent = this.parentRef.current;

		// Draw the video feed onto the canvas
		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				const parentWidth = parent.offsetWidth;
				const parentHeight = parent.offsetHeight;

				// Maintain aspect ratio
				const videoAspectRatio = video.videoWidth / video.videoHeight;
				let canvasWidth = parentWidth;
				let canvasHeight = parentWidth / videoAspectRatio;

				if (canvasHeight > parentHeight) {
					canvasHeight = parentHeight;
					canvasWidth = parentHeight * videoAspectRatio;
				};

				canvas.width = canvasWidth;
				canvas.height = canvasHeight;

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			};
			requestAnimationFrame(draw);
		};
		draw();
	};

	render() {
		return (
			<>
				<div id='cameraContainer'>
					<div ref={this.parentRef} style={{ width: '100%', height: '100%' }}>
						<video
							ref={this.videoRef}
							style={{ display: 'none' }} // Hide the video element
						></video>
						<canvas
							ref={this.canvasRef}
							id='cameraCanvas'
							style={{ display: 'block', margin: '0 auto' }}
						></canvas>
					</div>
				</div>

				<div id='cameraControls'>
					<Button
						type='primary'
						icon={<CameraOutlined />}
						onClick={() => { }}
					>
						Shoot
					</Button>
					<Select
						id='countdown'
						defaultValue='0'
						placeholder='Countdown'
						options={[
							{
								value: '0',
								label: 'Instant'
							},
							{
								value: '3',
								label: '3 Seconds'
							},
							{
								value: '5',
								label: '5 Seconds'
							}
						]}
						variant='outlined'
						suffixIcon={<DownOutlined />}
					/>
				</div>
			</>
		);
	};
};