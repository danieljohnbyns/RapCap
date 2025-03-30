import React from 'react';

export default class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.canvasRef = React.createRef();
		this.parentRef = React.createRef();
	};

	componentDidMount() {
		// Access the user's webcam
		// navigator.mediaDevices
		// 	.getUserMedia({ video: true })
		// 	.then((stream) => {
		// 		// Set the video source to the webcam stream
		// 		this.videoRef.current.srcObject = stream;
		// 		this.videoRef.current.onloadedmetadata = () => {
		// 			this.videoRef.current.play();
		// 			this.updateCanvas();
		// 		};
		// 	})
		// 	.catch((err) => {
		// 		console.error('Error accessing webcam:', err);
		// 	});
	};

	updateCanvas = () => {
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		const video = this.videoRef.current;
		const parent = this.parentRef.current;

		// Draw the video feed onto the canvas
		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				const parentWidth = parent.offsetWidth;
				const parentHeight = parent.offsetHeight;

				// Maintain aspect ratio
				const videoAspectRatio = video.videoWidth / video.videoHeight;
				let canvasWidth = parentWidth;
				let canvasHeight = parentWidth / videoAspectRatio;

				if (canvasHeight > parentHeight) {
					canvasHeight = parentHeight;
					canvasWidth = parentHeight * videoAspectRatio;
				};

				canvas.width = canvasWidth;
				canvas.height = canvasHeight;

				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			};
			requestAnimationFrame(draw);
		};
		draw();
	};

	render() {
		return (
			<div ref={this.parentRef} style={{ width: '100%', height: '100%' }}>
				<video
					ref={this.videoRef}
					style={{ display: 'none' }} // Hide the video element
				></video>
				<canvas
					ref={this.canvasRef}
					id='cameraCanvas'
					style={{ display: 'block', margin: '0 auto' }}
				></canvas>
			</div>
		);
	};
};