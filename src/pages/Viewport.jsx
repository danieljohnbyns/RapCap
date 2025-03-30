import React from 'react';
import { createSwapy } from 'swapy';

import {
	CameraOutlined,
	DownOutlined,
	ExportOutlined,
	DeleteOutlined,
	WarningOutlined
} from '@ant-design/icons';
import {
	Button,
	Select,
	Slider,
	Switch,
	Popover,
	Row, Col,
} from 'antd';

import '../styles/pages/viewport.css';

import Panel from '../components/Panel.jsx';

import Camera from '../components/panels/Camera.jsx';

export default class Viewport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			/** @type {import('swapy').Swapy} */
			swapy: null,
			/** @type {HTMLElement} */
			container: null
		};
	};

	componentDidMount() {
		if (this.state.container) {
			this.state.swapy = createSwapy(this.state.container, {
				animation: 'dynamic'
			});

			this.state.swapy.onSwap((event) => {
				console.log(event);
			});
			this.state.swapy.onBeforeSwap((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};

				const destinationElement = document.getElementById(event.toSlot);
				destinationElement.classList.add('swapy-destination');

				return true;
			});
			this.state.swapy.onSwapEnd((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};
			});
		};
	};
	componentWillUnmount() {
		this.state.swapy?.destroy();
	};

	slots = 'abcdefghijklmnopqrstuvwxyz'.split('');
	currentSlot = 0;
	getSlot = () => {
		const currentSlot = this.slots[this.currentSlot];
		this.currentSlot = (this.currentSlot + 1) % this.slots.length;
		return currentSlot;
	};

	render() {
		return (
			<>
				<main
					id='viewport'
					className='noselect'
					ref={(el) => { this.state.container = el; }}
				>
					<Panel
						slot={this.getSlot()}
						item='Camera'
						id='camera'
					>
						<div id='cameraContainer'>
							<Camera />
						</div>

						<div id='cameraControls'>
							<Button
								type='primary'
								icon={<CameraOutlined />}
								onClick={() => { }}
							>
								Shoot
							</Button>
							<Select
								id='shutterSpeed'
								defaultValue='0'
								placeholder='Shutter Speed'
								options={[
									{
										value: '0',
										label: 'Instant'
									},
									{
										value: '3',
										label: '3 Seconds'
									},
									{
										value: '5',
										label: '5 Seconds'
									}
								]}
								variant='outlined'
								suffixIcon={<DownOutlined />}
							/>
						</div>
					</Panel>



					<Panel
						slot={this.getSlot()}
						item='Preview'
						id='preview'
					>
						<div id='previewContainer'>
							<canvas id='previewCanvas' />
						</div>

						<div id='previewControls'>
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
					</Panel>

					<Panel
						slot={this.getSlot()}
						item='Camera Options'
						id='camera-options'
					>
						<div id='cameraOptionsContainer'>
							<Row
								style={{ alignItems: 'center', }}
							>
								<Col span={6}>
									<p>Device</p>
								</Col>
								<Col span={18}>
									<Select
										id='cameraOptions'
										defaultValue='webcam'
										placeholder='Camera Options'
										style={{ width: '100%' }}
										options={[
											{
												value: 'webcam',
												label: 'Webcam'
											},
											{
												value: 'usb',
												label: 'USB Camera'
											}
										]}
										variant='outlined'
										suffixIcon={<DownOutlined />}
									/>
								</Col>
							</Row>

							<Row
								style={{ alignItems: 'center', }}
							>
								<Col span={6}>
									<p>Brightness</p>
								</Col>
								<Col span={1} />
								<Col span={16}>
									<Slider
										id='brightness'
										defaultValue={0}
										min={-100}
										max={100}
										step={1}
										marks={{
											'-100': '-100',
											'0': '0',
											'100': '100'
										}}
									/>
								</Col>
								<Col span={1} />
							</Row>

							<Row
								style={{ alignItems: 'center', }}
							>
								<Col span={6}>
									<p>Contrast</p>
								</Col>
								<Col span={1} />
								<Col span={16}>
									<Slider
										id='contrast'
										defaultValue={0}
										min={-100}
										max={100}
										step={1}
										marks={{
											'-100': '-100',
											'0': '0',
											'100': '100'
										}}
									/>
								</Col>
								<Col span={1} />
							</Row>

							<Row
								style={{ alignItems: 'center', }}
							>
								<Col span={6}>
									<Popover
										trigger={['hover']}

										content={
											<div>
												<h6><WarningOutlined /> Warning!</h6>
												<br />
												<p>Detect Faces is still experimental and may not work as expected.</p>
											</div>
										}

										showArrow={false}
										arrow={false}
									>
										<p><WarningOutlined /> Detect Faces</p>
									</Popover>
								</Col>
								<Col span={18}>
									<Switch
										id='detectFaces'
										defaultChecked={false}
										onChange={(checked) => { }}
									/>
								</Col>
							</Row>

							<Row
								style={{ alignItems: 'center', }}
							>
								<Col span={6}>
									<p>Live Preview</p>
								</Col>
								<Col span={18}>
									<Switch
										id='livePreview'
										defaultChecked={true}
										onChange={(checked) => { }}
									/>
								</Col>
							</Row>
						</div>
					</Panel>

					<Panel
						slot={this.getSlot()}
						item='Frames'
						id='frames'
					>D</Panel>

					<Panel
						slot={this.getSlot()}
						item='Output'
						id='output'
					>E</Panel>
				</main>
			</>
		);
	};
};