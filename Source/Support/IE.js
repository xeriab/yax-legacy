/**
 * YAX IE10+ Support [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	//---

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
				return Y.type(object) === 'array' && '__Y' in object;
			}
		});
	}

	//---

}());

// FILE: ./Source/Support/IE.js

//---
