import React from 'react';
import { createSwapy } from 'swapy';

import {
	Slider,
	Switch,
	Select,
	Form
} from 'antd';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const CameraSettings = ({
	mediaDevices, setMediaDevices,
	mediaDevice, setMediaDevice
}) => {
	const options = globals.options;
	const [faceDetectionEnabled, setFaceDetectionEnabled] = React.useState(options.faceDetection);

	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	return (
		<Panel
			title='Camera Settings'
		>
			<Form
				layout='vertical'
				initialValues={{
					mediaDevice: mediaDevice,
					brightness: options.brightness,
					contrast: options.contrast,
					faceDetection: options.faceDetection
				}}
			>
				<Form.Item
					label='Media Device'
					name='mediaDevice'
				>
					<Select
						value={mediaDevice}
						onChange={(value) => {
							setMediaDevice(value);
							setOptions({
								mediaDevice: value
							});
						}}
					>
						{mediaDevices?.map((device) => (
							<Select.Option key={device.deviceId} value={device.deviceId}>
								{device.label || `Device ${device.deviceId}`}
							</Select.Option>
						))}
					</Select>
				</Form.Item>

				<Form.Item
					label='Brightness'
					name='brightness'
				>
					<Slider
						min={0}
						max={200}
						step={1}
						marks={{
							'0': '0',
							'100': '100',
							'200': '200'
						}}
						value={options.brightness}
						onChange={(value) => {
							setOptions({
								brightness: value
							});
						}}
					/>
				</Form.Item>

				<Form.Item
					label='Contrast'
					name='contrast'
				>
					<Slider
						min={0}
						max={200}
						step={1}
						marks={{
							'0': '0',
							'100': '100',
							'200': '200'
						}}
						value={options.contrast}
						onChange={(value) => {
							setOptions({
								contrast: value
							});
						}}
					/>
				</Form.Item>

				<Form.Item
					label='Face Detection'
					name='faceDetection'
					valuePropName='checked'
					layout='horizontal'
				>
					<Switch
						onChange={(value) => {
							setOptions({
								faceDetection: value
							});
							setFaceDetectionEnabled(value);
						}}
						value={faceDetectionEnabled}
					/>
				</Form.Item>
			</Form>
		</Panel>
	);
};

export default CameraSettings;