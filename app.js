'use strict';

const Homey = require('homey');
const Log = require('homey-log').Log;

class INNRZigbeeApp extends Homey.App {
	onInit() {
		this.log('init');

		this.actionStartDimLevelChange = new Homey.FlowCardAction('action_DIM_startLevelChange')
			.register()
			.registerRunListener(this._actionStartDimLevelChangeRunListener.bind(this));
		this.actionStopDimLevelChange = new Homey.FlowCardAction('action_DIM_stopLevelChange')
			.register()
			.registerRunListener(this._actionStopDimLevelChangeRunListener.bind(this));
	}

	async _actionStartDimLevelChangeRunListener(args, state) {
		if (!args.hasOwnProperty('direction')) return Promise.reject('direction_property_missing');
		args.device.log('FlowCardAction triggered to start dim level change in direction', args.direction, 'with rate', 100 * args.rate);
		let moveObj = {
			movemode: args.direction,
			rate: 100 * args.rate,
		};

		if (args.device.node.endpoints[0].clusters['genLevelCtrl']) {
			return await args.device.node.endpoints[0].clusters['genLevelCtrl'].do("moveWithOnOff", moveObj)
		}
		return Promise.reject('unknown_error');
	}

	async _actionStopDimLevelChangeRunListener(args, state) {
		args.device.log("FlowCardAction triggered to stop dim level change");

		if (args.device.node.endpoints[0].clusters["genLevelCtrl"]) {
			try {
				// 1. trigger stop command
				await args.device.node.endpoints[0].clusters["genLevelCtrl"].do("stop", {});

				// 2. when stop command is successfull, trigger currentLevel read command
				const result = await args.device.node.endpoints[0].clusters["genLevelCtrl"].read("currentLevel");

				args.device.log('Updating capabilities after stopping, onoff:', result > 1, 'dim:', result / 254);
				// 3. update onoff capability
				if (args.device.hasCapability("onoff")) {
					args.device.setCapabilityValue("onoff", result > 1);
				}
				// 4. update dim capability
				if (args.device.hasCapability("dim")) {
					args.device.setCapabilityValue("dim", result / 254);
				}
			}
			catch (err) {
				args.device.log(err);
				return Promise.reject(err);;
			}
		}
		else {
			return Promise.reject('unknown_error');
		}
	}
}

module.exports = INNRZigbeeApp;