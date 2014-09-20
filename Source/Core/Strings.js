/**
 * Y Core | Store
 *
 * Powers Y's with store capability [CORE]
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
/*global Y, YAX */

(function () {

	'use strict';

	Y.Extend(Y.Lang, {
		lowerCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toLowerCase();

			return t + string.substr(1);
		},

		upperCaseFirst: function (string) {
			string += this.empty();

			var t = string.charAt(0).toUpperCase();

			return t + string.substr(1);
		},

		upperCaseWords: function (string) {
			return (string + this.empty()).replace(/^([a-z\u00E0-\u00FC])|\s+([a-z\u00E0-\u00FC])/g, function ($1) {
				return $1.toUpperCase();
			});
		}
	});

	//---

}());

//---
