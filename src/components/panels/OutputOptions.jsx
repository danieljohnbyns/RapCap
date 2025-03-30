import React from 'react';

import {
	Input,
	Select,
	Row, Col,
	Button
} from 'antd';

import globals from '../../utils/globals.js';

export default class OutputOptions extends React.Component {
	render() {
		return (
			<div id='outputOptionsContainer'>
				<Input
					style={{ width: '100%' }}
					defaultValue={globals.options.output.name}
					placeholder='File Name'
					onChange={(event) => {
						globals.options.output.name = event.target.value;
					}}
				/>

				<Row
					style={{ alignItems: 'center', }}
				>
					<Col span={11}>
						<Select
							style={{ width: '100%' }}
							defaultValue={globals.options.output.scale}
							onChange={(value) => {
								globals.options.output.scale = value;
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
							onChange={(value) => {
								globals.options.output.format = value;
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
						};

						globals.downloadImage(
							globals.options.output.name,
							globals.options.output.format,
							globals.options.output.scale
						);
					}}
				>
					Export
				</Button>
			</div>
		);
	};
};