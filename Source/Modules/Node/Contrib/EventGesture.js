/**
 * YAX Gesture Event [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	var gesture = {}, gestureTimeout = Y.noop;

	function parentIfText (node) {
		return node.hasOwnProperty('tagName') ? node : node.parentNode;
	}

	if (Y.UA.features.OS.osx) {
		Y.DOM(document).bind('gesturestart', function (event) {
			var now = Y.now();
			// var delta = now - (gesture.last || now);
			gesture.target = parentIfText(event.target);

			if (gestureTimeout) {
				clearTimeout(gestureTimeout);
			}

			gesture.e1 = event.scale;

			gesture.last = now;
		}).bind('gesturechange', function (event) {
			gesture.e2 = event.scale;
		}).bind('gestureend', function () {
			if (gesture.e2 > 0) {
				if (Math.abs(gesture.e1 - gesture.e2) !== 0 &&
				Y.DOM(gesture.target).trigger('pinch') &&
				Y.DOM(gesture.target).trigger('pinch' + (gesture.e1 - gesture.e2 > 0 ? 'In' : 'Out'))) {
					gesture.e1 = gesture.e2 = gesture.last = 0;
				}
			} else if (gesture.hasOwnProperty('last')) {
				gesture = {};
			}
		});

		//---

		[
			'pinc',
			'pinchIn',
			'pinchOut'
		].forEach(function (event) {
			Y.DOM.Function[event] = function (callback) {
				return this.bind(event, callback);
			};
		});
	}

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/EventGesture.js

//---