'use strict';

const util = require('/node_modules/homey-meshdriver/lib/util');

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class RGBWStrip extends ZigBeeLightDevice {

	onFlowActionSetDimWithCustomTransitionTime(dimtype, dimwaarde, transitietijd) {
		this.log('type_to_dim', parseInt(dimtype, 0));
		this.log('dim_value', dimwaarde);
		this.log('transition_value', transitietijd);

		// Dim moveToLevel
		if (parseInt(dimtype, 0) === 0) {
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

				if (this.getCapabilityValue('onoff') === false) {
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
				this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: dimwaarde * 254, transtime: transitietijd * 10 })
					.then(result => {
						this.log('moveToLevel: ', result);
					})
					.catch(err => {
						this.log('could not send moveToLevel');
						this.log(err);
					});
			}

			if (this.getCapabilityValue('onoff') === true && dimwaarde === 0) {
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
					})
					.catch(err => {
						this.log('could not read currentLevel');
						this.log(err);
					});
			}, 30000);

			// after transitietijd seconds stop
			setTimeout(() => {
				clearInterval(this.getCurrentDimValue);
				if (this.parsedcurrentDimvalue === 0) this.setCapabilityValue('onoff', false);
			}, (transitietijd + 30) * 1000);
		}

		// Dim toSaturation
		if (parseInt(dimtype, 0) === 1) {
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
		if (parseInt(dimtype, 0) === 2) {
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

module.exports = RGBWStrip;

// [rgbw_strip] [0] ZigBeeDevice has been inited
// [rgbw_strip] [0] ------------------------------------------
// [rgbw_strip] [0] Node: e06c1afc-e1cd-49fc-b4de-9a33cbd0a5ff
// [rgbw_strip] [0] - Battery: false
// [rgbw_strip] [0] - Endpoints: 0
// [rgbw_strip] [0] -- Clusters:
// [rgbw_strip] [0] --- zapp
// [rgbw_strip] [0] --- genBasic
// [rgbw_strip] [0] ---- cid : genBasic
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] --- genIdentify
// [rgbw_strip] [0] ---- cid : genIdentify
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] --- genGroups
// [rgbw_strip] [0] ---- cid : genGroups
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] --- genScenes
// [rgbw_strip] [0] ---- cid : genScenes
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] --- genOnOff
// [rgbw_strip] [0] ---- cid : genOnOff
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] ---- onOff : 1
// [rgbw_strip] [0] --- genLevelCtrl
// [rgbw_strip] [0] ---- cid : genLevelCtrl
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] ---- currentLevel : 254
// [rgbw_strip] [0] --- genOta
// [rgbw_strip] [0] ---- cid : genOta
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] --- lightingColorCtrl
// [rgbw_strip] [0] ---- cid : lightingColorCtrl
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] ---- colorTempPhysicalMin : 100
// [rgbw_strip] [0] ---- colorTempPhysicalMax : 1000
// [rgbw_strip] [0] ---- currentHue : 0
// [rgbw_strip] [0] ---- currentSaturation : 0
// [rgbw_strip] [0] ---- colorTemperature : 370
// [rgbw_strip] [0] ---- colorMode : 1
// [rgbw_strip] [0] - Endpoints: 1
// [rgbw_strip] [0] -- Clusters:
// [rgbw_strip] [0] --- zapp
// [rgbw_strip] [0] --- lightLink
// [rgbw_strip] [0] ---- cid : lightLink
// [rgbw_strip] [0] ---- sid : attrs
// [rgbw_strip] [0] ------------------------------------------
