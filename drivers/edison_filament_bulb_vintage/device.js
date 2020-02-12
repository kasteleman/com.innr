'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;
const maxDim = 254;

class longfilamentbulbvintage extends ZigBeeLightDevice {

  async onMeshInit() {

      await super.onMeshInit();
      // enable debugging
      this.enableDebug();

      // print the node's info to the console
      this.printNode();

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

      }

  }

  onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {

    this.log(changedKeysArr);
    this.log('newSettingsObj', newSettingsObj);
    this.log('oldSettingsObj', oldSettingsObj);
    this.log('test: ', changedKeysArr.includes('On_Off_TransitionTime'));
    this.log('test: ', changedKeysArr.includes('transition_time'));
    // on_of_transition changed
    if (changedKeysArr.includes('On_Off_TransitionTime')) {
      this.log('On_Off_TransitionTime: ', newSettingsObj.On_Off_TransitionTime * 10);
      callback(null, true);
      this.node.endpoints[0].clusters.genLevelCtrl.write('onOffTransitionTime', newSettingsObj.On_Off_TransitionTime * 10)
        .then(result => {
          this.log('On_Off_TransitionTime: ', result);
        })
        .catch(err => {
          this.log('could not write On_Off_TransitionTime');
          this.log(err);
        });
    }

    if (changedKeysArr.includes('transition_time')) {
      this.log('transition_time: ', newSettingsObj.transition_time);
      callback(null, true);
    }
  }

}

module.exports = longfilamentbulbvintage;
