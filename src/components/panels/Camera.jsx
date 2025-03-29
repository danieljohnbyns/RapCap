import React from 'react';

export default class Camera extends React.Component {
	constructor(props) {
		super(props);
		this.videoRef = React.createRef();
		this.canvasRef = React.createRef();
	}

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
	}

	updateCanvas = () => {
		const canvas = this.canvasRef.current;
		const ctx = canvas.getContext('2d');
		const video = this.videoRef.current;

		// Draw the video feed onto the canvas
		const draw = () => {
			if (video.readyState === video.HAVE_ENOUGH_DATA) {
				canvas.width = video.videoWidth;
				canvas.height = video.videoHeight;
				ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
			}
			requestAnimationFrame(draw);
		};
		draw();
	};

	render() {
		return (
			<>
				<video
					ref={this.videoRef}
					style={{ display: 'none' }} // Hide the video element
				></video>
				<canvas ref={this.canvasRef}></canvas>
			</>
		);
	}
}