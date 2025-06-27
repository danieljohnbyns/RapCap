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

const Camera = ({ mediaDevices, setMediaDevices, mediaDevice, setMediaDevice }) => {
	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	React.useEffect(() => {
		const canvas = document.getElementById('cameraCanvas');
		if (!canvas) return;
		const ctx = canvas.getContext('2d');
		canvas.width = 640; // Set canvas width
		canvas.height = 480; // Set canvas height
		const video = document.createElement('video');
		video.width = canvas.width;
		video.height = canvas.height;

		const constraints = {
			video: {
				deviceId: mediaDevice ? { exact: mediaDevice } : undefined,
				width: { ideal: 640 },
				height: { ideal: 480 }
			}
		};
		navigator.mediaDevices.getUserMedia(constraints)
			.then((stream) => {
				video.srcObject = stream;
				video.play();
			})
			.catch((error) => {
				console.error('Error accessing media devices:', error);
			});
		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			requestAnimationFrame(draw);
		}
		draw();
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
			<div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
				<canvas id='cameraCanvas' style={{ width: '100%', height: 'auto', borderRadius: '8px', marginBottom: '16px' }} />
			</div>
		</Panel>
	);
};

export default Camera;