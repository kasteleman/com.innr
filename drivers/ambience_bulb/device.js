'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class AmbienceBulb extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();
	}
}

module.exports = AmbienceBulb;
