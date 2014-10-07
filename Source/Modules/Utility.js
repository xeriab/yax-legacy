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
		return Y.win['webkit' + name] || Y.win['moz' + name] || Y.win['ms' + name];
	}

	// Fallback for IE 7-8
	function timeoutDefer(func) {
		var time = +new Date(),
			timeToCall = Math.max(0, 16 - (time - lastTime));

		lastTime = time + timeToCall;

		return Y.win.setTimeout(func, timeToCall);
	}

	requestFunction = Y.win.requestAnimationFrame ||
		getPrefixed('RequestAnimationFrame') ||
		timeoutDefer;

	// cancelFunction = window.cancelAnimationFrame ||
	// cancelFunction = window.cancelRequestAnimationFrame ||
	cancelFunction = Y.callProperty(Y.win, 'cancelAnimationFrame') ||
		getPrefixed('CancelAnimationFrame') ||
		getPrefixed('CancelRequestAnimationFrame') ||

		function (id) {
			Y.win.clearTimeout(id);
		};

	Y.Util.requestAnimationFrame = function (func, context, immediate, element) {
		if (immediate && requestFunction === timeoutDefer) {
			func.call(context);
		} else {
			return requestFunction.call(Y.win, Y.Bind(func, context), element);
		}
	};

	Y.Util.cancelAnimationFrame = function (id) {
		if (id) {
			cancelFunction.call(Y.win, id);
		}
	};

	//---

}());

// FILE: ./Source/Modules/Utility.js

//---