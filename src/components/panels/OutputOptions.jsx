import React from 'react';

import {
	Input,
	Select,
	Row, Col,
	Button
} from 'antd';

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
	render() {
		return (
			<div id='outputOptionsContainer'>
				<Input
					style={{ width: '100%' }}
					defaultValue={globals.options.output.name}
					value={this.state.name}
					placeholder='File Name'
					onChange={(event) => {
						globals.options.output.name = event.target.value;
						this.setState({
							name: event.target.value
						});
					}}
				/>

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

				<Button
					style={{ width: '100%' }}
					type='primary'
					onClick={() => {
						if (globals.options.output.name === '') {
							globals.options.output.name = 'output';
							globals.swal.mixin({
								toast: true,
								position: 'top-end',
								showConfirmButton: false,
								timer: 5000,
								timerProgressBar: true,
								didOpen: (toast) => {
									toast.addEventListener('mouseenter', globals.swal.stopTimer);
									toast.addEventListener('mouseleave', globals.swal.resumeTimer);
								}
							}).fire({
								icon: 'warning',
								title: <p>File name cannot be empty</p>
							});
						};

						globals.downloadImage(
							globals.options.output.name,
							globals.options.output.format,
							globals.options.output.scale
						).then((result) => {
							globals.swal.mixin({
								toast: true,
								position: 'top-end',
								showConfirmButton: false,
								timer: 5000,
								timerProgressBar: true,
								didOpen: (toast) => {
									toast.addEventListener('mouseenter', globals.swal.stopTimer);
									toast.addEventListener('mouseleave', globals.swal.resumeTimer);
								}
							}).fire({
								icon: 'success',
								title: <p>Image exported successfully</p>
							});
						})
							.catch((error) => {
								globals.swal.mixin({
									toast: true,
									position: 'top-end',
									showConfirmButton: false,
									timer: 5000,
									timerProgressBar: true,
									didOpen: (toast) => {
										toast.addEventListener('mouseenter', globals.swal.stopTimer);
										toast.addEventListener('mouseleave', globals.swal.resumeTimer);
									}
								}).fire({
									icon: 'error',
									title: <p>Image export failed</p>,
									html: <p>{`${error}`}</p>
								});
							});
					}}
				>
					Export
				</Button>
			</div>
		);
	};
};