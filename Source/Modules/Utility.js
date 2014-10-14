/**
 * YAX Utilities and Tools [DOM/NODE]
 */

/*jslint indent: 4 */
/*jshint unused: false */
/*jslint browser: true */
/*jslint white: true */
/*jslint node: true */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	var lastTime = 0,
		requestFunction,
		cancelFunction;

	// Inspired by http://paulirish.com/2011/requestanimationframe-for-smart-animating/
	function getPrefixed(name) {
		return window['webkit' + name] || window['moz' + name] || window['ms' + name];
	}

	// Fallback for IE 7-8
	function timeoutDefer(func) {
		var time = +new Date(),
			timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;

		return window.setTimeout(func, timeToCall);
	}

	requestFunction = window.requestAnimationFrame ||
		getPrefixed('RequestAnimationFrame') ||
		timeoutDefer;

	// cancelFunction = window.cancelAnimationFrame ||
	// cancelFunction = window.cancelRequestAnimationFrame ||
	cancelFunction = Y.callProperty(window, 'cancelAnimationFrame') ||
		getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') ||

		function (id) {
			window.clearTimeout(id);
		};

	Y.Util.requestAnimationFrame = function (func, context, immediate, element) {
		if (immediate && requestFunction === timeoutDefer) {
			func.call(context);
		} else {
			return requestFunction.call(window, Y.Bind(func, context), element);
		}
	};

	Y.Util.cancelAnimationFrame = function (id) {
		if (id) {
			cancelFunction.call(window, id);
		}
	};

	//---

}());

// FILE: ./Source/Modules/Utility.js

//---