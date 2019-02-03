import React, { Component } from 'react';
import Slider from 'rc-slider';

export default class LightToggle extends Component {
	constructor(props) {
		super(props);

		this.state = { ...props };
	}

	updateValue(value) {
		this.setState({ light: { ...this.state.light, value } });
	}

	updateLightStatus(value) {
		this.props['update-lights'](this.state.light.name, value);
	}

	render() {
		return (
			<div className="color">
				<span className="name">
					{this.state.light.name}
				</span>
				<div>
					<Slider className="slider" step={1} max={255} value={parseInt(this.state.light.value)}
						onAfterChange={this.updateLightStatus.bind(this)} onChange={this.updateValue.bind(this)} />
				</div>
				<span className="color-value">
					{this.state.light.value}
				</span>
			</div>
		)
	}
}
