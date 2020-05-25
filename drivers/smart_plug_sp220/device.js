'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlugSP222 extends ZigBeeDevice {

	onMeshInit() {
		this.printNode();
		this.enableDebug();

		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', {
			});
			if (this.getClusterEndpoint('genGreenPowerProxy') !== 0) {
				this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, value => {
					this.log('onoff', value);
					this.setCapabilityValue('onoff', value === 1);
				}, 0);
			}
		}

	//	if (this.hasCapability('meter_power')) {
	//		this.registerCapability('meter_power', 'seMetering', {
	//			get: 'currentSummDelivered',
	//			reportParser(value) {
	//				this.log('value: ', value);
	// 				return Buffer.from(value).readUIntBE(0, 2) / 1000;
	//				return value[1] / 100;
	//			},
	//			report: 'currentSummDelivered',
	//		});
	//	}

	//	if (this.hasCapability('measure_power')) {
	//		this.registerCapability('measure_power', 'haElectricalMeasurement', {
	//			get: 'activePower',
	//			reportParser(value) {
	//				this.log('value: ', value);
	//				if (value < 0) return;
	//				return value;
	//			},
	//			report: 'activePower',
	//		});

	}

}

module.exports = SmartPlugSP222;

// [log] [ManagerDrivers] [smart_plug_sp222] [0] - Battery: false
// [log] [ManagerDrivers] [smart_plug_sp222] [0] - Endpoints: 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] -- Clusters:
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- 64642
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : 64642
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- zapp
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genBasic
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 9 : 5
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 10 : 010400103
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 11 : www.innr.com������
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genBasic
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- zclVersion : 3
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- appVersion : 16
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- stackVersion : 101
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- hwVersion : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- manufacturerName : innr
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- modelId : SP 222
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- dateCode : 20190418-20
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- powerSource : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- appProfileVersion : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- deviceEnabled : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- swBuildId : 2.1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genIdentify
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genIdentify
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- identifyTime : 178
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genGroups
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genGroups
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genScenes
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genScenes
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- count : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- currentScene : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- currentGroup : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sceneValid : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genOnOff
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 16387 : 255
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genOnOff
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- onOff : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- globalSceneCtrl : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- onTime : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- offWaitTime : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genLevelCtrl
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 15 : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 16384 : 255
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genLevelCtrl
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- currentLevel : 254
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- remainingTime : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- onLevel : 255
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genTime
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genTime
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genOta
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genOta
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- haDiagnostic
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : haDiagnostic
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- aPSTxUcastSuccess : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- aPSTxUcastRetry : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- aPSTxUcastFail : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- nwkFcFailure : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- apsFcFailure : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- apsUnauthorizedKey : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- nwkDecryptFailures : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- apsDecryptFailures : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- packetBufferAllocateFailures : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- phyToMacQueueLimitReached : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- packetValidateDropCount : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- averageMacRetryPerApsMessageSent : 0
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- lastMessageLqi : 164
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- lastMessageRssi : -59
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- lightLink
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- 65533 : 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : lightLink
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] - Endpoints: 1
// [log] [ManagerDrivers] [smart_plug_sp222] [0] -- Clusters:
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- zapp
// [log] [ManagerDrivers] [smart_plug_sp222] [0] --- genGreenPowerProxy
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- cid : genGreenPowerProxy
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp222] [0] ------------------------------------------
