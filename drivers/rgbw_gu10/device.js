'use strict';

const ZigBeeXYLightDevice = require('homey-meshdriver').ZigBeeXYLightDevice;

const util = require('./../../node_modules/homey-meshdriver/lib/util');

const CIEMultiplier = 65279;

class RGBWGU10 extends ZigBeeXYLightDevice {

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

        this.registerAttrReportListener('genLevelCtrl', 'currentLevel', 1, 300, 1, value => {
          this.log('dim report', value);
          this.setCapabilityValue('dim', value / 254);
        }, 0);

        this.registerAttrReportListener('lightingColorCtrl', 'currentHue', 1, 300, 1, value => {
          this.log('HUE report', value);
          this.setCapabilityValue('light_hue', value / 254);
        }, 0);

        this.registerAttrReportListener('lightingColorCtrl', 'currentSaturation', 1, 300, 1, value => {
          this.log('Saturation report', value);
          this.setCapabilityValue('light_saturation', value / 254);
        }, 0);

        this.registerAttrReportListener('lightingColorCtrl', 'currentX', 1, 300, 10, value => {
          this.log('currentX report', value);
          this.node.endpoints[0].clusters.lightingColorCtrl.read('currentY')
          .then(result => {
            this.log('currentY report ', result);
            if (result === value) {
              this.log('currentX === currentY');
              this.log('Setting capability light_temperature ->', Math.round((value / CIEMultiplier - 0.2) * 4 *100) / 100);
              this.setCapabilityValue('light_temperature', Math.round((value / CIEMultiplier - 0.2) * 4 *100) / 100);
            }
          })
          .catch(err => {
            this.log('could not read currentY');
            this.log(err);
          });
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

// [log] [ManagerDrivers] [rgbw_gu10] [0] - Battery: false
// [log] [ManagerDrivers] [rgbw_gu10] [0] - Endpoints: 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] -- Clusters:
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- 64642
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : 64642
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- zapp
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genBasic
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 9 : 5
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 10 : 010100241
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 11 : www.innr.com
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genBasic
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- zclVersion : 3
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- appVersion : 16
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- stackVersion : 101
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- hwVersion : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- manufacturerName : innr
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- modelId : RS 230 C
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- dateCode : 20190802-134
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- powerSource : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- appProfileVersion : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- deviceEnabled : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- swBuildId : 2.7
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genIdentify
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genIdentify
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- identifyTime : 178
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genGroups
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genGroups
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genScenes
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genScenes
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- count : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentScene : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentGroup : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sceneValid : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genOnOff
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 16387 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genOnOff
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- onOff : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- globalSceneCtrl : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- onTime : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- offWaitTime : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genLevelCtrl
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 15 : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 16384 : 255
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genLevelCtrl
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentLevel : 254
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- remainingTime : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- onOffTransitionTime : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- onLevel : 255
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genOta
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genOta
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- lightingColorCtrl
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 15 : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : lightingColorCtrl
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentHue : 24
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentSaturation : 201
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- remainingTime : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentX : 29991
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- currentY : 26872
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorTemperature : 370
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorMode : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- numPrimaries : 3
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary1X : 45874
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary1Y : 19660
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary1Intensity : 84
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary2X : 7208
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary2Y : 53738
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary2Intensity : 84
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary3X : 7864
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary3Y : 5242
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- primary3Intensity : 84
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointRX : 44564
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointRY : 20316
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointRIntensity : 84
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointGX : 7208
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointGY : 53739
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointGIntensity : 84
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointBX : 8519
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- colorPointBY : 2621
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- haDiagnostic
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : haDiagnostic
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- aPSTxUcastSuccess : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- aPSTxUcastRetry : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- aPSTxUcastFail : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- nwkFcFailure : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- apsFcFailure : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- apsUnauthorizedKey : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- nwkDecryptFailures : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- apsDecryptFailures : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- packetBufferAllocateFailures : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- phyToMacQueueLimitReached : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- packetValidateDropCount : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- averageMacRetryPerApsMessageSent : 0
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- lastMessageLqi : 212
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- lastMessageRssi : -47
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- lightLink
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : lightLink
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs
// [log] [ManagerDrivers] [rgbw_gu10] [0] - Endpoints: 1
// [log] [ManagerDrivers] [rgbw_gu10] [0] -- Clusters:
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- zapp
// [log] [ManagerDrivers] [rgbw_gu10] [0] --- genGreenPowerProxy
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- cid : genGreenPowerProxy
// [log] [ManagerDrivers] [rgbw_gu10] [0] ---- sid : attrs

module.exports = RGBWGU10;
