'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class TunableGU10 extends ZigBeeLightDevice {

  async onMeshInit() {

      await super.onMeshInit();
      // enable debugging
      // this.enableDebug();

      // print the node's info to the console
      // this.printNode();

      this.log('GreenPowerProxy endpoint: ', this.getClusterEndpoint('genGreenPowerProxy'));

      if (this.getClusterEndpoint('genGreenPowerProxy') !== 0) {
        this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, value => {
          this.log('onoff', value);
          this.setCapabilityValue('onoff', value === 1);
        }, 0);

        this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 3, 300, 3, value => {
          this.log('dim report', value);
          this.setCapabilityValue('dim', value / 254);
        }, 0);

        this.registerAttrReportListener('lightingColorCtrl', 'colorTemperature', 3, 300, 3, value => {
          this.log('light_temperature report', value);
          this.setCapabilityValue('light_temperature', util.mapValueRange(this._colorTempMin, this._colorTempMax, 0, 1, value));
        }, 0);

      }

  }

}

module.exports = TunableGU10;
