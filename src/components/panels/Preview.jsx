import React from 'react';

import {
	ExportOutlined,
	DeleteOutlined
} from '@ant-design/icons';

import {
	Button
} from 'antd';

import globals from '../../utils/globals.js';

export default class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.canvasRef = React.createRef();
		this.canvas = null;
		this.context = null;
		this.imageTemplate = null;
		this.snapshots = [];
	};

	drawSnapshots = async () => {
		this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);
		for (let i = 0; i < this.snapshots.length; i++) {
			const snapshot = this.snapshots[i];
			const frame = globals.options.frames[i];
			if (!snapshot) continue;

			this.context.save();
			this.context.beginPath();
			this.context.rect(frame.position.x, frame.position.y, frame.size.width, frame.size.height);
			this.context.clip();

			// Calculate scaling to fit the buffer into the frame
			const scaleX = frame.size.width / snapshot.width;
			const scaleY = frame.size.height / snapshot.height;
			const scale = Math.max(scaleX, scaleY); // Fill the frame while clipping overflow

			const scaledWidth = snapshot.width * scale;
			const scaledHeight = snapshot.height * scale;

			// Center the image within the frame
			const offsetX = frame.position.x + (frame.size.width - scaledWidth) / 2;
			const offsetY = frame.position.y + (frame.size.height - scaledHeight) / 2;

			this.context.drawImage(snapshot, offsetX, offsetY, scaledWidth, scaledHeight);
			this.context.restore();
		};
	};

	drawImageTemplate = () => {
		if (!this.imageTemplate) return;
		this.context.drawImage(this.imageTemplate, 0, 0, this.canvas.width, this.canvas.height);
	};

	resizeCanvas = () => {
		const parent = this.canvasRef.current.parentElement;
		const parentWidth = parent.clientWidth;
		const parentHeight = parent.clientHeight;

		const canvasWidth = this.canvasRef.current.width;
		const canvasHeight = this.canvasRef.current.height;

		const scaleX = parentWidth / canvasWidth;
		const scaleY = parentHeight / canvasHeight;
		const scale = Math.min(scaleX, scaleY);

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
		};

		const previewOverlay = document.getElementById('previewOverlay');
		for (const [key, value] of Object.entries(style)) {
			previewOverlay.style[key] = value;
		};
		previewOverlay.style.zIndex = '2';
	};

	drawFrames = () => {
		if (!this.imageTemplate) return;
		for (const frame of Array.from(document.getElementsByClassName('previewFrame')))
			frame.remove();

		const parent = this.canvasRef.current.parentElement;
		const parentWidth = parent.clientWidth;
		const parentHeight = parent.clientHeight;

		const canvasWidth = this.canvasRef.current.width;
		const canvasHeight = this.canvasRef.current.height;

		const scaleX = parentWidth / canvasWidth;
		const scaleY = parentHeight / canvasHeight;
		const scale = Math.min(scaleX, scaleY);

		const previewOverlay = document.getElementById('previewOverlay');
		const frames = globals.options.frames;

		for (const frame of frames) {
			const frameElement = document.createElement('div');
			frameElement.className = 'previewFrame';
			frameElement.style.position = 'absolute';
			frameElement.style.pointerEvents = 'none';
			frameElement.style.left = `${frame.position.x}px`;
			frameElement.style.top = `${frame.position.y}px`;
			frameElement.style.width = `${frame.size.width}px`;
			frameElement.style.height = `${frame.size.height}px`;
			frameElement.style.border = `solid ${0.25 / scale}rem var(--color-light)`;
			frameElement.style.boxShadow = `0 0 ${0.25 / scale}rem var(--color-dark)`;

			previewOverlay.appendChild(frameElement);
		};
	};

	renderCanvas = async () => {
		this.canvas.width = this.imageTemplate.width;
		this.canvas.height = this.imageTemplate.height;

		await this.drawSnapshots();
		this.drawImageTemplate();
		this.drawFrames();
		this.resizeCanvas();

		this.snapshots = await (async () => {
			const snapshots = [];
			for (const frame of globals.options.frames) {
				if (!frame.buffer) {
					snapshots.push(null);
					continue;
				};
				const image = new Image();
				image.crossOrigin = 'anonymous';
				image.src = frame.buffer;
				await new Promise((resolve) => {
					image.onload = () => {
						snapshots.push(image);
						resolve();
					};
				});
			};
			return snapshots;
		})();

		requestAnimationFrame(() => {
			this.renderCanvas();
		});
	};

	async componentDidMount() {
		this.canvas = this.canvasRef.current;
		this.context = this.canvas.getContext('2d');

		const imageTemplate = new Image();
		imageTemplate.crossOrigin = 'anonymous';
		imageTemplate.src = globals.options.imageTemplate;
		await new Promise((resolve) => {
			imageTemplate.onload = () => {
				this.imageTemplate = imageTemplate;
				resolve();
			};
		});

		window.addEventListener('import-image-template', async (event) => {
			const dialog = await window.api.openImageDialog();
			if (!dialog) return;

			const imageTemplate = new Image();
			imageTemplate.crossOrigin = 'anonymous';
			imageTemplate.src = dialog;
			await new Promise((resolve) => {
				imageTemplate.onload = () => {
					this.imageTemplate = imageTemplate;
					resolve();
				};
			});
			globals.setOptions({ imageTemplate: dialog });
		});

		this.renderCanvas();
	};

	render() {
		return (
			<>
				<div id='previewContainer'>
					<div style={{ width: '100%', height: '100%' }}>
						<canvas
							id='previewCanvas'
							ref={this.canvasRef}
						></canvas>

						<div id='previewOverlay' />
					</div>
				</div>

				<div id='cameraControls'>
					{/* <Button
						type='primary'
						icon={<ExportOutlined />}
						onClick={() => { }}
					>
						Launch preview Window
					</Button> */}

					<Button
						type='primary'
						icon={<DeleteOutlined />}
						onClick={() => {
							globals.setOptions({
								frames: globals.options.frames.map((frame) => {
									frame.buffer = null;
									return frame;
								})
							});
							this.drawSnapshots();
						}}
					>
						Clear frames
					</Button>
				</div>
			</>
		);
	};
};