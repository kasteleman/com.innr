'use strict';

const Homey = require('homey');

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class remotescenes extends ZigBeeDevice {
	onMeshInit() {
		this.printNode();

		// Not useful in this case, but using registerReportListener you can subscribe to incoming reports
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
		let buttonpushed;
		const args = {};

		const remoteButtonTrigger = new Homey.FlowCardTriggerDevice('remote_button_pressed')
		.register()
		.registerRunListener(args, tokens, state => {
			if (args && args.hasOwnProperty('state')) return console.log(args.state);
			this.log(args, state);
			Promise.reject(new Error('invalid arguments and or state provided'));
		});

		if (this.node) {

			// Listen to all the commands that come in
			this.node.on('command', report => {
				console.log('Command received');
				console.log(report);
				console.log(report.endpoint);
				console.log(report.attr);
				console.log(report.value);

				// shortpress - or +
				if (report.attr === 'step' && report.value.stepmode === 1) { pushed = '- short'; }
				if (report.attr === 'step' && report.value.stepmode === 0) { pushed = '+ short'; }

				// on or off button
				if (report.attr === 'on') { pushed = 'on'; }
				if (report.attr === 'off') { pushed = 'off'; }

				// longpress - or +
				if (report.attr === 'move' && report.value.movemode === 1) { pushed = '- long'; }
				if (report.attr === 'move' && report.value.movemode === 0) { pushed = '+ long'; }

				// todo scenes:
				// buttons 1 t/m 6 moveToLevelWithOnOff and level
				// - , on, off and + same as lights buttons

				if (parseInt(report.endpoint, 0) > 0) {
					buttonpushed = parseInt(report.endpoint, 0) - 1;
					tokens = { button_number: buttonpushed, button_type: pushed };
					this.log(tokens);

					// to do args for different buttons pushed icw app.json

					remoteButtonTrigger.trigger(this, tokens, null)
					.then(this.log)
					.catch(this.error);
				}

			});
		}
	}
}

module.exports = remotescenes;
