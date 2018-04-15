'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

class FlowFix extends ZigBeeLightDevice {

	onMeshInit() {

		this.registerCapability('onoff', 'genOnOff', {
			set: 'moveToLevelWithOnOff',
			setParser(value) {
				if (value) {
					this.node.endpoints[0].clusters.genOnOff.do('on', {})
						.then(result => {
							this.log('on: ', result);
						})
						.catch(err => {
							this.log('could not set to on');
							this.log(err);
						});
				}
				if (!value) {
					this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevelWithOnOff', { level: 1, transtime: 2 })
						.then(result => {
							this.log('moveToLevelWithOnOff: ', result);
						})
						.catch(err => {
							this.log('could not send offWithEffect');
							this.log(err);
						});
				}
				return null;
			},
			get: 'onOff',
			reportParser(value) {
				return value === 1;
			},
			report: 'onOff',
			getOpts: {
				getOnStart: true,
			},
		});

		this.registerCapability('dim', 'genLevelCtrl');

	}

}

module.exports = FlowFix;
