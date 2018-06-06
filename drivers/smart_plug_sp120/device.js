'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlugSP120 extends ZigBeeDevice {

	onMeshInit() {
		this.printNode();
		this.enableDebug();

		if (this.hasCapability('onoff')) this.registerCapability('onoff', 'genOnOff');
		if (this.hasCapability('meter_power')) {
			this.registerCapability('meter_power', 'seMetering', {
				get: 'currentSummDelivered',
				reportParser(value) {
					this.log('value: ', value);
					return Buffer.from(value).readUIntBE(0, 2) / 1000;
				},
				report: 'currentSummDelivered',
				getOpts: {
					getOnStart: true,
				},

			});
		}

		if (this.hasCapability('measure_power')) {
			this.registerCapability('measure_power', 'seMetering', {
				get: 'instantaneousDemand',
				reportParser(value) {
					if (value < 0) return;
					return value / 10;
				},
				report: 'instantaneousDemand',
				getOpts: {
					getOnStart: true,
				},
			});
		}

		// Report is send if status is changed or after 5 min
		//this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, data => {
			// this.log('onOff', data);
			//this.setCapabilityValue('onoff', data === 1);
		//}, 0);

		// measure_power
		// Report is send if status is changed with min of 2 Watt or after 5 min
		this.registerAttrReportListener('seMetering', 'instantaneousDemand', 10, 300, 10, value => {
			const parsedValue = value / 10;
			if (value < 0) return;
			// this.log('instantaneousDemand', value, parsedValue);
			this.setCapabilityValue('measure_power', parsedValue);
		}, 0);

		// meter_power
		// Report is send in 10 min. Can not be changed.
		this.registerAttrReportListener('seMetering', 'currentSummDelivered', 600, 600, [null, null], value => {
			const parsedValue = Buffer.from(value).readUIntBE(0, 2) / 1000;
			// this.log('currentSummDelivered', value, parsedValue);
			this.setCapabilityValue('meter_power', parsedValue);
		}, 0);

	}

}

module.exports = SmartPlugSP120;

// [log] [ManagerDrivers] [smart_plug_sp120] [0] - Battery: false
// [log] [ManagerDrivers] [smart_plug_sp120] [0] - Endpoints: 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] -- Clusters:
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- zapp
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genBasic
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- 10 : 010400082
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genBasic
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- zclVersion : 2
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- appVersion : 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- stackVersion : 2
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- hwVersion : 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- manufacturerName : innr
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- modelId : SP 120
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- dateCode : 20171027-100
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- powerSource : 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- swBuildId : 2.0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genIdentify
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genIdentify
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- identifyTime : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genGroups
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genGroups
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genScenes
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genScenes
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- count : 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- currentScene : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- currentGroup : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sceneValid : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- nameSupport : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- lastCfgBy : 0xffffffffffffffff
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genOnOff
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genOnOff
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- onOff : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- globalSceneCtrl : 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- onTime : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- offWaitTime : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genLevelCtrl
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genLevelCtrl
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- currentLevel : 254
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- remainingTime : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- onOffTransitionTime : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genTime
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genTime
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- time : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- timeStatus : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- genOta
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : genOta
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- seMetering
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : seMetering
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- currentSummDelivered : [ 0, 0 ]
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- status : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- unitOfMeasure : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- summaFormatting : 42
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- meteringDeviceType : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- haElectricalMeasurement
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : haElectricalMeasurement
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- measurementType : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- rmsVoltage : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- rmsCurrent : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- activePower : 0
// [log] [ManagerDrivers] [smart_plug_sp120] [0] - Endpoints: 1
// [log] [ManagerDrivers] [smart_plug_sp120] [0] -- Clusters:
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- zapp
// [log] [ManagerDrivers] [smart_plug_sp120] [0] --- lightLink
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- cid : lightLink
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ---- sid : attrs
// [log] [ManagerDrivers] [smart_plug_sp120] [0] ------------------------------------------
