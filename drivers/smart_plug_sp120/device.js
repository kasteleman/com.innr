'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlugSP120 extends ZigBeeDevice {

	onMeshInit() {
		this.printNode();
		this.enableDebug();

		this.node.endpoints[0].clusters.genTime.read('time')
			.then(result => {
				this.log('time: ', result);
				if (result === 0) {
					this.node.endpoints[0].clusters.genTime.write('time', 0x5B1991B9)
						.then(res => {
							this.log('write Time: ', res);
						})
						.catch(err => {
							this.error('Error write Time: ', err);
						});
				}
			})
			.catch(err => {
				this.log('could not read time');
				this.log(err);
			});

		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', {
				getOpts: {
					// pollInterval: 60000,
					pollInterval: this.getSetting('report_interval') * 1000 || 60000,
				},
			});
		}

		if (this.hasCapability('meter_power')) {
			this.registerCapability('meter_power', 'seMetering', {
				get: 'currentSummDelivered',
				reportParser(value) {
					this.log('value: ', value);
					// return Buffer.from(value).readUIntBE(0, 2) / 1000;
					return value[1] / 100;
				},
				report: 'currentSummDelivered',
				getOpts: {
					getOnStart: true,
					pollInterval: 3600000,
				},
			});
		}

		if (this.hasCapability('measure_power')) {
			this.registerCapability('measure_power', 'haElectricalMeasurement', {
				get: 'activePower',
				reportParser(value) {
					this.log('value: ', value);
					if (value < 0) return;
					return value;
				},
				report: 'activePower',
				getOpts: {
					getOnStart: true,
					// pollInterval: 60000,
					pollInterval: this.getSetting('report_interval') * 1000 || 60000,
				},
			});
		}

	}

	onSettings(oldSettingsObj, newSettingsObj, changedKeysArr, callback) {

		this.log(changedKeysArr);
		this.log('newSettingsObj', newSettingsObj);
		this.log('oldSettingsObj', oldSettingsObj);

		// pollsetting report settings changed
		if (changedKeysArr.includes('report_interval')) {
			this.log('report_interval: ', newSettingsObj.report_interval);
			callback(null, true);

			this.registerCapability('onoff', 'genOnOff', {
				getOpts: {
					// pollInterval: 60000,
					pollInterval: this.getSetting('report_interval') * 1000 || 60000,
				},
			});

			this.registerCapability('meter_power', 'seMetering', {
				get: 'currentSummDelivered',
				reportParser(value) {
					this.log('value: ', value);
					// return Buffer.from(value).readUIntBE(0, 2) / 1000;
					return value[1] / 100;
				},
				report: 'currentSummDelivered',
				getOpts: {
					getOnStart: true,
					pollInterval: 3600000,
				},
			});

			this.registerCapability('measure_power', 'haElectricalMeasurement', {
				get: 'activePower',
				reportParser(value) {
					this.log('value: ', value);
					if (value < 0) return;
					return value;
				},
				report: 'activePower',
				getOpts: {
					getOnStart: true,
					// pollInterval: 60000,
					pollInterval: this.getSetting('report_interval') * 1000 || 60000,
				},
			});

		}	else {
			callback(Homey.__("report interval settings error"), null);
		}
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
