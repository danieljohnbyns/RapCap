import React from 'react';


import {
	DownOutlined,
	WarningOutlined
} from '@ant-design/icons';
import {
	Select,
	Slider,
	Switch,
	Popover,
	Row, Col,
} from 'antd';

import globals from '../../utils/globals.js';

export default class Preview extends React.Component {
	constructor(props) {
		super(props);
		this.state = {
			devices: [],
			selectedDeviceId: null
		};
	};

	async componentDidMount() {
		const mediaDevices = await globals.getMediaDevices();
		const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
		this.setState({
			devices: videoDevices,
			selectedDeviceId: videoDevices.length > 0 ? videoDevices[0].deviceId : null
		});
		await globals.changeCamera(videoDevices[0]?.deviceId);

		// Listen for media device changes
		navigator.mediaDevices.ondevicechange = this.handleDeviceChange;
	};

	componentWillUnmount() {
		// Clean up the event listener
		navigator.mediaDevices.ondevicechange = null;
	};

	handleDeviceChange = async () => {
		const mediaDevices = await globals.getMediaDevices();
		const videoDevices = mediaDevices.filter(device => device.kind === 'videoinput');
		this.setState({
			devices: videoDevices,
			selectedDeviceId: videoDevices.length > 0 ? videoDevices[0].deviceId : null
		});
		if (videoDevices.length > 0) {
			await globals.changeCamera(videoDevices[0].deviceId);
		};
	};

	render() {
		return (
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
							value={this.state.selectedDeviceId}
							placeholder='Camera Options'
							style={{ width: '100%' }}
							options={this.state.devices.map(device => ({
								value: device.deviceId,
								label: device.label || 'Unknown Device'
							}))}
							onChange={(value) => {
								this.setState({ selectedDeviceId: value });
								globals.changeCamera(value);
							}}
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
							defaultValue={globals.options.brightness}
							min={0}
							max={500}
							step={5}
							included={false}
							marks={{
								'0': '0',
								'100': '100',
								'500': '500'
							}}
							onChange={(value) => {
								globals.options.brightness = value;
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
							defaultValue={globals.options.contrast}
							min={0}
							max={500}
							step={5}
							included={false}
							marks={{
								'0': '0',
								'100': '100',
								'500': '500'
							}}
							onChange={(value) => {
								globals.options.contrast = value;
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
		);
	};
};