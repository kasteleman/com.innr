'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlug extends ZigBeeDevice {
	onMeshInit() {

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			getOpts: {
				pollInterval: 15000
			},
			set: value => value ? 'on' : 'off',
			setParser: () => ({}),
			get: 'onOff',
			report: 'onOff',
			reportParser: value => value === 1,
		});
	}
}

module.exports = SmartPlug;
