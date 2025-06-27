import React from 'react';

import {
	Flex,
	Card,
	Form,
	Button,
	Typography,
	InputNumber
} from 'antd';

import {
	PlusOutlined,
	MinusOutlined,
	UpOutlined,
	DownOutlined
} from '@ant-design/icons';

import globals from '../utils/globals.js';

const { Text } = Typography;

import Panel from '../components/Panel.jsx';

const TemplateFrames = () => {
	const options = globals.options;
	const [frameSettings, setFrameSettings] = React.useState(options.frames);

	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	return (
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
	);
};

export default TemplateFrames;