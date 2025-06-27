import React from 'react';

import {
	Form,
	Button,
	Select
} from 'antd';

import {
	CameraOutlined,
	ClockCircleOutlined
} from '@ant-design/icons';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const Camera = ({
	mediaDevices, setMediaDevices, mediaDevice, setMediaDevice,
	resolution, setResolution,
	videoSettings, setFilterFunction
}) => {
	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

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
			}
			video.srcObject = null;
		};
	}, [mediaDevice, mediaDevices]);

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
							alert('Camera button clicked!');
						}}
					>
						Shoot
					</Button>
					<Form
						layout='vertical'
						initialValues={{
							countdown: options.countdown
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
									{ value: 3, label: '3 Seconds' }
								]}

								onChange={(value) => {
									setOptions({
										countdown: value
									});
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
				<canvas id='cameraCanvas' style={{ maxWidth: '100%', maxHeight: '100%' }} />
				<video id='cameraVideo' style={{ display: 'none' }} />
			</div>
		</Panel>
	);
};

export default Camera;