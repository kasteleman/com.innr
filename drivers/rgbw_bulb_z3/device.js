'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class RGBBulbZ3 extends ZigBeeLightDevice {

  async onMeshInit() {
   		await super.onMeshInit();
   		// enable debugging
   		//this.enableDebug();

   		// print the node's info to the console
   		//this.printNode();

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
/*
 [rgbw_bulb_z3] [0] ZigBeeDevice has been inited
 [rgbw_bulb_z3] [0] ------------------------------------------
 [rgbw_bulb_z3] [0] Node: 1044ea17-face-4696-bb49-59f5c6ef5446
 [rgbw_bulb_z3] [0] - Battery: false
 [rgbw_bulb_z3] [0] - Endpoints: 0
 [rgbw_bulb_z3] [0] -- Clusters:
 [rgbw_bulb_z3] [0] --- zapp
 [rgbw_bulb_z3] [0] --- genBasic
 [rgbw_bulb_z3] [0] ---- 9 : 5
 [rgbw_bulb_z3] [0] ---- 10 : 010100288
 [rgbw_bulb_z3] [0] ---- 11 : www.innr.com
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genBasic
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- zclVersion : 2
 [rgbw_bulb_z3] [0] ---- appVersion : 16
 [rgbw_bulb_z3] [0] ---- stackVersion : 21
 [rgbw_bulb_z3] [0] ---- hwVersion : 1
 [rgbw_bulb_z3] [0] ---- manufacturerName : innr
 [rgbw_bulb_z3] [0] ---- modelId : RB 285 C
 [rgbw_bulb_z3] [0] ---- dateCode : 20180813-1
 [rgbw_bulb_z3] [0] ---- powerSource : 1
 [rgbw_bulb_z3] [0] ---- appProfileVersion : 0
 [rgbw_bulb_z3] [0] ---- swBuildId : 2.0
 [rgbw_bulb_z3] [0] --- genIdentify
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genIdentify
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- identifyTime : 178
 [rgbw_bulb_z3] [0] ---- identifyCommissionState : 0
 [rgbw_bulb_z3] [0] --- genGroups
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genGroups
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- nameSupport : 0
 [rgbw_bulb_z3] [0] --- genScenes
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genScenes
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- count : 1
 [rgbw_bulb_z3] [0] ---- currentScene : 0
 [rgbw_bulb_z3] [0] ---- currentGroup : 0
 [rgbw_bulb_z3] [0] ---- sceneValid : 0
 [rgbw_bulb_z3] [0] ---- nameSupport : 0
 [rgbw_bulb_z3] [0] ---- lastCfgBy : 0x0000000000000000
 [rgbw_bulb_z3] [0] --- genOnOff
 [rgbw_bulb_z3] [0] ---- 16387 : 1
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genOnOff
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- onOff : 1
 [rgbw_bulb_z3] [0] ---- globalSceneCtrl : 1
 [rgbw_bulb_z3] [0] ---- onTime : 0
 [rgbw_bulb_z3] [0] ---- offWaitTime : 0
 [rgbw_bulb_z3] [0] --- genLevelCtrl
 [rgbw_bulb_z3] [0] ---- 15 : 0
 [rgbw_bulb_z3] [0] ---- 16384 : 255
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : genLevelCtrl
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- currentLevel : 254
 [rgbw_bulb_z3] [0] ---- remainingTime : 0
 [rgbw_bulb_z3] [0] --- genOta
 [rgbw_bulb_z3] [0] ---- cid : genOta
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] --- lightingColorCtrl
 [rgbw_bulb_z3] [0] ---- 15 : 0
 [rgbw_bulb_z3] [0] ---- 16397 : 153
 [rgbw_bulb_z3] [0] ---- 16400 : 65535
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : lightingColorCtrl
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ---- currentHue : 171
 [rgbw_bulb_z3] [0] ---- currentSaturation : 254
 [rgbw_bulb_z3] [0] ---- remainingTime : 0
 [rgbw_bulb_z3] [0] ---- currentX : 29991
 [rgbw_bulb_z3] [0] ---- currentY : 26872
 [rgbw_bulb_z3] [0] ---- colorTemperature : 370
 [rgbw_bulb_z3] [0] ---- colorMode : 2
 [rgbw_bulb_z3] [0] ---- numPrimaries : 3
 [rgbw_bulb_z3] [0] ---- primary1X : 45874
 [rgbw_bulb_z3] [0] ---- primary1Y : 19660
 [rgbw_bulb_z3] [0] ---- primary1Intensity : 84
 [rgbw_bulb_z3] [0] ---- primary2X : 7208
 [rgbw_bulb_z3] [0] ---- primary2Y : 53738
 [rgbw_bulb_z3] [0] ---- primary2Intensity : 84
 [rgbw_bulb_z3] [0] ---- primary3X : 7864
 [rgbw_bulb_z3] [0] ---- primary3Y : 5242
 [rgbw_bulb_z3] [0] ---- primary3Intensity : 84
 [rgbw_bulb_z3] [0] ---- primary4X : 0
 [rgbw_bulb_z3] [0] ---- primary4Y : 0
 [rgbw_bulb_z3] [0] ---- primary4Intensity : 255
 [rgbw_bulb_z3] [0] ---- primary5X : 0
 [rgbw_bulb_z3] [0] ---- primary5Y : 0
 [rgbw_bulb_z3] [0] ---- primary5Intensity : 255
 [rgbw_bulb_z3] [0] ---- primary6X : 0
 [rgbw_bulb_z3] [0] ---- primary6Y : 0
 [rgbw_bulb_z3] [0] ---- primary6Intensity : 255
 [rgbw_bulb_z3] [0] ---- colorPointRX : 45874
 [rgbw_bulb_z3] [0] ---- colorPointRY : 19660
 [rgbw_bulb_z3] [0] ---- colorPointRIntensity : 0
 [rgbw_bulb_z3] [0] ---- colorPointGX : 7208
 [rgbw_bulb_z3] [0] ---- colorPointGY : 53738
 [rgbw_bulb_z3] [0] ---- colorPointGIntensity : 0
 [rgbw_bulb_z3] [0] ---- colorPointBX : 7864
 [rgbw_bulb_z3] [0] ---- colorPointBY : 5242
 [rgbw_bulb_z3] [0] ---- colorPointBIntensity : 0
 [rgbw_bulb_z3] [0] ---- enhancedCurrentHue : 43877
 [rgbw_bulb_z3] [0] ---- enhancedColorMode : 2
 [rgbw_bulb_z3] [0] ---- colorLoopActive : 0
 [rgbw_bulb_z3] [0] ---- colorLoopDirection : 0
 [rgbw_bulb_z3] [0] ---- colorLoopTime : 25
 [rgbw_bulb_z3] [0] ---- colorLoopStartEnhancedHue : 8960
 [rgbw_bulb_z3] [0] ---- colorLoopStoredEnhancedHue : 0
 [rgbw_bulb_z3] [0] ---- colorCapabilities : 31
 [rgbw_bulb_z3] [0] ---- colorTempPhysicalMin : 153
 [rgbw_bulb_z3] [0] ---- colorTempPhysicalMax : 555
 [rgbw_bulb_z3] [0] --- lightLink
 [rgbw_bulb_z3] [0] ---- 65533 : 1
 [rgbw_bulb_z3] [0] ---- cid : lightLink
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] - Endpoints: 1
 [rgbw_bulb_z3] [0] -- Clusters:
 [rgbw_bulb_z3] [0] --- zapp
 [rgbw_bulb_z3] [0] --- genGreenPowerProxy
 [rgbw_bulb_z3] [0] ---- cid : genGreenPowerProxy
 [rgbw_bulb_z3] [0] ---- sid : attrs
 [rgbw_bulb_z3] [0] ------------------------------------------
*/

module.exports = RGBBulbZ3;
