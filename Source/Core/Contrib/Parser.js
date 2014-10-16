/**
 * YAX Parser Class [Contrib]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function () {

	//---

	'use strict';

	Y.Parser = Y.Class.extend({
		_class_name: 'Parser',

		drivers: {},

		_init: function () {
			var args = Y.G.slice.call(arguments),
				len = args.length,
				x = 0;

			if (len === 1) {
				Y.extend(this, this.drivers[args[0]]);
			} else if (len > 1) {
				for (x; x < len; x++) {
					this[args[x]] = this.drivers[args[x]];
				}
			} else {
				Y.extend(this, this.drivers);
			}
		}
	});

	//---

	//	Y.Parsers = Y.Parser.prototype.drivers;

	//---

}());

// FILE: ./Source/Core/Contrib/Parser.js

//---