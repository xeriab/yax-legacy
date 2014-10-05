/**
 * Y Core | Parsers
 *
 * Powers Y's with Parsers capability [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, Y, XMLSerializer, DOMParser, ActiveX */

(function () {

	'use strict';

	Y.Parser = Y.Class.extend({
		STATICS: {
			// FOO: 'FOOED!!'
		},

		CLASS_NAME: 'Parser',

		drivers: {},

		construct: function () {
			var args = Y.G.Slice.call(arguments),
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

//---
