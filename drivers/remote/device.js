'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class remotescenes extends ZigBeeDevice {
	onMeshInit() {
		this.printNode();

		// reportlisteners for the endpoints
		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 2);

		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 3);

		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 4);

		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 5);

		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 6);

		this.registerReportListener('genLevelCtrl', 'moveToLevel', report => {
			console.log(report);
		}, 7);

		// register the flowcard

		let tokens = {};
		let pushed = {};

		this.remoteButtonTrigger = new Homey.FlowCardTriggerDevice('remote_button_pressed')
		.register()
		.registerRunListener((args, state) => {
			this.log(args, state);
			return Promise.resolve(args.button === state.button);
		});

		if (this.node) {

			// Listen to all the commands that come in
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
				// console.log(report.endpoint);
				console.log(report.attr);
				// console.log(report.value);

				// shortpress - or +
				if (report.value.command === 'step' && report.value.stepmode === 1) { pushed = '- short'; }
				if (report.value.command === 'step' && report.value.stepmode === 0) { pushed = '+ short'; }

				// on or off button
				if (report.value.command === 'on') { pushed = 'on'; }
				if (report.value.command === 'off') { pushed = 'off'; }

				// longpress - or +
				if (report.value.command === 'move' && report.value.movemode === 1) { pushed = '- long'; }
				if (report.value.command === 'move' && report.value.movemode === 0) { pushed = '+ long'; }

				// stop received after longpress
				if (report.value.command === 'stop') { pushed = 'stop'; }

				// todo scenes:
				// buttons 1 t/m 6 moveToLevelWithOnOff and level
				// - , on, off and + same as lights buttons

				// exclude SCENES button
				if (parseInt(report.endpoint, 0) > 0) {

					tokens = {
						button_number: parseInt(report.endpoint - 1, 0),
						button_type: pushed,
					};
					this.log(tokens);

					this.remoteButtonTrigger.trigger(this, tokens, { button: parseInt(report.endpoint - 1, 0).toString() })
					.then(this.log)
					.catch(this.error);
				}

			});
		}
	}
}

module.exports = remotescenes;
