import React from 'react';

import {
	Button,
	Image
} from 'antd';

import {
	ExpandAltOutlined,
	ClearOutlined
} from '@ant-design/icons';

import globals from '../utils/globals.js';

import Panel from '../components/Panel.jsx';

const Preview = () => {
	const options = globals.options;

	return (
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
	);
};

export default Preview;