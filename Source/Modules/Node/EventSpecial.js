/**
 * YAX Node | Special Event
 *
 * Cross browser special event implementation using YAX's API [Node]
 *
 * @version     0.15
 * @depends:    Core, Node, Events
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

	//---

	Y.DOM.Function.bind = function (eventName, data, callback) {
		var el = this;
		// var $this = Y.DOM(el);
		var specialEvent;

		if (!Y.Lang.isSet(callback)) {
			callback = data;
			data = null;
		}

		if (Y.DOM.YAXDOM) {
			Y.DOM.each(eventName.split(/\s/), function (i, eventName) {
				eventName = eventName.split(/\./)[0];

				var tmp = Y.HasOwnProperty.call(Y.DOM.Event.special, eventName);

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

							args[0] = Y.Extend({}, args[0]);

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

					//Y.LOG(el);
					//Y.LOG(data);
					//Y.LOG(specialEvent);
					//Y.LOG(eventName);
					//Y.LOG(eventName);

					/// setup special events on Y.DOM
					// specialEvent.setup.apply(el, [data]);
					specialEvent.setup.apply(el, [data]);
				}
			});
		}

		// Y.LOG(bindBeforeSpecialEvents);
//		Y.LOG(callback);

		// return bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.Window.bindBeforeSpecialEvents.apply(this, [eventName, callback]);
		// return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
		return Y.DOM.Function.bindEvent.apply(this, [eventName, callback]);
	};

	//---

}());

//---
