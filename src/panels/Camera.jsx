import React from 'react';

import {
	Form,
	Button,
	Typography,
	Select,
	Image
} from 'antd';

import {
	CameraOutlined,
	ClockCircleOutlined
} from '@ant-design/icons';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const Camera = () => {
	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};
	return (
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
	);
};

export default Camera;