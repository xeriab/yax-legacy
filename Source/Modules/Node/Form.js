/**
 * YAX Form [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	Y.DOM.Function.serialiseArray = function () {
		var result = [], el, type;

		Y.DOM([].slice.call(this.get(0).elements)).each(function () {
			el = Y.DOM(this);

			type = el.attr('type');

			if (this.nodeName.toLowerCase() !== 'fieldset' &&
				!this.disabled && type !== 'submit' && type !== 'reset' &&
				type !== 'button' && ((type !== 'radio' && type !== 'checkbox') || this.checked)) {
				result.push({
					name: el.attr('name'),
					value: el.val()
				});
			}
		});

		return result;
	};

	Y.DOM.Function.serialise = function () {
		var result = [];

		this.serialiseArray().forEach(function (elm) {
			result.push(encodeURIComponent(elm.name) + '=' + encodeURIComponent(elm.value));
		});

		return result.join('&');
	};

	Y.DOM.Function.submit = function (callback) {
		if (callback) {
			this.bind('submit', callback);
		} else if (this.length) {
			var event = Y.DOM.Event('submit');

			this.eq(0).trigger(event);

			if (!event.defaultPrevented) {
				this.get(0).submit();
			}
		}

		return this;
	};

	//---

}());

// FILE: ./Source/Modules/Node/Form.js

//---