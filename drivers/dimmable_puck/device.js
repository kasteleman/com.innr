'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class DimmablePuck extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();
	}
}

module.exports = DimmablePuck;
