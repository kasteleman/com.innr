# INNR Zigbee

This app allows you to connect your INNR Devices to Homey

# Supported Devices

* RS 122 GU10 Spot For your recessed spotlights
* RB 175 W Tunable White Bulb
* RB 162
* RB 185 C RGBW Bulb
* SP 110 Smart Plug. Metering not supported!
* RC 110 Remote

# Untested Devices

* RB 165
* DL 110 N
* DL 110 W
* SL 110 N
* SL 110 M
* SL 110 W
* UC 110
* FL 110
* PL 110
* ST 110

# Remarks

* INNR Remote.

Pairing takes time and the message shows you have to put the device into pairing.
But leave it as is, the pairing goes on a few moments later.

Flows are work in progress and program buttons are not (yet) supported! Only with the slider in LIGHTS position, button -, + and on/off can be used with button 1-6. For example: put the slider into LIGHTS stand. Push shortly a num button followed by -, + or on/off. Long press -, + is also supported and are present as tokens within flows.
Available tokens:

Button (number): 1, 2, 3, 4, 5, 6
Type (string): "- short", "+ short", on, off, "- long", "+ long", stop

Slider on the remote in SCENES position, commands are broadcasted and applied to group 0. If i stand correct, this applies to all ZigBee devices, but could not test it, because i have no other ZigBee brands in use with Homey.

Feedback, suggestions welcome!

# Version 1.0.1

Added RS 128 T (not yet tested) tunable GU10

SP 110 Removed polling of device. Added attribute report configuration instead with max report interval of 300 seconds
