'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class DimmableBulb extends ZigBeeLightDevice {
  	onMeshInit() {
      this.printNode();
    }
}

module.exports = DimmableBulb;
