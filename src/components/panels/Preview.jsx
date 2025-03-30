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
		this.parentRef = React.createRef();

		this.imageTemplate = null;
	};

	drawCanvas = () => {
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		const parent = this.parentRef.current;

		const draw = () => {
			const parentWidth = parent.offsetWidth;
			const parentHeight = parent.offsetHeight;

			// Maintain aspect ratio
			const imageAspectRatio = this.imageTemplate.width / this.imageTemplate.height;
			let canvasWidth = parentWidth;
			let canvasHeight = parentWidth / imageAspectRatio;

			if (canvasHeight > parentHeight) {
				canvasHeight = parentHeight;
				canvasWidth = parentHeight * imageAspectRatio;
			};

			canvas.width = canvasWidth;
			canvas.height = canvasHeight;

			ctx.clearRect(0, 0, canvas.width, canvas.height);

			if (this.imageTemplate)
				ctx.drawImage(this.imageTemplate, 0, 0, canvas.width, canvas.height);

			requestAnimationFrame(draw);
		};

		draw();
	};

	importImageTemplate = async () => {
		try {
			const result = await window.api.openImageDialog();

			if (result?.error) {
				console.error('Import failed:', result.error);
				return;
			};

			if (result) {
				console.log('Imported image:', result);
				globals.options.imageTemplate = result;
				const image = new Image();
				image.src = result;
				image.onload = () => {
					this.imageTemplate = image;
					this.drawCanvas();
				};
			};
		} catch (error) {
			console.error('IPC communication error:', error);
		};
	};

	handleImportImageTemplate = (event) => {
		this.importImageTemplate(event.detail);
	};

	componentDidMount() {
		const image = new Image();
		image.src = globals.options.imageTemplate || '';
		image.onload = () => {
			this.imageTemplate = image;
			this.drawCanvas();
		};

		window.addEventListener('import-image-template', this.handleImportImageTemplate);
	};

	componentWillUnmount() {
		window.removeEventListener('import-image-template', this.handleImportImageTemplate);
	};	

	render() {
		return (
			<>
				<div id='previewContainer'>
					<div ref={this.parentRef} style={{ width: '100%', height: '100%' }}>
						<canvas
							id='previewCanvas'
							ref={this.canvasRef}
							style={{ display: 'block', margin: '0 auto' }}
						></canvas>
					</div>
				</div>

				<div id='cameraControls'>
					<Button
						type='primary'
						icon={<ExportOutlined />}
						onClick={() => { }}
					>
						Launch preview Window
					</Button>

					<Button
						type='primary'
						icon={<DeleteOutlined />}
						onClick={() => { }}
					>
						Clear frames
					</Button>
				</div>
			</>
		);
	};
};