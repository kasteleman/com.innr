'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlug extends ZigBeeDevice {
	onMeshInit() {
		// this.printNode();

		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', {
				getOpts: {
					pollInterval: 15000,
				},
			});
		}

	}
}

module.exports = SmartPlug;
