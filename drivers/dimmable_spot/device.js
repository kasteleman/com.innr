'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class DimmableSpot extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();
	}
}

module.exports = DimmableSpot;
