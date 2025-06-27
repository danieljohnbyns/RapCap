import React from 'react';

import {
	Button
} from 'antd';

import {
	ExpandAltOutlined,
	ClearOutlined
} from '@ant-design/icons';

import Panel from '../components/Panel.jsx';

const Preview = ({
	imageTemplate, setImageTemplate,
	frameSettings, setFrameSettings
}) => {
	const [templateLoaded, setTemplateLoaded] = React.useState(false);
	// Convert the image template URL to a Blob URL for preview
	React.useEffect(() => {
		const canvas = document.getElementById('previewCanvas');
		const overlayDiv = document.getElementById('overlay');
		if (!canvas || !overlayDiv) return;

		const ctx = canvas.getContext('2d');
		if (!ctx) return;

		const img = new Image();
		img.crossOrigin = 'Anonymous'; // Handle CORS if the image is from a different origin
		img.src = imageTemplate;

		img.onload = () => {
			canvas.width = img.width;
			canvas.height = img.height;
			overlayDiv.width = img.width;
			overlayDiv.height = img.height;

			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.drawImage(img, 0, 0);

			setTemplateLoaded(true);
		};

		img.onerror = (error) => {
			console.error('Error loading image template:', error);
			ctx.clearRect(0, 0, canvas.width, canvas.height);
			ctx.fillText('Failed to load image template', 10, 50);
		};
	}, [imageTemplate]);

	// Draw frames on the overlay canvas
	React.useEffect(() => {
		const overlayDiv = document.getElementById('overlay');
		if (!overlayDiv || !templateLoaded) return;

		const ctx = overlayDiv.getContext('2d');
		if (!ctx) return;

		ctx.clearRect(0, 0, overlayDiv.width, overlayDiv.height);
		// Draw each frame on the overlay canvas
		for (const frame of frameSettings) {
			ctx.strokeStyle = 'red';
			ctx.lineWidth = 2;
			ctx.strokeRect(frame.position.x, frame.position.y, frame.size.width, frame.size.height);

			// Text
			ctx.fillStyle = 'red';
			ctx.font = '16px Arial';
			ctx.fillText(`Frame ${frameSettings.indexOf(frame) + 1}`, frame.position.x + 6, frame.position.y + 12 + (16 / 2));
		};
	}, [frameSettings, templateLoaded]);

	return (
		<Panel
			title='Preview'
			actions={(
				<>
					<Button
						type='primary'
						icon={<ExpandAltOutlined />}
						style={{ width: '100%' }}
						onClick={() => {
							alert('Expand button clicked!');
						}}
					>
						Expand
					</Button>
					<Button
						type='primary'
						danger
						icon={<ClearOutlined />}
						onClick={() => {
							alert('Clear button clicked!');
						}}
					>
						Clear
					</Button>
				</>
			)}
		>
			<div style={{
				position: 'absolute',
				top: 0, left: 0, width: '100%', height: '100%',
				display: 'flex', justifyContent: 'center', alignItems: 'center'
			}}>
				<canvas id='previewCanvas' style={{ maxWidth: '100%', maxHeight: '100%' }} />

				<canvas id='overlay' style={{ position: 'absolute', maxWidth: '100%', maxHeight: '100%', zIndex: 10 }} />
			</div>
		</Panel>
	);
};

export default Preview;