This app allows you to connect your INNR Devices to Homey

Supported Devices:

RB 285 C, BY 285 C
RB 265, BY 265
RB 250 C,
RF 261
RF 263, BF 263
RF 264,
RF 265, BF 265
SP 110, SP 120, SP 222, SP 220
RB 185 C, BY 185 C
FL 130 C
RB 162, RB 165, RB 175 W, BY 165
RB 145, B 245
RS 125, RS 122, RS 225
RS 128 T, RS 228 T, RS 229 T
RS 230 C
BY 178 T, RB 178 T, RB 278 T
RB 148 T, RB 248 T
PL 110, PL 115
RSL 110
DL 110 N, DL 110 W, SL 110 N, SL 110 M, SL 110 W
UC 110, FL 110, ST 110
RC 110

Version 1.1.16

SP 220 Added

Version 1.1.14

PL 115, RS 229 T added

Version 1.1.13

RF 261, RF 264 added

Version 1.1.12

Initial RS 230 C RGBW GU10

Version 1.1.11

Initial SP 222 Support

Version 1.1.10

Fixed transitiontime for dimmable devices

Added onOffTransitionTime in device settings for filament bulbs

Version 1.1.9

Added Zigbee 3.0 RF 263, BF 263 Smart filament bulb vintage

Added Zigbee 3.0 RF 265, BF 265 Smart filament bulb white

Version 1.1.8

Added Zigbee 3.0 RB 250 C RGBW E14

Version 1.1.7

Readme corrected

Version 1.1.6

Added Zigbee 3.0 RB 278 T comfort E27

Add start dim-level change and stop dim-level change action for RSL 110


Version 1.1.5

Added RSL 110 Recessed Spot Light

Version 1.1.4

Added Zigbee 3.0 devices:

RS 225 white GU10
RS 228 T comfort GU10

Version 1.1.3

Add start dim-level change and stop dim-level change action cards for all applicable devices

Version 1.1.2

Added Zigbee 3.0 devices:

RB 265 Smart bulb white E27
BY 265 Smart bulb white B22
RB 245 Smart candle white E14
RB 248 T Smart candle comfort (tunable) E14

Added Dim duration

Version 1.1.1

Added Zigbee 3.0 devices RB 285 C, BY 285 C with attribute reporting for on/off and dim
Updated meshdriver

Version 1.1.0

Changed README

 Added SP 120

Remarks

 INNR Remote.

Pairing takes time and the message shows you have to put the device into pairing.
But leave it as is, the pairing goes on a few moments later.

Flows are work in progress and program buttons are not (yet) supported! Only with the slider in LIGHTS position, button -, + and on/off can be used with button 1-6. For example: put the slider into LIGHTS stand. Push shortly a num button followed by -, + or on/off. Long press -, + is also supported and are present as tokens within flows.
Available tokens:

Button (number): 1, 2, 3, 4, 5, 6
Type (string): "- short", "+ short", on, off, "- long", "+ long", stop

Slider on the remote in SCENES position, commands are broadcasted and applied to group 0. If i stand correct, this applies to all ZigBee devices, but could not test it, because i have no other ZigBee brands in use with Homey.

Feedback:

Any requests please contact me on Slack
Please report issues at the issues section on Github
