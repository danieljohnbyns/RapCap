import React from 'react';

import {
	Card,
	Flex,
	Space,
	Row,
	Col,
	Input,
	Select,
	Form,
	Button,
	Typography,
	Divider,
	Image
} from 'antd';

const { Title, Text } = Typography;

import '../styles/components/panel.css';

const Panel = ({
	title = 'Panel',
	children,
	actions,
	slot
}) => {
	return (
		<Flex
			id={slot}
			vertical
			className='panel'

			data-swapy-slot={slot}
		>
			<Card
				size='small'
				className='panel-header'
			>
				{title && (
					<Title level={5} style={{ textAlign: 'center' }}>{title}</Title>
				)}
			</Card>

			<Card size='small' className='panel-body scrollable-content'>
				<Flex vertical justify='flex-start' align='stretch' gap={8} style={{ height: '100%' }}>
					{children}
				</Flex>
			</Card>

			{actions &&
				<Card
					size='small'
					className='panel-footer'
				>
					<Flex gap={8} justify='space-between' align='center'>
						{actions}
					</Flex>
				</Card>
			}
		</Flex>
	);
};

export default Panel;