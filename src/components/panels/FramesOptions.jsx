import React from 'react';

import {
	InputNumber,
	Divider,
	Button,
	Row, Col
} from 'antd';

import {
	RedoOutlined,
	ArrowUpOutlined,
	ArrowDownOutlined
} from '@ant-design/icons';

import globals from '../../utils/globals.js';

export default class FramesOptions extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			frameCount: globals.options.frames.length,
			frames: globals.options.frames
		};
	};

	componentDidMount() {
		this.setState({
			frameCount: globals.options.frames.length,
			frames: globals.options.frames
		});

		window.addEventListener('optionsUpdated', (event) => {
			this.setState({
				frameCount: globals.options.frames.length,
				frames: globals.options.frames
			});
		});
	};

	render() {
		return (
			<div id='framesOptionsContainer'>
				<Row
					style={{ alignItems: 'center' }}
				>
					<Col span={6}>
						<p>Frames</p>
					</Col>
					<Col span={18}>
						<InputNumber
							style={{ width: '100%' }}
							defaultValue={globals.options.frames.length}
							onChange={(value) => {
								const frames = globals.options.frames;
								if (value > frames.length) {
									for (let i = frames.length; i < value; i++) {
										const lastFrame = frames[frames.length - 1];
										frames.push({
											size: {
												width: lastFrame?.size?.width || 100,
												height: lastFrame?.size?.height || 100
											},
											position: {
												x: lastFrame?.position?.x + 100 || 0,
												y: lastFrame?.position?.y + 100 || 0
											},
											buffer: null
										});
									};
								} else if (value < frames.length) {
									frames.splice(value, frames.length - value);
								};
								this.setState({
									frameCount: value,
									frames: frames
								});
								globals.setOptions({
									frames: frames
								});
							}}
							min={1}
							max={10}
							step={1}
							placeholder='Frames'
						/>
					</Col>
				</Row>

				{this.state.frames.map((frame, index) => {
					return (
						<div key={`frame${index}`}>
							<Divider>
								{`Frame ${index + 1}`}
							</Divider>
							<div
								style={{
									display: 'flex',
									flexDirection: 'column',
									gap: '1rem',
								}}
							>
								<Row
									style={{ alignItems: 'center' }}
								>
									<Col span={6}>
										<p>Position</p>
									</Col>
									<Col span={8}>
										<InputNumber
											style={{ width: '100%' }}
											defaultValue={frame.position.x}
											onChange={(value) => {
												const frames = globals.options.frames;
												frames[index].position.x = value;
												this.setState({
													frames: frames
												});
												globals.setOptions({
													frames: frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='X'
										/>
									</Col>

									<Col span={2}>
										<p style={{ textAlign: 'center' }}>x</p>
									</Col>

									<Col span={8}>
										<InputNumber
											style={{ width: '100%' }}
											defaultValue={frame.position.y}
											onChange={(value) => {
												const frames = globals.options.frames;
												frames[index].position.y = value;
												this.setState({
													frames: frames
												});
												globals.setOptions({
													frames: frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='Y'
										/>
									</Col>
								</Row>

								<Row
									style={{ alignItems: 'center' }}
								>
									<Col span={6}>
										<p>Size</p>
									</Col>
									<Col span={8}>
										<InputNumber
											style={{ width: '100%' }}
											defaultValue={frame.size.width}
											onChange={(value) => {
												const frames = globals.options.frames;
												frames[index].size.width = value;
												this.setState({
													frames: frames
												});
												globals.setOptions({
													frames: frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='Width'
										/>
									</Col>

									<Col span={2}>
										<p style={{ textAlign: 'center' }}>x</p>
									</Col>

									<Col span={8}>
										<InputNumber
											style={{ width: '100%' }}
											defaultValue={frame.size.height}
											onChange={(value) => {
												const frames = globals.options.frames;
												frames[index].size.height = value;
												this.setState({
													frames: frames
												});
												globals.setOptions({
													frames: frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='Height'
										/>
									</Col>
								</Row>

								{frame.buffer ?
									<Row
										style={{ width: '100%', alignItems: 'center' }}
									>
										<Col span={16} />

										<Col span={2}>
											<Button
												type='primary'
												size='small'
												style={{ width: '100%' }}
												onClick={() => {
													const frames = globals.options.frames;
													if (index > 0) {
														// Move buffer to the previous frame
														frames[index - 1].buffer = frames[index].buffer;
														frames[index].buffer = null;
													} else {
														// Move buffer to the last frame
														frames[frames.length - 1].buffer = frames[index].buffer;
														frames[index].buffer = null;
													}
													this.setState({
														frames: frames
													});
													globals.setOptions({
														frames: frames
													});
												}}
												icon={<ArrowUpOutlined />}
											/>
										</Col>

										<Col span={1} />

										<Col span={2}>
											<Button
												type='primary'
												size='small'
												style={{ width: '100%' }}
												onClick={() => {
													const frames = globals.options.frames;
													if (index < frames.length - 1) {
														// Move buffer to the next frame
														frames[index + 1].buffer = frames[index].buffer;
														frames[index].buffer = null;
													} else {
														// Move buffer to the first frame
														frames[0].buffer = frames[index].buffer;
														frames[index].buffer = null;
													}
													this.setState({
														frames: frames
													});
													globals.setOptions({
														frames: frames
													});
												}}
												icon={<ArrowDownOutlined />}
											/>
										</Col>

										<Col span={1} />

										<Col span={2}>
											<Button
												type='primary'
												size='small'
												style={{ width: '100%' }}
												onClick={() => {
													const frames = globals.options.frames;
													frames[index].buffer = null;
													this.setState({
														frames: frames
													});
													globals.setOptions({
														frames: frames
													});
												}}
												icon={<RedoOutlined />}
											/>
										</Col>
									</Row>
									: null}
							</div>
						</div>
					);
				})}
			</div>
		);
	};
};