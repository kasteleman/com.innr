'use strict';

const ZigBeeXYLightDevice = require('homey-meshdriver').ZigBeeXYLightDevice;

const util = require('./../../node_modules/homey-meshdriver/lib/util');

const CIEMultiplier = 65279;

class RGBE14 extends ZigBeeXYLightDevice {

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

}

//[log] [ManagerDrivers] [rgbw_e14] [0] ------------------------------------------
//[log] [ManagerDrivers] [rgbw_e14] [0] Node: 2c68f546-4a28-4cce-96ae-f4e6577a11ef
//[log] [ManagerDrivers] [rgbw_e14] [0] - Battery: false
//[log] [ManagerDrivers] [rgbw_e14] [0] - Endpoints: 0
//[log] [ManagerDrivers] [rgbw_e14] [0] -- Clusters:
//[log] [ManagerDrivers] [rgbw_e14] [0] --- zapp
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genBasic
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 9 : 5
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 10 : 010100242
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 11 : www.innr.com
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genBasic
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- zclVersion : 3
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- appVersion : 16
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- stackVersion : 98
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- hwVersion : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- manufacturerName : innr
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- modelId : RB 250 C
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- dateCode : 20190326-87
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- powerSource : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- appProfileVersion : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- deviceEnabled : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- swBuildId : 2.1
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genIdentify
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genIdentify
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- identifyTime : 178
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genGroups
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genGroups
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- nameSupport : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genScenes
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genScenes
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- count : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentScene : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentGroup : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sceneValid : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- nameSupport : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genOnOff
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 16387 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genOnOff
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- onOff : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- globalSceneCtrl : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- onTime : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- offWaitTime : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genLevelCtrl
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 15 : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 16384 : 255
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genLevelCtrl
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentLevel : 254
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- remainingTime : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- onLevel : 255
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genOta
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genOta
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] --- lightingColorCtrl
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 15 : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : lightingColorCtrl
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentHue : 170
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentSaturation : 254
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- remainingTime : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentX : 29991
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- currentY : 26872
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- colorTemperature : 153
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- colorMode : 2
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- numPrimaries : 3
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary1X : 45874
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary1Y : 19660
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary1Intensity : 84
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary2X : 7208
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary2Y : 53738
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary2Intensity : 84
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary3X : 7864
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary3Y : 5242
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary3Intensity : 84
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary4X : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary4Y : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary4Intensity : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary5X : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary5Y : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary5Intensity : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary6X : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- primary6Y : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] --- haDiagnostic
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : haDiagnostic
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- aPSTxUcastSuccess : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- aPSTxUcastRetry : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- aPSTxUcastFail : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- nwkFcFailure : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- apsFcFailure : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- apsUnauthorizedKey : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- nwkDecryptFailures : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- apsDecryptFailures : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- packetBufferAllocateFailures : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- phyToMacQueueLimitReached : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- packetValidateDropCount : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- averageMacRetryPerApsMessageSent : 0
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- lastMessageLqi : 140
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- lastMessageRssi : -65
//[log] [ManagerDrivers] [rgbw_e14] [0] --- lightLink
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- 65533 : 1
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : lightLink
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] - Endpoints: 1
//[log] [ManagerDrivers] [rgbw_e14] [0] -- Clusters:
//[log] [ManagerDrivers] [rgbw_e14] [0] --- zapp
//[log] [ManagerDrivers] [rgbw_e14] [0] --- genGreenPowerProxy
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- cid : genGreenPowerProxy
//[log] [ManagerDrivers] [rgbw_e14] [0] ---- sid : attrs
//[log] [ManagerDrivers] [rgbw_e14] [0] ------------------------------------------

module.exports = RGBE14;
