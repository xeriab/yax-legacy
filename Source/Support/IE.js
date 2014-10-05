/**
 * YAX.DOM IE Support
 *
 * Add support for Internet Explorer 10+ on desktop and Windows Phone 8.
 *
 * @version     0.20
 * @depends:    Core, DOM
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	'use strict';

	// __proto__ doesn't exist on IE < 11, so redefine
	// the Y.DOM.YAXDOM.Y function to use object extension instead

	if (!('__proto__' in {})) {
		Y.extend(Y.DOM.YAXDOM, {
			Y: function(dom, selector) {
				dom = dom || [];

				Y.extend(dom, Y.DOM.Function);

				dom.selector = selector || '';

				dom.__Y = true;

				return dom;
			},

			// this is a kludge but works
			isY: function(object) {
				return Y.Lang.type(object) === 'array' && '__Y' in object;
			}
		});
	}

	//---

}());

//---
