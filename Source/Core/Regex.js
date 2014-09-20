/**
 * YAX Core | RegEx
 *
 * Another YAX's RegEx tools and shortcuts [CORE]
 *
 * @version     0.15
 * @depends:    Core, Global, Utility, Class
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

	Y.RegEx = {
		scriptReplacement: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

		scriptTypeReplacement: /^(?:text|application)\/javascript/i,

		xmlTypeReplacement: /^(?:text|application)\/xml/i,

		jsonTypeReplacement: /^(?:text|application)\/json/i,

		jsonType: 'application/json, text/json',

		htmlType: 'text/html',

		blankReplacement: /^\s*$/,

		FragmentReplacement: /^\s*<(\w+|!)[^>]*>/,

		SingleTagReplacement: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		TagExpanderReplacement:
			/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		ReadyReplacement: /complete|loaded|interactive/,

		//SimpleSelectorReplacement = /^[\w-]*$/,
		SimpleSelectorReplacement: /^[\w\-]*$/,

		RootNodeReplacement: /^(?:body|html)$/i
	};

	Y.RegEx.toString = function () {
		return '[YAX.js RegEx]';
	};

	//---

}());

//---
