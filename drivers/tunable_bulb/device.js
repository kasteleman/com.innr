'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class TunableBulb extends ZigBeeLightDevice {
	onMeshInit() {
		this.printNode();
		this.enableDebug();

		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', {
				getOpts: {
					getOnStart: true,
				},
			});
		}

		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', {
				getOpts: {
					getOnStart: true,
				},
			});
		}

		if (this.hasCapability('light_temperature')) {
			this.registerCapability('light_temperature', 'lightingColorCtrl', {
				getOpts: {
					getOnStart: true,
				},
			});
		}

	}

}

module.exports = TunableBulb;
