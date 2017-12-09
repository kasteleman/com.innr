'use strict';

const maxDim = 254;

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class DimmableSpot extends ZigBeeDevice {

	onMeshInit() {

		// write onLevel
		this.node.endpoints[0].clusters.genLevelCtrl.write('onLevel', 1)
			.then(result => {
				this.log('onLevel: ', result);
			})
			.catch(err => {
				this.log('could not write onLevel');
				this.log(err);
			});

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
				const transitionTime = this.getSetting('transition_time') ? Math.round(this.getSetting('transition_time') * 10) : 0;
				// this.log('transitionTime: ', transitionTime);
				const wantedLevel = Math.round(value * maxDim);
				// this.log('wantedLevel: ', wantedLevel);
				if (value === 0) {
					this.node.endpoints[0].clusters.genOnOff.do('off', {})
						.then(result => {
							this.log('off: ', result);
						})
						.catch(err => {
							this.log('could not send off');
							this.log(err);
						});
				} else if (this.getCapabilityValue('onoff') === false && value > 0) {
					this.node.endpoints[0].clusters.genOnOff.do('on', {})
						.then(result => {
							this.log('on: ', result);
							this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: wantedLevel, transtime: 1 });
							this.setCapabilityValue('onoff', true);
							return null;
						})
						.catch(err => {
							this.log('could not send on');
							this.log(err);
						});
				}

				this.node.endpoints[0].clusters.genLevelCtrl.do('moveToLevel', { level: wantedLevel, transtime: 1 });
				this.setCapabilityValue('onoff', true);
				return null;

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

	}

}

module.exports = DimmableSpot;
