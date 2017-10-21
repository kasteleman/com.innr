'use strict';

const ZigBeeDevice = require('homey-meshdriver').ZigBeeDevice;

class SmartPlug extends ZigBeeDevice {
	onMeshInit() {

		// Report is send if status is changed or after 5 min
		this.registerAttrReportListener('genOnOff', 'onOff', 1, 300, 1, data => {
			this.log('onOff', data);
			this.setCapabilityValue('onoff', data === 1);
		}, 0);

		if (this.hasCapability('onoff')) {
			this.registerCapability('onoff', 'genOnOff', {
				getOpts: {
					getOnStart: true,
				},
			});
		}
	}
}

module.exports = SmartPlug;
