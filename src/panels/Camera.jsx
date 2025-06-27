import React from 'react';

import {
	Form,
	Button,
	Typography,
	Select,
	Image
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
	resolution, setResolution
}) => {
	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	React.useEffect(() => {
		const canvas = document.getElementById('cameraCanvas');
		const video = document.getElementById('cameraVideo');

		if (!canvas || !video) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const handleVideoStream = async () => {
			try {
				canvas.width = 0;
				canvas.height = 0;

				const stream = await navigator.mediaDevices.getUserMedia({
					video: {
						deviceId: mediaDevice ? { exact: mediaDevice } : undefined
					}
				});
				video.srcObject = stream;

				video.onloadedmetadata = () => {
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

		handleVideoStream();

		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			};
			requestAnimationFrame(draw);
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
			<div style={{ width: '100%', height: '100%', display: 'flex', justify: 'center', alignItems: 'center' }}>
				<canvas id='cameraCanvas' style={{ display: 'none' }} />
				<video id='cameraVideo' style={{ maxWidth: '100%', maxHeight: '100%' }} />
			</div>
		</Panel>
	);
};

export default Camera;