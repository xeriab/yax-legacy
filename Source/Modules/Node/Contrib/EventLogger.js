/**
 * YAX Events Logger [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jshint -W040 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	function consoleOutput(e) {
		if (e.data.color) {
			var style = 'color:' + e.data.color;
			Y.LOG('%c' + e.type + ' on ' + this.tagName, style);
		} else {
			Y.LOG(e.type + ' on ' + this.tagName);
		}
	}

	function getCollectionObj(selector) {
		var obj = {};
		switch (typeof selector) {
			case 'string':
				obj = Y.DOM(selector);
				break;
			case 'object':
				obj = selector;
				break;
		}
		return obj;
	}

	Y.DOM.Function.EventLoggerStart = function (event, color) {
		var fontColor = Y.isString(color) ? color : '';

		this.on(event, {color: fontColor}, consoleOutput);

		return this;
	};

	Y.DOM.Function.EventLoggerEnd = function (event) {
		this.off(event, consoleOutput);

		return this;
	};

	window.EventLogger = {
		start: function (selector, event, color) {
			var fontColor = Y.isString(color) ? color : '';

			var obj = getCollectionObj(selector);

			obj.on(event, {
				color: fontColor
			}, consoleOutput);

			return obj;
		},
		end: function (selector, event) {
			var obj = getCollectionObj(selector);

			obj.off(event, consoleOutput);

			return obj;
		}
	};

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/EventLogger.js

//---