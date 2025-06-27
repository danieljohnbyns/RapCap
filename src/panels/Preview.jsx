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
	mediaDevices, setMediaDevices,
	mediaDevice, setMediaDevice,
	resolution, setResolution,
	videoSettings, setVideoSettings,
	frameSettings, setFrameSettings,
	imageTemplate, setImageTemplate,
	stream, setStream
}) => {
	const [templateLoaded, setTemplateLoaded] = React.useState(false);
	// Convert the image template URL to a Blob URL for preview
	React.useEffect(() => {
		const canvas = document.getElementById('previewCanvas');
		const overlayDiv = document.getElementById('previewOverlay');
		const underlayDiv = document.getElementById('previewUnderlay');
		if (!canvas || !overlayDiv || !underlayDiv) return;

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
			underlayDiv.width = img.width;
			underlayDiv.height = img.height;

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
		const overlayDiv = document.getElementById('previewOverlay');
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

	React.useEffect(() => {
		const underlayDiv = document.getElementById('previewUnderlay');
		const cameraCanvas = document.getElementById('cameraCanvas');
		if (!underlayDiv || !cameraCanvas) return;

		const ctx = underlayDiv.getContext('2d');
		const cameraCtx = cameraCanvas.getContext('2d');
		if (!ctx || !cameraCtx) return;

		ctx.clearRect(0, 0, underlayDiv.width, underlayDiv.height);

		const availableFrame = frameSettings.filter(frame => !frame.buffer)[0];
		if (!availableFrame) return;

		const drawFrame = () => {
			// Calculate aspect ratios
			const streamAspect = cameraCanvas.width / cameraCanvas.height;
			const frameAspect = availableFrame.size.width / availableFrame.size.height;

			let drawWidth = availableFrame.size.width;
			let drawHeight = availableFrame.size.height;
			let offsetX = 0;
			let offsetY = 0;

			// Adjust dimensions to maintain aspect ratio
			if (streamAspect > frameAspect) {
				// Stream is wider - fit by height
				drawHeight = availableFrame.size.height;
				drawWidth = drawHeight * streamAspect;
				offsetX = (availableFrame.size.width - drawWidth) / 2;
			} else {
				// Stream is taller - fit by width
				drawWidth = availableFrame.size.width;
				drawHeight = drawWidth / streamAspect;
				offsetY = (availableFrame.size.height - drawHeight) / 2;
			};

			// Add clipping region
			ctx.save();
			ctx.beginPath();
			ctx.rect(
				availableFrame.position.x,
				availableFrame.position.y,
				availableFrame.size.width,
				availableFrame.size.height
			);
			ctx.clip();

			// Draw with calculated dimensions
			try {
				ctx.drawImage(
					cameraCanvas,
					availableFrame.position.x + offsetX,
					availableFrame.position.y + offsetY,
					drawWidth,
					drawHeight
				);
			} catch (error) { };

			// Remove clipping
			ctx.restore();

			requestAnimationFrame(drawFrame);
		};
		drawFrame();
	}, [frameSettings]);

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
				<canvas id='previewCanvas' style={{ position: 'relative', maxWidth: '100%', maxHeight: '100%', zIndex: 5 }} />

				<canvas id='previewOverlay' style={{ position: 'absolute', maxWidth: '100%', maxHeight: '100%', zIndex: 10 }} />
				<canvas id='previewUnderlay' style={{ position: 'absolute', maxWidth: '100%', maxHeight: '100%', zIndex: 1 }} />
			</div>
		</Panel>
	);
};

export default Preview;