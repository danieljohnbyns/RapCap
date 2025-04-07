import React from 'react';


import {
	DownOutlined
} from '@ant-design/icons';
import {
	Select,
	Row, Col,
} from 'antd';

import globals from '../../utils/globals.js';

export default class cameraOptions extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			mediaDevice: globals.options.mediaDevice,
			mediaDevices: globals.options.mediaDevices,
		};
	};

	async componentDidMount() {
		this.setState({
			mediaDevice: globals.options.mediaDevice,
			mediaDevices: globals.options.mediaDevices
		});

		window.addEventListener('optionsUpdated', (event) => {
			setTimeout(() => {
				this.setState({
					mediaDevice: globals.options.mediaDevice,
					mediaDevices: globals.options.mediaDevices
				});
			}, 100);
		});
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
							defaultValue={globals.options.mediaDevice}
							value={this.state.mediaDevice}
							placeholder='Camera Options'
							style={{ width: '100%' }}
							options={this.state.mediaDevices?.map((device) => {
								return {
									value: device.deviceId,
									label: device.label,
									key: device.deviceId
								};
							})}
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
							onChange={(value) => {
								globals.options.mediaDevice = this.state.mediaDevices.find((device) => device.deviceId === value);
								this.setState({
									mediaDevice: globals.options.mediaDevice
								});
								globals.setOptions({
									mediaDevice: this.state.mediaDevices.find((device) => device.deviceId === value)
								});
							}}
							suffixIcon={<DownOutlined />}
						/>
					</Col>
				</Row>

				{/* <Row
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
							value={globals.options.brightness}
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
							value={globals.options.contrast}
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
				</Row> */}
			</div>
		);
	};
};