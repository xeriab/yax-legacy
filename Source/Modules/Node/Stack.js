/**
 * YAX Node | Stack
 *
 * Cross browser stack implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

//---

(function () {

	'use strict';

	Y.DOM.Function.end = function () {
		return this.prev || Y.DOM();
	};

	Y.DOM.Function.andSelf = function () {
		return this.add(this.prev || Y.DOM());
	};

	//---

	[
		'filter',
		'add',
		'not',
		'eq',
		'first',
		'last',
		'find',
		'closest',
		'parents',
		'parent',
		'children',
		'siblings'
	].forEach(function (property) {
		var callback = Y.DOM.Function[property];

		Y.DOM.Function[property] = function () {
			var ret = callback.apply(this, arguments);
			ret.prev = this;
			return ret;
		};
	});

	//---

}());

//---
