import React from 'react';
import { createSwapy } from 'swapy';

import '../styles/pages/viewport.css';

import Panel from '../components/Panel.jsx';

import Camera from '../components/panels/Camera.jsx';
import Preview from '../components/panels/Preview.jsx';
import CameraOptions from '../components/panels/CameraOptions.jsx';

export default class Viewport extends React.Component {
	constructor(props) {
		super(props);

		this.state = {
			/** @type {import('swapy').Swapy} */
			swapy: null,
			/** @type {HTMLElement} */
			container: null
		};
	};

	componentDidMount() {
		if (this.state.container) {
			this.state.swapy = createSwapy(this.state.container, {
				animation: 'dynamic'
			});

			this.state.swapy.onSwap((event) => {
				console.log(event);
			});
			this.state.swapy.onBeforeSwap((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};

				const destinationElement = document.getElementById(event.toSlot);
				destinationElement.classList.add('swapy-destination');

				return true;
			});
			this.state.swapy.onSwapEnd((event) => {
				const toBeRemovedElement = Array.from(document.getElementsByClassName('swapy-destination'));
				for (const element of toBeRemovedElement) {
					element.classList.remove('swapy-destination');
				};
			});
		};
	};
	componentWillUnmount() {
		this.state.swapy?.destroy();
	};

	slots = 'abcdefghijklmnopqrstuvwxyz'.split('');
	currentSlot = 0;
	getSlot = () => {
		const currentSlot = this.slots[this.currentSlot];
		this.currentSlot = (this.currentSlot + 1) % this.slots.length;
		return currentSlot;
	};

	render() {
		return (
			<>
				<main
					id='viewport'
					className='noselect'
					ref={(el) => { this.state.container = el; }}
				>
					<Panel
						slot={this.getSlot()}
						item='Camera'
						id='camera'
					>
						<Camera />
					</Panel>



					<Panel
						slot={this.getSlot()}
						item='Preview'
						id='preview'
					>
						<Preview />
					</Panel>

					<Panel
						slot={this.getSlot()}
						item='Camera Options'
						id='camera-options'
					>
						<CameraOptions />
					</Panel>

					<Panel
						slot={this.getSlot()}
						item='Frames'
						id='frames'
					>D</Panel>

					<Panel
						slot={this.getSlot()}
						item='Output'
						id='output'
					>E</Panel>
				</main>
			</>
		);
	};
};