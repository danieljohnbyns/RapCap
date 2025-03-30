import React from 'react';

import {
	ExportOutlined,
	DeleteOutlined
} from '@ant-design/icons';

import {
	Button
} from 'antd';

export default class Preview extends React.Component {
	render() {
		return (
			<>
				<div id='previewContainer'>
					<div ref={this.parentRef} style={{ width: '100%', height: '100%' }}>
						<video
							ref={this.videoRef}
							style={{ display: 'none' }} // Hide the video element
						></video>
						<canvas
							ref={this.canvasRef}
							id='previewCanvas'
							style={{ display: 'block', margin: '0 auto' }}
						></canvas>
					</div>
				</div>

				<div id='cameraControls'>
					<Button
						type='primary'
						icon={<ExportOutlined />}
						onClick={() => { }}
					>
						Launch preview Window
					</Button>

					<Button
						type='primary'
						icon={<DeleteOutlined />}
						onClick={() => { }}
					>
						Clear frames
					</Button>
				</div>
			</>
		);
	};
};