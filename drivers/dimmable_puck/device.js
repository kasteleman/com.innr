'use strict';

const maxDim = 254;

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class DimmablePuck extends ZigBeeDevice {

	onMeshInit() {
		this.registerCapability('onoff', 'genOnOff', {
			set: 'onWithRecallGlobalScene',
			setParser(value) {
				if (value) {
					this.node.endpoints[0].clusters.genOnOff.do('onWithRecallGlobalScene', {})
						.then(result => {
							this.log('onWithRecallGlobalScene: ', result);
						})
						.catch(err => {
							this.log('could not send onWithRecallGlobalScene');
							this.log(err);
						});
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
					this.node.endpoints[0].clusters.genOnOff.do('offWithEffect', { effectid: 0, effectvariant: 0 })
						.then(result => {
							this.log('offWithEffect: ', result);
						})
						.catch(err => {
							this.log('could not send offWithEffect');
							this.log(err);
						});
					this.node.endpoints[0].clusters.genOnOff.do('off', {})
						.then(result => {
							this.log('off: ', result);
						})
						.catch(err => {
							this.log('could not set to off');
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

		this.registerCapability('dim', 'genLevelCtrl', {
			set: 'moveToLevel',
			setParser(value) {
				if (value === 0) {
					return this.triggerCapabilityListener('onoff', false)
						.then(() => null)
						.catch(err => new Error('failed_to_trigger_onoff'));
				}
				return {
					level: Math.round(value * maxDim),
					transtime: this.getSetting('transition_time') ? Math.round(this.getSetting('transition_time') * 10) : 0,
				};
			},
			get: 'currentLevel',
			reportParser(value) {
				return value / maxDim;
			},
			report: 'currentLevel',
			getOpts: {
				getOnStart: true,
			},
		});

		/*
		if (this.hasCapability('dim')) {
			this.registerCapability('dim', 'genLevelCtrl', {
				getOpts: {
					getOnStart: true,
				},
			});
		} */

	}

}

module.exports = DimmablePuck;

// offWithEffect	server	["effectid","effectvariant"]
// onWithRecallGlobalScene	server	[]
