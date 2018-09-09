'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;
const maxDim = 254;

class RGBBulb extends ZigBeeLightDevice {

	async onMeshInit() {
		await super.onMeshInit();
		// enable debugging
		this.enableDebug();

		// print the node's info to the console
		this.printNode();

		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', {
				set: 'moveToLevelWithOnOff',
				setParser(value, opts = {}) {
					var DimTransitionTime = 0;
					// if flow card opts is used, define transition time based on opts
					if (typeof opts.duration === 'number') {
						DimTransitionTime = Math.round((opts.duration / 1000) * 10);
						this.log('Dim to:', value, 'with duration [s] (flow):', DimTransitionTime / 10);
					}
					// if flow card opts is not used, use the settings based transition time
					else {
						DimTransitionTime = this.getSetting('transition_time') ? Math.round(this.getSetting('transition_time') * 10) : 0
						this.log('Dim to:', value, 'with duration [s] (settings):', DimTransitionTime / 10);
					}
					// update onoff capability based on dim setpoint
					this.setCapabilityValue('onoff', value > 0)
					return {
						level: Math.round(value * maxDim),
						transtime: DimTransitionTime,
					}
				},
			});
		}

	}

}

module.exports = RGBBulb;