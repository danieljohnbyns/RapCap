import React from 'react';
import { createSwapy } from 'swapy';

import {
	Card
} from 'antd';

import '../styles/pages/viewport.css';

import globals from '../utils/globals.js';

import Camera from '../panels/Camera.jsx';
import Preview from '../panels/Preview.jsx';
import CameraSettings from '../panels/CameraSettings.jsx';
import TemplateFrames from '../panels/TemplateFrames.jsx';
import Output from '../panels/Output.jsx';

const Viewport = () => {
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

	const options = globals.options;
	const setOptions = (newOptions) => {
		globals.setOptions(newOptions);
		globals.saveOptions();
	};

	const [mediaDevice, setMediaDevice] = React.useState(options.mediaDevice || []);
	const [mediaDevices, setMediaDevices] = React.useState(options.mediaDevices || []);
	const [videoSettings, setVideoSettings] = React.useState({
		brightness: options.brightness || 100,
		contrast: options.contrast || 100
	});
	const [stream, setStream] = React.useState(null);

	// Media devices
	React.useEffect(() => {
		navigator.mediaDevices.enumerateDevices()
			.then((devices) => {
				const videoDevices = devices.filter(device => device.kind === 'videoinput');
				setMediaDevices(videoDevices);
				console.log('Available video devices:', videoDevices);

				if (videoDevices.length > 0 && !mediaDevice) {
					setMediaDevice(videoDevices[0]);
					setOptions({ mediaDevice: videoDevices[0] });
				};
			})
			.catch((error) => {
				console.error('Error accessing media devices:', error);
			});
	}, []);

	const [frameSettings, setFrameSettings] = React.useState(options.frames || [
		{
			size: {
				width: 360,
				height: 200
			},
			position: {
				x: 40,
				y: 60
			},
			buffer: null
		}
	]);
	const [resolution, setResolution] = React.useState();
	React.useEffect(() => {
		setResolution({
			width: frameSettings[0]?.size?.width || 640,
			height: frameSettings[0]?.size?.height || 480
		});
	}, [frameSettings]);

	// Image Template
	const [imageTemplate, setImageTemplate] = React.useState(options.imageTemplate || 'https://picsum.photos/800/600');

	return (
		<Card id='viewport-card' size='small' ref={container}>
			<Camera {...{
				mediaDevices, setMediaDevices, mediaDevice, setMediaDevice,
				resolution, setResolution,
				videoSettings, setVideoSettings,
				stream, setStream
			}} />

			<Preview {...{
				imageTemplate, setImageTemplate,
				frameSettings, setFrameSettings,
				stream, setStream
			}} />

			<CameraSettings {...{
				mediaDevices, setMediaDevices,
				mediaDevice, setMediaDevice,
				videoSettings, setVideoSettings
			}} />

			<TemplateFrames {...{ frameSettings, setFrameSettings }} />

			<Output />
		</Card>
	);
};

export default Viewport;