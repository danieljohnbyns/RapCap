import React from 'react';

import {
	InputNumber,
	Divider,
	Row, Col,
} from 'antd';

import globals from '../../utils/globals.js';

export default class Frames extends React.Component {
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
								// Check if increasing or decreasing the number of frames
								if (value > this.state.frameCount) {
									const increse = value - this.state.frameCount;
									for (let i = 0; i < increse; i++) {
										if (this.state.frames.length > 0) {
											const lastFrame = this.state.frames[this.state.frames.length - 1];
											globals.options.frames.push({
												size: {
													width: lastFrame.size.width,
													height: lastFrame.size.height
												},
												position: {
													x: lastFrame.position.x + 100,
													y: lastFrame.position.y + 100
												}
											});
										} else {
											globals.options.frames.push({
												size: {
													width: 100,
													height: 100
												},
												position: {
													x: 0,
													y: 0
												}
											});
										}
									};
								} else if (value < this.state.frameCount) {
									const decrease = this.state.frameCount - value;
									for (let i = 0; i < decrease; i++) {
										globals.options.frames.pop();
									};
								};
								this.setState({
									frameCount: value,
									frames: globals.options.frames
								});
								console.log(globals.options.frames);
							}}
							min={0}
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
										<p>Size</p>
									</Col>
									<Col span={8}>
										<InputNumber
											style={{ width: '100%' }}
											defaultValue={frame.size.width}
											onChange={(value) => {
												globals.options.frames[index].size.width = value;
												this.setState({
													frames: globals.options.frames
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
												globals.options.frames[index].size.height = value;
												this.setState({
													frames: globals.options.frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='Height'
										/>
									</Col>
								</Row>

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
												globals.options.frames[index].position.x = value;
												this.setState({
													frames: globals.options.frames
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
												globals.options.frames[index].position.y = value;
												this.setState({
													frames: globals.options.frames
												});
											}}
											min={0} max={10000} step={1}
											placeholder='Y'
										/>
									</Col>
								</Row>
							</div>
						</div>
					);
				})}
			</div>
		);
	};
};