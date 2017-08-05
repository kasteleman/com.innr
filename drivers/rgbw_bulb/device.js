'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

const maxBrightness = 255;
const maxHue = 255;
const maxSaturation = 255;
const colorTempMin = 151;
const colorTempMax = 500;

class LightifyWhiteZigBee extends ZigBeeDevice {
	onMeshInit() {

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			set: value => value ? 'on' : 'off',
			setParser: () => ({}),
			get: 'onOff',
			reportParser: value => value === 1,
		});

		// Register dim capability
		this.registerCapability('dim', 'genLevelCtrl', {
			set: 'moveToLevel',
			setParser: value => {
				if (value === 0) {
					return this.triggerCapabilityListener('onoff', false)
						.then(() => null)
						.catch(err => new Error('failed_to_trigger_onoff'));
				} else if (this.getCapabilityValue('onoff') === false && value > 0) {
					return this.triggerCapabilityListener('onoff', true)
						.then(() => ({
							level: value * maxBrightness,
							transtime: this.getSetting('transition_time') * 10
						}))
						.catch(err => new Error('failed_to_trigger_onoff', err));
				}
				return {
					level: value * maxBrightness,
					transtime: this.getSetting('transition_time') * 10
				}
			},
			get: 'currentLevel',
			reportParser: value => value / maxBrightness,
		});

		// Register light_hue capability
		this.registerCapability('light_hue', 'lightingColorCtrl', {
			set: 'moveToHue',
			setParser: value => ({
				hue: value * maxHue,
				direction: 0,
				transtime: this.getSetting('transition_time') * 10,
			}),
			get: 'currentHue',
			reportParser: value => value / maxHue
		});

		// Register light_saturation capability
		this.registerCapability('light_saturation', 'lightingColorCtrl', {
			set: 'moveToSaturation',
			setParser: value => ({
				saturation: value * maxSaturation,
				transtime: this.getSetting('transition_time') * 10,
			}),
			get: 'currentSaturation',
			reportParser: value => value / maxSaturation
		});

		// Register light_temperature capability
		this.registerCapability('light_temperature', 'lightingColorCtrl', {
			set: 'moveToColorTemp',
			setParser: value => ({
				colortemp: map(0, 1, colorTempMin, colorTempMax, value),
				transtime: this.getSetting('transition_time') * 10,
			}),
			get: 'colorTemperature',
			reportParser: value => map(colorTempMin, colorTempMax, 0, 1, value)
		});

		// Register light_mode capability
		this.registerCapability('light_mode', 'lightingColorCtrl', {
			set: 'moveToColorTemp',
			setParser: value => {
				switch (value) {
					case "temperature":
						this.triggerCapabilityListener('light_temperature', this.getCapabilityValue('light_temperature'))
							.then(() => null)
							.catch(err => new Error('failed_to_trigger_light_temperature', err));
						break;
					case "color":
						this.node.endpoints[0].clusters['lightingColorCtrl']
							.do("moveToHueAndSaturation", {
								hue: this.getCapabilityValue('light_hue') * maxHue,
								saturation: this.getCapabilityValue('light_saturation') * maxSaturation,
								transtime: this.getSetting('transition_time') * 10
							})
							.then(() => null)
							.catch(err => new Error('failed_to_do_move_to_hue_and_saturation'));
						break;
					default:
						return null;
				}
			},
			get: 'colorMode',
			reportParser: value => {
				switch (value) {
					case 0:
						return 'color';
						break;
					case 2:
						return 'temperature';
						break;
					default:
						return 'color';
				}
			},
		});
	}
}


/**
 * Map a range of values to a different range of values
 * @param inputStart
 * @param inputEnd
 * @param outputStart
 * @param outputEnd
 * @param input
 * @returns {*}
 */
function map(inputStart, inputEnd, outputStart, outputEnd, input) {
	return outputStart + ((outputEnd - outputStart) / (inputEnd - inputStart)) * (input - inputStart);
}

module.exports = LightifyWhiteZigBee;