'use strict';

const Homey = require('homey');

const Log = require('homey-log').Log;

class INNRZigbeeApp extends Homey.App {
	onInit() {
		this.log('init');
		new Homey.FlowCardAction('dim_custom_transition_time')
			.register()
			.registerRunListener(args => args.device.onFlowActionSetDimWithCustomTransitionTime(args.type_to_dim, args.dim_value, args.transition_value));
	}

}

module.exports = INNRZigbeeApp;
