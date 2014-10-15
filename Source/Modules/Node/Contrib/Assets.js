/**
 * YAX iOS Assets [DOM/NODE]
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

	var cache = [], timeout;

	$.fn.remove = function () {
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

// FILE: ./Source/Modules/Node/Contrib/Assets.js

//---