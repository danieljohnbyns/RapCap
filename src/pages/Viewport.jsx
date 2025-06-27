import React from 'react';
import { createSwapy } from 'swapy';

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
} from 'antd';

import {
	PlusOutlined,
	MinusOutlined,
	UpOutlined,
	DownOutlined
} from '@ant-design/icons';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

const { Title, Text } = Typography;

import Panel from '../components/Panel.jsx';
import Camera from '../panels/Camera.jsx';
import Preview from '../panels/Preview.jsx';
import CameraSettings from '../panels/CameraSettings.jsx';
import TemplateFrames from '../panels/TemplateFrames.jsx';
import Output from '../panels/Output.jsx';

const Viewport = () => {
	const options = globals.options;
	const [faceDetectionEnabled, setFaceDetectionEnabled] = React.useState(options.faceDetection);
	const [frameSettings, setFrameSettings] = React.useState(options.frames);

	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	const container = React.useRef(null);
	const [swapy, setSwapy] = React.useState(null);

	React.useEffect(() => {
		if (container.current) {
			const newSwapy = createSwapy(container.current.querySelector('.ant-card-body'), {
				animation: 'dynamic'
			});
			setSwapy(newSwapy);
		}
	}, [container]);

	React.useEffect(() => {
		if (swapy) {
			swapy.onSwap((event) => {
				window.dispatchEvent(new CustomEvent('swapy-swap', {
					detail: {
						fromSlot: event.fromSlot,
						toSlot: event.toSlot
					}
				}));
			});
			swapy.onBeforeSwap((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};

				const destinationElement = document.getElementById(event.toSlot);
				destinationElement.classList.add('swapy-destination');

				return true;
			});
			swapy.onSwapEnd((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};
			});
		};
	}, [swapy]);

	return (
		<Card id='viewport-card' size='small' ref={container}>
			<Camera />

			<Preview />

			<CameraSettings />

			<TemplateFrames />

			<Output />
		</Card>
	);
};

export default Viewport;