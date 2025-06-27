import React from 'react';

import {
	Form,
	Button,
	Select,
	Typography
} from 'antd';

import {
	CameraOutlined,
	ClockCircleOutlined
} from '@ant-design/icons';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const { Title, Text } = Typography;

const Camera = ({
	mediaDevices, setMediaDevices, mediaDevice, setMediaDevice,
	frameSettings, setFrameSettings,
	videoSettings, setFilterFunction,
	stream, setStream
}) => {
	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};
	const [countdown, setCountdown] = React.useState(options.countdown || 0);

	const videoSettingsRef = React.useRef(videoSettings);
	React.useEffect(() => {
		videoSettingsRef.current = videoSettings;
	}, [videoSettings]);

	React.useEffect(() => {
		const canvas = document.getElementById('cameraCanvas');
		const video = document.getElementById('cameraVideo');

		if (!canvas || !video) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		let timeoutId;
		let stream = null;

		const handleVideoStream = async () => {
			try {
				canvas.width = 0;
				canvas.height = 0;

				// Handle media device selection
				const deviceIdValue = typeof mediaDevice === 'string'
					? mediaDevice
					: mediaDevice?.deviceId;

				stream = await navigator.mediaDevices.getUserMedia({
					video: {
						deviceId: deviceIdValue ? { exact: deviceIdValue } : undefined
					}
				});
				video.srcObject = stream;

				video.onloadedmetadata = async () => {
					const videoTrack = stream.getVideoTracks()[0];
					const settings = videoTrack.getSettings();

					canvas.width = settings.width;
					canvas.height = settings.height;
					console.log('Video settings:', settings);

					video.play();
					draw();

					setStream(video);
				};
			} catch (error) {
				console.error('Error accessing media devices:', error);
			};
		};

		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				ctx.clearRect(0, 0, canvas.width, canvas.height);

				// Apply filters using current settings
				ctx.filter = `
					brightness(${videoSettingsRef.current.brightness}%) 
					contrast(${videoSettingsRef.current.contrast}%)
				`;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			timeoutId = setTimeout(draw, 1000 / 30); // 30 FPS
		};

		handleVideoStream();

		// Cleanup function
		return () => {
			clearTimeout(timeoutId);
			if (stream) {
				stream.getTracks().forEach(track => track.stop());
			};
			video.srcObject = null;
		};
	}, [mediaDevice, mediaDevices]);

	const [overlayMessage, setOverlayMessage] = React.useState('');

	return (
		<Panel
			title='Camera'
			actions={(
				<>
					<Button
						type='primary'
						icon={<CameraOutlined />}
						style={{ width: '100%' }}
						onClick={() => {
							let count = countdown || 0;
							if (count > 0) {
								setOverlayMessage(<Title level={1} style={{ color: 'white' }}>{count}</Title>);
								const countdownInterval = setInterval(() => {
									count -= 1;
									if (count <= 0) {
										clearInterval(countdownInterval);
										setOverlayMessage('');
										const canvas = document.getElementById('cameraCanvas');
										// Get the base64 image data from the canvas
										const imageData = canvas.toDataURL('image/png');

										// Save to the buffer of latest available frame
										const availableFrame = frameSettings.find(frame => !frame.buffer);
										if (availableFrame) {
											availableFrame.buffer = imageData;
											setFrameSettings([...frameSettings]);

											setOptions({
												frames: frameSettings
											});
										};
									} else {
										setOverlayMessage(<Title level={1} style={{ color: 'white' }}>{count}</Title>);
									};
								}, 1000);
							};
						}}
					>
						Shoot
					</Button>
					<Form
						layout='vertical'
						initialValues={{
							countdown: countdown
						}}
					>
						<Form.Item
							name='countdown'
							style={{ marginBottom: 0 }}
						>
							<Select
								prefix={<ClockCircleOutlined />}
								options={[
									{ value: 0, label: 'Instant' },
									{ value: 1, label: '1 Second' },
									{ value: 2, label: '2 Seconds' },
									{ value: 3, label: '3 Seconds' },
									{ value: 5, label: '5 Seconds' },
									{ value: 10, label: '10 Seconds' }
								]}

								onChange={(value) => {
									setOptions({
										countdown: value
									});
									setCountdown(value);
								}}
							/>
						</Form.Item>
					</Form>
				</>
			)}
		>
			<div style={{
				position: 'absolute',
				top: 0, left: 0, width: '100%', height: '100%',
				display: 'flex', justifyContent: 'center', alignItems: 'center'
			}}>
				{overlayMessage &&
					<div id='cameraOverlay' style={{
						position: 'absolute',
						top: 0, left: 0, width: '100%', height: '100%',
						backgroundColor: 'rgba(0, 0, 0, 0.5)',
						display: 'flex', justifyContent: 'center', alignItems: 'center',
						color: 'white', fontSize: '24px', fontWeight: 'bold',
						zIndex: 1
					}}>
						{overlayMessage}
					</div>
				}
				<canvas id='cameraCanvas' style={{ maxWidth: '100%', maxHeight: '100%' }} />
				<video id='cameraVideo' style={{ display: 'none' }} />
			</div>
		</Panel>
	);
};

export default Camera;