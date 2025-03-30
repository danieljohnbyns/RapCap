import React from 'react';


import {
	DownOutlined,
} from '@ant-design/icons';
import {
	Select,
	Row, Col,
} from 'antd';

import globals from '../../utils/globals.js';

export default class Preview extends React.Component {
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
			</div>
		);
	};
};