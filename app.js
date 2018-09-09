'use strict';

const Homey = require('homey');

class INNRZigbeeApp extends Homey.App {
	onInit() {
		this.log('init');
	}
}

module.exports = INNRZigbeeApp;