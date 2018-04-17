'use strict';

const maxDim = 254;

const util = require('homey-meshdriver/lib/util');

// const DimmableLightDevice = require('../../lib/DimmableLightDevice');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeLightDevice;

class FlowFix extends ZigBeeDevice {

	onMeshInit() {

		this.registerCapability('onoff', 'genOnOff', {
			set: 'moveToLevelWithOnOff',
			setParser(value) {
				if (value) {
					this.node.endpoints[0].clusters.genOnOff.do('on', {})
						.then(result => {
							this.log('on: ', result);
						})
						.catch(err => {
							this.log('could not set to on');
							this.log(err);
						});
				}
				if (!value) {
					this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevelWithOnOff', { level: 1, transtime: 2 })
						.then(result => {
							this.log('moveToLevelWithOnOff: ', result);
						})
						.catch(err => {
							this.log('could not send offWithEffect');
							this.log(err);
						});
				}
				return null;
			},
			get: 'onOff',
			reportParser(value) {
				return value === 1;
			},
			report: 'onOff',
			getOpts: {
				getOnStart: true,
			},
		});

		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', {
				set: 'moveToLevel',
				setParser(value, opts = {}) {
					if (typeof opts.duration === 'number') {
						this.log('dim over time: ', opts.duration);
						const dimtype = 0;
						const transitietijd = opts.duration / 1000;

						// Clear already running intervals
						if (this.getCurrentDimValueTimeout) clearTimeout(this.getCurrentDimValueTimeout);
						if (this.getCurrentDimValue) clearInterval(this.getCurrentDimValue);

						// Dim moveToLevel
						if (dimtype === 0) {
							this.log('type_to_dim is moveToLevel');
							if (value > 0) {

								this.node.endpoints[0].clusters.genLevelCtrl.read('currentLevel')
									.then(result => {
										this.log('currentLevel: ', result);
									})
									.catch(err => {
										this.log('could not read currentLevel');
										this.log(err);
									});

								this.node.endpoints[0].clusters.genOnOff.read('onOff')
									.then(result => {
										this.log('onOff: ', result);
									})
									.catch(err => {
										this.log('could not read onOff');
										this.log(err);
									});

								if (!this.getCapabilityValue('onoff')) {
									this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: 1, transtime: 1 })
										.then(result => {
											this.log('moveToLevel: ', result);
											this.setCapabilityValue('dim', 0.01);
										})
										.catch(err => {
											this.log('could not send moveToLevel');
											this.log(err);
										});
									this.node.endpoints[0].clusters.genOnOff.do('on', {})
										.then(result => {
											this.log('on: ', result);
											this.setCapabilityValue('onoff', true);
										})
										.catch(err => {
											this.log('could not set to on');
											this.log(err);
										});
								}
								this.log('Now starting move to level......');
								this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: Math.round(value * 254), transtime: transitietijd * 10 })
									.then(result => {
										this.log('moveToLevel: ', result);
									})
									.catch(err => {
										this.log('could not send moveToLevel');
										this.log(err);
									});
							}

							if (this.getCapabilityValue('onoff') && value === 0) {
								this.log('Now starting move to level......');
								this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevelWithOnOff', { level: value, transtime: transitietijd * 10 })
									.then(result => {
										this.log('moveToLevelWithOnOff: ', result);
									})
									.catch(err => {
										this.log('could not send moveToLevelWithOnOff');
										this.log(err);
									});
							}

						}

						// Dim toSaturation
						if ((dimtype === 1 && this.getCapabilityValue('onoff'))) {
							this.log('type_to_dim is Saturation');
							this.log('Now starting move to Saturation......');
							this.node.endpoints[0].clusters.lightingColorCtrl.do('moveToSaturation', { saturation: Math.round(value * 254), transtime: transitietijd * 10 })
								.then(result => {
									this.log('moveToSaturation: ', result);
								})
								.catch(err => {
									this.log('could not send moveToSaturation');
									this.log(err);
								});
						}

						// Dim ToColorTemp
						if ((dimtype === 2 && this.getCapabilityValue('onoff'))) {
							this.log('type_to_dim is Temperatur');
							this.log('Now starting move to Temperatur......');
							this.colortemp = Math.round(util.mapValueRange(0, 1, this._colorTempMin, this._colorTempMax, value));
							this.log('colortemp: ', this.colortemp);
							this.node.endpoints[0].clusters.lightingColorCtrl.do('moveToColorTemp', { colortemp: this.colortemp, transtime: transitietijd * 10 })
								.then(result => {
									this.log('moveToColorTemp: ', result);
									this.setCapabilityValue('light_temperature', value);
								})
								.catch(err => {
									this.log('could not send moveToColorTemp');
									this.log(err);
								});
						}

						// repeat with the interval of 30 seconds
						this.getCurrentDimValue = setInterval(() => {
							if (dimtype === 0) {
								this.log('Dimming Interval Running....');
								this.node.endpoints[0].clusters.genLevelCtrl.read('currentLevel')
									.then(currentDimValue => {
										this.log('currentLevel: ', currentDimValue);
										const parsedcurrentDimvalue = Math.round((currentDimValue / 254) * 100) / 100;
										this.log('currentdimvalue: ', parsedcurrentDimvalue);
										this.setCapabilityValue('dim', parsedcurrentDimvalue);
										if (parsedcurrentDimvalue === 0) this.setCapabilityValue('onoff', false);
									})
									.catch(err => {
										this.log('could not read currentLevel');
										this.log(err);
									});
							}

							if (dimtype === 1) {
								this.log('Saturation Interval Running....');
							}

							if (dimtype === 2) {
								this.log('Temperature Interval Running....');
							}

							// Stop if device is turned onOff
							if (!this.getCapabilityValue('onoff')) {
								clearTimeout(this.getCurrentDimValueTimeout);
								clearInterval(this.getCurrentDimValue);
								this.log('Device is not turned on, Interval stopped!');
							}
						}, 30000);

						// after transitietijd seconds stop
						this.getCurrentDimValueTimeout = setTimeout(() => {
							clearInterval(this.getCurrentDimValue);
							this.log('Interval stopped!');
						}, (transitietijd + 30) * 1000);

						return null;
					}
					if (typeof opts.duration !== 'number') {
						this.log('opts not defined');
						if (value === 0) {
							return this.triggerCapabilityListener('onoff', false)
								.then(() => null)
								.catch(err => new Error('failed_to_trigger_onoff'));
						} else if (this.getCapabilityValue('onoff') === false && value > 0) {
							return this.triggerCapabilityListener('onoff', true)
								.then(() => ({
									level: Math.round(value * maxDim),
									transtime: this.getSetting('transition_time') ? Math.round(this.getSetting('transition_time') * 10) : 0,
								}))
								.catch(err => new Error('failed_to_trigger_onoff`', err));
						}
						return {
							level: Math.round(value * maxDim),
							transtime: this.getSetting('transition_time') ? Math.round(this.getSetting('transition_time') * 10) : 0,
						};
					}
				},
				get: 'currentLevel',
				reportParser(value) {
					return value / maxDim;
				},
				report: 'currentLevel',
				getOpts: {
					getOnStart: true,
				},
			});
		}

	}

}

module.exports = FlowFix;
