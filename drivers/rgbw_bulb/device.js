'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class RGBBulb extends ZigBeeLightDevice {
  	onMeshInit() {
      this.printNode();
    }
}

module.exports = RGBBulb;
