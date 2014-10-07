/**
 * YAX Special Events [DOM/NODE]
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

	Y.DOM.Function.bind = function (eventName, data, callback) {
		var el = this;
		// var $this = Y.DOM(el);
		var specialEvent;

		if (!Y.isSet(callback)) {
			callback = data;
			data = null;
		}

		if (Y.DOM.YAXDOM) {
			Y.DOM.each(eventName.split(/\s/), function (i, eventName) {
				eventName = eventName.split(/\./)[0];

				var tmp = Y.hasOwn.call(Y.DOM.event.special, eventName);

				if (tmp) {
					specialEvent = Y.DOM.event.special[eventName];

					/// init enable special events on Y.DOM
					if (!specialEvent._init) {
						specialEvent._init = true;

						/// intercept and replace the special event handler to add functionality
						specialEvent.originalHandler = specialEvent.handler;

						specialEvent.handler = function () {
							/// make event argument writable, like on jQuery
							var args = Y.G.Slice.call(arguments);

							args[0] = Y.extend({}, args[0]);

							/// define the event handle, Y.DOM.event.dispatch is only for newer versions of jQuery
							Y.DOM.Event.handle = function () {
								/// make context of trigger the event element
								var args_ = Y.G.Slice.call(arguments);
								var event = args_[0];
								var $target = Y.DOM(event.target);

								$target.trigger.apply($target, arguments);

							};

							specialEvent.originalHandler.apply(this, args);
						};
					}

					//Y.log(el);
					//Y.log(data);
					//Y.log(specialEvent);
					//Y.log(eventName);
					//Y.log(eventName);

					/// setup special events on Y.DOM
					// specialEvent.setup.apply(el, [data]);
					specialEvent.setup.apply(el, [data]);
				}
			});
		}

		// Y.log(bindBeforeSpecialEvents);
//		Y.log(callback);

		// return bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.win.bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
		return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
	};

	//---

}());

// FILE: ./Source/Modules/Node/Contrib/EventSpecial.js

//---