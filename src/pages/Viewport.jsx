import React from 'react';

import {
	Flex,
	Card,
	Slider,
	Switch,
	Select,
	Form,
	Button,
	Typography,
	Divider,
	InputNumber,
	Image
} from 'antd';

import {
	CameraOutlined,
	ClockCircleOutlined,
	ExpandAltOutlined,
	ClearOutlined,
	PlusOutlined,
	MinusOutlined,
	UpOutlined,
	DownOutlined
} from '@ant-design/icons';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

const { Title, Text } = Typography;

import Panel from '../components/Panel.jsx';

const Viewport = () => {
	const options = globals.options;
	const [faceDetectionEnabled, setFaceDetectionEnabled] = React.useState(options.faceDetection);
	const [frameSettings, setFrameSettings] = React.useState(options.frames);

	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	return (
		<Card id='viewport-card' size='small'>
			<Panel
				title='Camera'
				actions={(
					<>
						<Button
							type='primary'
							icon={<CameraOutlined />}
							style={{ width: '100%' }}
							onClick={() => {
								alert('Camera button clicked!');
							}}
						>
							Shoot
						</Button>
						<Form
							layout='vertical'
							initialValues={{
								countdown: options.countdown
							}}
						>
							<Form.Item
								name='countdown'
								style={{ marginBottom: 0 }}
							>
								<Select
									prefix={<ClockCircleOutlined />}
									options={[
										{ value: 0, label: 'Instant' },
										{ value: 1, label: '1 Second' },
										{ value: 2, label: '2 Seconds' },
										{ value: 3, label: '3 Seconds' }
									]}

									onChange={(value) => {
										setOptions({
											countdown: value
										});
									}}
								/>
							</Form.Item>
						</Form>
					</>
				)}
			>
				<Image
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					src='https://picsum.photos/800/600'
					alt='Camera View'
					fallback='https://picsum.photos/800/600?grayscale'
					preview={false}
				/>
			</Panel>

			<Panel
				title='Preview'
				actions={(
					<>
						<Button
							type='primary'
							icon={<ExpandAltOutlined />}
							style={{ width: '100%' }}
							onClick={() => {
								alert('Expand button clicked!');
							}}
						>
							Expand
						</Button>
						<Button
							type='primary'
							danger
							icon={<ClearOutlined />}
							onClick={() => {
								alert('Clear button clicked!');
							}}
						>
							Clear
						</Button>
					</>
				)}
			>
				<Image
					style={{ width: '100%', height: '100%', objectFit: 'cover' }}
					src='https://picsum.photos/800/600'
					alt='Preview View'
					fallback='https://picsum.photos/800/600?grayscale'
					preview={false}
				/>
			</Panel>

			<Panel
				title='Camera Settings'
			>
				<Form
					layout='vertical'
					initialValues={{
						mediaDevice: options.mediaDevice,
						brightness: options.brightness,
						contrast: options.contrast,
						faceDetection: options.faceDetection
					}}
				>
					<Form.Item
						label='Media Device'
						name='mediaDevice'
					>
						<Select>
							{options.mediaDevices.map((device) => (
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

			<Panel
				title='Template Frames'
			>
				<Form
					layout='vertical'
					initialValues={{
						frameCount: frameSettings.length
					}}
				>
					<Flex vertical gap={8} justify='flex-start' align='stretch'>
						<Form.List
							name='frames'
							initialValue={frameSettings.map(frame => ({
								size: frame.size,
								position: frame.position
							}))}
						>
							{(fields, { add, remove, move }) => (
								<Flex vertical gap={16} justify='flex-start' align='stretch'>
									{fields.map((field, index) => (
										<Card key={field.key} title={`Frame ${index + 1}`} size='small'>
											<Flex vertical gap={8} justify='flex-start' align='stretch'>
												<Flex justify='space-between' align='center'>
													<Text type='secondary'>Position:</Text>
													<Flex gap={8}>
														<Form.Item
															name={[field.name, 'position', 'x']}
															style={{ marginBottom: 0 }}
														>
															<InputNumber
																style={{ width: 80 }}
																min={0}
																onChange={(value) => {
																	const newFrames = [...frameSettings];
																	newFrames[index].position.x = value;
																	setFrameSettings(newFrames);
																	setOptions({ frames: newFrames });
																}}
																prefix='x:'
															/>
														</Form.Item>
														<Form.Item
															name={[field.name, 'position', 'y']}
															style={{ marginBottom: 0 }}
														>
															<InputNumber
																style={{ width: 80 }}
																min={0}
																onChange={(value) => {
																	const newFrames = [...frameSettings];
																	newFrames[index].position.y = value;
																	setFrameSettings(newFrames);
																	setOptions({ frames: newFrames });
																}}
																prefix='y:'
															/>
														</Form.Item>
													</Flex>
												</Flex>
												<Flex justify='space-between' align='center'>
													<Text type='secondary'>Size:</Text>
													<Flex gap={8}>
														<Form.Item
															name={[field.name, 'size', 'width']}
															style={{ marginBottom: 0 }}
														>
															<InputNumber
																style={{ width: 80 }}
																min={100}
																onChange={(value) => {
																	const newFrames = [...frameSettings];
																	newFrames[index].size.width = value;
																	setFrameSettings(newFrames);
																	setOptions({ frames: newFrames });
																}}
																prefix='w:'
															/>
														</Form.Item>
														<Form.Item
															name={[field.name, 'size', 'height']}
															style={{ marginBottom: 0 }}
														>
															<InputNumber
																style={{ width: 80 }}
																min={100}
																onChange={(value) => {
																	const newFrames = [...frameSettings];
																	newFrames[index].size.height = value;
																	setFrameSettings(newFrames);
																	setOptions({ frames: newFrames });
																}}
																prefix='h:'
															/>
														</Form.Item>
													</Flex>
												</Flex>
												<Flex justify='flex-end' align='center' gap={2}>
													<Button
														type='text'
														size='small'
														danger
														icon={<PlusOutlined />}
														onClick={() => {
															const thisFrame = frameSettings[index];
															const newFrame = {
																size: { ...thisFrame.size },
																position: { x: thisFrame.position.x, y: thisFrame.position.y + 20 },
																buffer: null
															};
															const newFrames = [...frameSettings];
															newFrames.splice(index + 1, 0, newFrame);
															setFrameSettings(newFrames);
															setOptions({ frames: newFrames });
															add(newFrame, index + 1);
														}}
													/>
													<Button
														type='text'
														size='small'
														danger
														icon={<MinusOutlined />}
														onClick={() => {
															const newFrames = [...frameSettings];
															if (newFrames.length > 1) {
																newFrames.splice(index, 1);
																setFrameSettings(newFrames);
																setOptions({ frames: newFrames });
																remove(field.name);
															};
														}}
													/>
													<Button
														type='text'
														size='small'
														icon={<UpOutlined />}
														onClick={() => {
															if (index > 0) {
																const newFrames = [...frameSettings];
																const [movedFrame] = newFrames.splice(index, 1);
																newFrames.splice(index - 1, 0, movedFrame);
																setFrameSettings(newFrames);
																setOptions({ frames: newFrames });
																move(field.name, index - 1);
															};
														}}
													/>
													<Button
														type='text'
														size='small'
														icon={<DownOutlined />}
														onClick={() => {
															if (index < fields.length - 1) {
																const newFrames = [...frameSettings];
																const [movedFrame] = newFrames.splice(index, 1);
																newFrames.splice(index + 1, 0, movedFrame);
																setFrameSettings(newFrames);
																setOptions({ frames: newFrames });
																move(field.name, index + 1);
															};
														}}
													/>
												</Flex>
											</Flex>
										</Card>
									))}
								</Flex>
							)}
						</Form.List>
					</Flex>
				</Form>
			</Panel>

			<Panel
				title='Output'
			>
				<Flex vertical gap={16} justify='flex-start' align='stretch'>
					<Button
						type='primary'
						onClick={() => {
							// Handle output generation
						}}
					>
						Export
					</Button>
					<Divider />
					<Form
						layout='horizontal'
						initialValues={{
							outputFormat: options.output.format,
							outputScale: options.output.scale
						}}
					>
						<Flex
							gap={8}
							justify='space-between'
						>
							<Form.Item
								name='outputFormat'
								style={{ width: '100%', marginBottom: 0 }}
							>
								<Select>
									<Select.Option value='png'>PNG</Select.Option>
									<Select.Option value='jpeg'>JPEG</Select.Option>
									<Select.Option value='webp'>WEBP</Select.Option>
								</Select>
							</Form.Item>
							<Form.Item
								name='outputScale'
								style={{ width: '100%', marginBottom: 0 }}
							>
								<Select>
									<Select.Option value={1}>1x</Select.Option>
									<Select.Option value={2}>2x</Select.Option>
									<Select.Option value={3}>3x</Select.Option>
								</Select>
							</Form.Item>
						</Flex>
					</Form>
				</Flex>
			</Panel>
		</Card>
	);
};

export default Viewport;