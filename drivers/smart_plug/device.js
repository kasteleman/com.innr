'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlug extends ZigBeeDevice {
	onMeshInit() {
		this.printNode();

		// Register onoff capability
		this.registerCapability('onoff', 'genOnOff', {
			getOpts: {
				pollInterval: 15000,
			},
		});
	}
}

module.exports = SmartPlug;
