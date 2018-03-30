# INNR Zigbee

This app allows you to connect your INNR Devices to Homey

# Version 1.0.8

* Added "BY XXX" models
* Added the RGBW LED Strip FL 130 C

# Remarks

* INNR Remote.

Pairing takes time and the message shows you have to put the device into pairing.
But leave it as is, the pairing goes on a few moments later.

Flows are work in progress and program buttons are not (yet) supported! Only with the slider in LIGHTS position, button -, + and on/off can be used with button 1-6. For example: put the slider into LIGHTS stand. Push shortly a num button followed by -, + or on/off. Long press -, + is also supported and are present as tokens within flows.
Available tokens:

Button (number): 1, 2, 3, 4, 5, 6
Type (string): "- short", "+ short", on, off, "- long", "+ long", stop

Slider on the remote in SCENES position, commands are broadcasted and applied to group 0. If i stand correct, this applies to all ZigBee devices, but could not test it, because i have no other ZigBee brands in use with Homey.

## Feedback:

Any requests please contact me on [Slack](https://athomcommunity.slack.com/team/kasteleman)    
Please report issues at the [issues section on Github](https://github.com/kasteleman/com.innr/issues)
