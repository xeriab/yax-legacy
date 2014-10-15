/**
 * YAX Stack [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, $ */

(function () {

	//---

	'use strict';

	$.fn.end = function () {
		return this.prev || $();
	};

	$.fn.andSelf = function () {
		return this.add(this.prev || $());
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
		var callback = $.fn[property];

		$.fn[property] = function () {
			var ret = callback.apply(this, arguments);
			ret.prev = this;
			return ret;
		};
	});

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/Stack.js

//---