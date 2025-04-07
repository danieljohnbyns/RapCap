import React from 'react';

import {
	Select,
	Row, Col,
	Button
} from 'antd';

import { Buffer } from 'buffer';

import globals from '../../utils/globals.js';

export default class OutputOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			name: globals.options.output.name,
			scale: globals.options.output.scale,
			format: globals.options.output.format
		};
	};

	componentDidMount() {
		if (globals.mounted.includes('outputOptions')) return;

		this.setState({
			name: globals.options.output.name,
			scale: globals.options.output.scale,
			format: globals.options.output.format
		});

		window.addEventListener('optionsUpdated', (event) => {
			this.setState({
				name: globals.options.output.name,
				scale: globals.options.output.scale,
				format: globals.options.output.format
			});
		});

		globals.mounted.push('outputOptions');
	};

	render() {
		return (
			<div id='outputOptionsContainer'>
				<Button
					style={{ width: '100%' }}
					type='primary'
					// In OutputOptions.jsx update the Export button's onClick handler:
					onClick={async () => {
						try {
							const canvas = document.getElementById('previewCanvas');
							if (!canvas) throw new Error('Canvas not found');

							// Create temporary canvas for scaling
							const tempCanvas = document.createElement('canvas');
							const tempCtx = tempCanvas.getContext('2d');
							const scale = this.state.scale;
							const format = this.state.format;

							// Set scaled dimensions
							tempCanvas.width = canvas.width * scale;
							tempCanvas.height = canvas.height * scale;

							// Fill background for JPEG/WEBP
							if (format !== 'png') {
								tempCtx.fillStyle = '#ffffff'; // White background
								tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);
							};

							// Scale and draw original image
							tempCtx.drawImage(
								canvas,
								0, 0, canvas.width, canvas.height,
								0, 0, tempCanvas.width, tempCanvas.height
							);

							// Get image data
							const mimeType = `image/${format}`;
							const dataUrl = tempCanvas.toDataURL(mimeType, 1.0);
							const base64Data = dataUrl.split(',')[1];

							const filename = await new Promise((resolve) => {
								globals.swal.fire({
									title: 'Export',
									input: 'text',
									inputLabel: 'Enter a file name',
									inputPlaceholder: 'output',
									inputValue: this.state.name,
									showCancelButton: true,
									confirmButtonText: 'Export',
									cancelButtonText: 'Cancel',
									inputValidator: (value) => {
										if (!value)
											return 'Please enter a file name';
									}
								}).then((result) => {
									if (result.isConfirmed) {
										resolve(result.value);
									} else {
										resolve(null);
									};
								});
							});

							if (!filename) return;
							globals.options.output.name = filename;
							this.setState({
								name: filename
							});
							globals.setOptions({
								output: {
									name: filename,
									scale: scale,
									format: format
								}
							});

							const buffer = Buffer.from(base64Data, 'base64');

							window.api.saveFile(`${filename}.${format}`, buffer)
								.then((result) => {
									console.log('Export result:', result);

									if (result.success) {
										globals.swal.fire({
											icon: 'success',
											title: 'Export Successful',
											text: `File saved to ${result.path}`
										});
									} else {
										globals.swal.fire({
											icon: 'error',
											title: 'Export Error',
											text: result.error
										});
									};
								})
								.catch((error) => {
									globals.swal.fire({
										icon: 'error',
										title: 'Export Error',
										text: error.message
									});
									console.error('Export error:', error);
								});
						} catch (error) {
							globals.swal.fire({
								icon: 'error',
								title: 'Export Error',
								text: error.message
							});
							console.error('Export error:', error);
						};
					}}
				>
					Export
				</Button>

				<Row
					style={{ alignItems: 'center', }}
				>
					<Col span={11}>
						<Select
							style={{ width: '100%' }}
							defaultValue={globals.options.output.scale}
							value={this.state.scale}
							onChange={(value) => {
								globals.options.output.scale = value;
								this.setState({
									scale: value
								});
							}}
							options={[
								{
									value: 1,
									label: '1x'
								},
								{
									value: 2,
									label: '2x'
								},
								{
									value: 3,
									label: '3x'
								},
								{
									value: 4,
									label: '4x'
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
						/>
					</Col>

					<Col span={2} />

					<Col span={11}>
						<Select
							style={{ width: '100%' }}
							defaultValue={globals.options.output.format}
							value={this.state.format}
							onChange={(value) => {
								globals.options.output.format = value;
								this.setState({
									format: value
								});
							}}

							options={[
								{
									value: 'png',
									label: 'PNG'
								},
								{
									value: 'jpeg',
									label: 'JPEG'
								},
								{
									value: 'webp',
									label: 'WEBP'
								}
							]}
							variant='outlined'
						/>
					</Col>
				</Row>
			</div>
		);
	};
};