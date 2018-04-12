'use strict';

const util = require('homey-meshdriver/lib/util');

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class DimmableDevice extends ZigBeeLightDevice {

	onFlowActionSetDimWithCustomTransitionTime(dimtype, dimwaarde, transitietijd) {
		dimtype = parseInt(dimtype, 10);

		this.log('type_to_dim', dimtype);
		this.log('dim_value', dimwaarde);
		this.log('transition_value', transitietijd);

		// Clear already running intervals
		if (this.getCurrentDimValueTimeout) clearTimeout(this.getCurrentDimValueTimeout);
		if (this.getCurrentDimValue) clearInterval(this.getCurrentDimValue);

		// Dim moveToLevel
		if (dimtype === 0) {
			this.log('type_to_dim is moveToLevel');
			if (dimwaarde > 0) {

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
				this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: Math.round(dimwaarde * 254), transtime: transitietijd * 10 })
					.then(result => {
						this.log('moveToLevel: ', result);
					})
					.catch(err => {
						this.log('could not send moveToLevel');
						this.log(err);
					});
			}

			if (this.getCapabilityValue('onoff') && dimwaarde === 0) {
				this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevelWithOnOff', { level: dimwaarde, transtime: transitietijd * 10 })
					.then(result => {
						this.log('moveToLevelWithOnOff: ', result);
					})
					.catch(err => {
						this.log('could not send moveToLevelWithOnOff');
						this.log(err);
					});
			}

			// repeat with the interval of 30 seconds
			this.getCurrentDimValue = setInterval(() => {
				this.node.endpoints[0].clusters.genLevelCtrl.read('currentLevel')
					.then(currentDimValue => {
						this.log('currentLevel: ', currentDimValue);
						this.parsedcurrentDimvalue = Math.round((currentDimValue / 254) * 100) / 100;
						this.log('currentdimvalue: ', this.parsedcurrentDimvalue);
						this.setCapabilityValue('dim', this.parsedcurrentDimvalue);
						if (this.parsedcurrentDimvalue === 0) this.setCapabilityValue('onoff', false);
					})
					.catch(err => {
						this.log('could not read currentLevel');
						this.log(err);
					});
			}, 30000);

			// after transitietijd seconds stop
			this.getCurrentDimValueTimeout = setTimeout(() => {
				clearInterval(this.getCurrentDimValue);
			}, (transitietijd + 30) * 1000);
		}

		// Dim toSaturation
		if (dimtype === 1) {
			this.log('type_to_dim is Saturation');
			this.node.endpoints[0].clusters.lightingColorCtrl.do('moveToSaturation', { saturation: Math.round(dimwaarde * 254), transtime: transitietijd * 10 })
				.then(result => {
					this.log('moveToSaturation: ', result);
					this.setCapabilityValue('light_saturation', dimwaarde);
				})
				.catch(err => {
					this.log('could not send moveToSaturation');
					this.log(err);
				});
		}

		// Dim ToColorTemp
		if (dimtype === 2) {
			this.log('type_to_dim is Temperatur');
			this.colortemp = Math.round(util.mapValueRange(0, 1, this._colorTempMin, this._colorTempMax, dimwaarde));
			this.log('colortemp: ', this.colortemp);
			this.node.endpoints[0].clusters.lightingColorCtrl.do('moveToColorTemp', { colortemp: this.colortemp, transtime: transitietijd * 10 })
				.then(result => {
					this.log('moveToColorTemp: ', result);
					this.setCapabilityValue('light_temperature', dimwaarde);
				})
				.catch(err => {
					this.log('could not send moveToColorTemp');
					this.log(err);
				});
		}

		return true;
	}

}

module.exports = DimmableDevice;
