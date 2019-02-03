import React, { Component } from 'react';
import LightToggle from './LightToggle';
import FanToggle from './FanToggle';

import Api from '../Api';

export default class MainPage extends Component {
	constructor(props) {
		super(props);

		this.state = {
			temp: '',
			hum: '',
			lights: [],
			isLoaded: false
		};
	}

	async componentWillMount() {
		const res = await Api.get('/lights');
		this.setState({ lights: res.data.lights });
		this.setState({ isLoaded: true });
	}

	componentDidMount() {
		this.startAutoUpdate();
	}

	async startAutoUpdate() {
		this.autoUpdateSensors = setInterval(async () => {
			const tasks = [
				Api.get('/sensors'),
				Api.get('/lights'),
			];

			const [{sensors}, {lights}] = await Promise.all(tasks)
				.then(res => res.map(x => x.data));

			this.setState({ temp: sensors[0].value });
			this.setState({ hum: sensors[1].value });
			this.setState({ lights })
		}, 5 * 1000);
	}

	updateLightStatus(color, value) {
		// Trouver l'index de la lumière updater
		const updatedLightIndex = this.state.lights.findIndex(l => l.name === color);

		// Copier l'état des lumières
		const lights = [...this.state.lights];

		// Updater l'état de la lumière modifiée
		lights[updatedLightIndex] = { ...lights[updatedLightIndex], value }

		this.setState({ lights });

		this.postLightUpdate();
	}

	postLightUpdate() {
		// Transformer lights en {couleur: valeur}
		const updatedLights = this.state.lights.reduce((lights, lightStatus) => {
			lights[lightStatus.name.toLowerCase()] = lightStatus.value;
			return lights;
		}, {});

		Api.post('/lights', updatedLights, { headers: { "Content-Type": "application/json" } });
	}

	render() {
		// Éléments visuels sans component:
		// - la température
		// - le pourcentage

		// Component global pour changer les couleurs
		//  Component pour changer la couleur blanche
		//  Component pour changer la couleur rouge
		//  Component pour changer la couleur bleue

		// Component global pour changer les fans
		//  Component pour changer la fan 1
		//  Component pour changer la fan 2
		const updateLight = this.updateLightStatus.bind(this);

		const lights = this.state.lights.map(light =>
			<LightToggle light={light} key={light.id} id={light.id} update-lights={updateLight} />);

		return (
			<div className="main-page">
				<div className="components">
					<div className="first-section">
						<p id="temperature">{this.state.temp}</p>
						{this.state.isLoaded &&
							<div className="colors">
								{lights}
							</div>
						}
					</div>
					<div className="second-section">
						<p id="percentage">{this.state.hum}</p>
						<div className="fans">
							<FanToggle name="Fan1" id={1} />
							<FanToggle name="Fan2" id={2} />
						</div>
					</div>
				</div>
			</div>
		);
	}
}
