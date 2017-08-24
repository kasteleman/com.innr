'use strict';

const ZigBeeLightDevice = require('homey-meshdriver').ZigBeeLightDevice;

const defaultIcon = 'icon.svg';
const iconsMap = {
	'RB 162': defaultIcon,
	'RB 165': defaultIcon,
	'RB 175 W': defaultIcon,
	'RS 122': 'GU10SPOT',
	'RS 125': 'GU10SPOT',
	'DL 110 N': 'SPOT',
	'DL 110 W': 'SPOT',
	'SL 110 N': 'SPOTFLEX',
	'SL 110 M': 'SPOTFLEX',
	'SL 110 W': 'LLC010FLEX',
	'PL 110': 'PUCKLIGHT',
};

class DimmableBulb extends ZigBeeLightDevice {
	onMeshInit() {
		super.onMeshInit();
		this.printNode();
		/* this.node.endpoints[0].clusters.genBasic.read('modelId')
    .then(result => {
			console.log(`${result}`);
			if (typeof iconsMap[result] === 'string') {
				this.node.deviceCapabilities.icon = `/icons/${iconsMap[result]}.svg`;
			}
    })
    .catch(err => {
			console.log('could not read modelId');
    }); */
	}
}

module.exports = DimmableBulb;
