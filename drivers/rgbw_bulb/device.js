'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class RGBBulb extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();
	}
}

module.exports = RGBBulb;
