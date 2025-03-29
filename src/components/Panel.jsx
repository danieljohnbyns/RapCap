
import React from 'react';

import '../styles/components/panel.css';

export default class Panel extends React.Component {
	render() {
		return (
			<section
				id={this.props.slot}
				className={'panel ' + this.props.className}

				data-swapy-slot={this.props.slot}
			>
				<main
					className='container'
					data-swapy-item={this.props.item}
				>
					<header data-swapy-handle>
						<h6>
							{this.props.item}
						</h6>
					</header>

					<div className='content'>
						{this.props.children}
					</div>
				</main>
			</section>
		);
	};
};