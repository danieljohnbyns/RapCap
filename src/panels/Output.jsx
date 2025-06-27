import React from 'react';

import {
	Flex,
	Select,
	Form,
	Button,
	Divider
} from 'antd';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const Output = () => {
	const options = globals.options;

	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	return (
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
							<Select
								onChange={(value) => {
									setOptions({
										...options,
										output: {
											...options.output,
											format: value
										}
									});
								}}
							>
								<Select.Option value='png'>PNG</Select.Option>
								<Select.Option value='jpeg'>JPEG</Select.Option>
								<Select.Option value='webp'>WEBP</Select.Option>
							</Select>
						</Form.Item>
						<Form.Item
							name='outputScale'
							style={{ width: '100%', marginBottom: 0 }}
						>
							<Select
								onChange={(value) => {
									setOptions({
										...options,
										output: {
											...options.output,
											scale: value
										}
									});
								}}
							>
								<Select.Option value={1}>1x</Select.Option>
								<Select.Option value={2}>2x</Select.Option>
								<Select.Option value={3}>3x</Select.Option>
							</Select>
						</Form.Item>
					</Flex>
				</Form>
			</Flex>
		</Panel>
	);
};

export default Output;