/**
 * YAX Shake Event [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, DeviceMotionEvent */

(function () {

	//---

	'use strict';

	/** @namespace window.DeviceMotionEvent */
	if (!Y.isUndefined(window.DeviceMotionEvent)) {
		Y.DOM.Function.onshake = function (callb, sens) {
			// Shake sensitivity (a lower number is more sensitive)
			var sensitivity = sens || 20,
				checkDelay = 150,
				callbackDelay = 2500,
				// Position variables
				x1 = 0,
				y1 = 0,
				z1 = 0,
				x2 = 0,
				y2 = 0,
				z2 = 0,
				checkDeviceMotion = function () {
					var change = Math.abs((x1 - x2) + (y1 - y2) + (z1 - z2));

					// Update new position
					x2 = x1;
					y2 = y1;
					z2 = z1;

					if (change > sensitivity) {
						callb.call(window);
						setTimeout(checkDeviceMotion, callbackDelay);
					} else {
						setTimeout(checkDeviceMotion, checkDelay);
					}
				};

			// Listen to motion events and update the position
			window.addEventListener('devicemotion', function (e) {
				/** @namespace e.accelerationIncludingGravity */
				x1 = e.accelerationIncludingGravity.x;
				y1 = e.accelerationIncludingGravity.y;
				/** @namespace e.accelerationIncludingGravity.z */
				z1 = e.accelerationIncludingGravity.z;
			}, false);

			// Periodically check the position and fire
			// if the change is greater than the sensitivity
			checkDeviceMotion();
		};
	} else {
		Y.DOM.Function.onshake = Y.noop;
	}

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/EventShake.js

//---