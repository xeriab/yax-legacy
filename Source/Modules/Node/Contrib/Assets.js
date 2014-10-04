/**
 * YAX Node | Assets
 *
 * Cross browser assets implementation using YAX's API [Node]
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

	var cache = [], timeout;

	Y.DOM.Function.remove = function () {
		return this.each(function () {
			if (this.parentNode) {
				if (this.tagName === 'IMG') {
					cache.push(this);

					this.src = Y.Util.emptyImageUrl;

					if (timeout) {
						clearTimeout(timeout);
					}

					timeout = setTimeout(function () {
						cache = [];
					}, 60000);
				}

				// this.parentNode.removeChild(this);
				this.parentNode.removeChild(this);
			}
		});
	};

	//---

}());

//---
