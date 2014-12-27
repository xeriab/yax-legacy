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

	function consoleOutput (event) {
		if (event.data.color) {
			var style = 'color:' + event.data.color;
			Y.LOG('%c' + event.type + ' on ' + this.tagName, style);
		} else {
			Y.LOG(event.type + ' on ' + this.tagName);
		}
	}

	function getCollectionObj (selector) {
		var object = {};
		
		/*switch (typeof selector) {
			case 'string':
				obj = Y.DOM(selector);
				break;
			case 'object':
				obj = selector;
				break;
		}*/

		switch (Y.typeOf(selector)) {
			case 'string':
				object = Y.DOM(selector);
				break;

			case 'object':
				object = selector;
				break;
		}
		
		return object;
	}

	Y.DOM.Function.eventLoggerStart = function (event, color) {
		var fontColor = Y.isString(color) ? color : Y.empty;

		this.on(event, {
			color: fontColor
		}, consoleOutput);

		return this;
	};

	Y.DOM.Function.eventLoggerEnd = function (event) {
		this.off(event, consoleOutput);

		return this;
	};

	window.eventLogger = {
		start: function (selector, event, color) {
			var fontColor = Y.isString(color) ? color : Y.empty;

			var object = getCollectionObj(selector);

			object.on(event, {
				color: fontColor
			}, consoleOutput);

			return object;
		},

		end: function (selector, event) {
			var object = getCollectionObj(selector);

			object.off(event, consoleOutput);

			return object;
		}
	};

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/EventLogger.js

//---