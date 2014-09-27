/**
 * YAX Node | Extra
 *
 * Cross browser extra functions using YAX's API [Node]
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
/*global YAX, Y, transitionProperty, transitionDuration, transitionTiming*/

(function () {

	'use strict';

	// YAX Timers
	Y.Extend(Y.DOM.Function, {
		everyTime: function (interval, label, fn, times, belay) {
			//console.log(this);
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, fn, times, belay);
			});
		},
		oneTime: function (interval, label, fn) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, fn, 1);
			});
		},
		stopTime: function (label, fn) {
			return this.each(function () {
				Y.DOM.timer.remove(this, label, fn);
			});
		}
	});

	Y.Extend(Y.DOM, {
		timer: {
			GUID: 1,
			global: {},
			regex: /^([0-9]+)\s*(.*s)?$/,
			powers: {
				// Yeah this is major overkill...
				'ms': 1,
				'cs': 10,
				'ds': 100,
				's': 1000,
				'das': 10000,
				'hs': 100000,
				'ks': 1000000
			},
			timeParse: function (value) {
				var num, mult, result;

				if (value === undefined || value === null) {
					return null;
				}

				result = this.regex.exec(Y.Lang.trim(value.toString()));

				if (result[2]) {
					num = parseInt(result[1], 10);
					mult = this.powers[result[2]] || 1;
					return num * mult;
				}

				return value;
			},
			add: function (element, interval, label, fn, times, belay) {
				var counter = 0,
					handler;

				if (Y.Lang.isFunction(label)) {
					if (!times) {
						times = fn;
					}
					fn = label;
					label = interval;
				}

				interval = Y.DOM.timer.timeParse(interval);

				if (typeof interval !== 'number' ||
					isNaN(interval) ||
					interval <= 0) {
					return;
				}
				if (times && times.constructor !== Number) {
					belay = !!times;
					times = 0;
				}

				times = times || 0;
				belay = belay || false;

				if (!element.$timers) {
					element.$timers = {};
				}
				if (!element.$timers[label]) {
					element.$timers[label] = {};
				}
				fn.$timerID = fn.$timerID || this.GUID++;

				handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						fn.call(element, counter) === false) {
						Y.DOM.timer.remove(element, label, fn);
					}
					handler.inProgress = false;
				};

				handler.$timerID = fn.$timerID;

				if (!element.$timers[label][fn.$timerID]) {
					element.$timers[label][fn.$timerID] = window.setInterval(handler,
						interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},
			remove: function (element, label, fn) {
				var timers = element.$timers,
					ret, lab, _fn;

				if (timers) {

					if (!label) {
						for (lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, fn);
							}
						}
					} else if (timers[label]) {
						if (fn) {
							if (fn.$timerID) {
								window.clearInterval(timers[label][fn.$timerID]);
								delete timers[label][fn.$timerID];
							}
						} else {
							for (_fn in timers[label]) {
								if (timers[label].hasOwnProperty(_fn)) {
									window.clearInterval(timers[label][_fn]);
									delete timers[label][_fn];
								}
							}
						}

						for (ret in timers[label]) {
							if (timers[label].hasOwnProperty(ret)) {
								break;
							}
						}
						if (!ret) {
							/*jshint unused: true */
							// ret = null;
							delete timers[label];
						}
					}

					for (ret in timers) {
						if (timers.hasOwnProperty(ret)) {
							//if (Y.HasOwnProperty.call(timers, ret)) {
							break;
						}
					}

					if (!ret) {
						element.$timers = null;
					}
				}
			}
		}
	});

	var prefix = Y.DOM.fx.cssPrefix;
	var transitionEnd = Y.DOM.fx.transitionEnd;
	var cssReset = Object.create({});

	var transitionProperty;
	var transitionDuration;
	var transitionTiming;

	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] = '';

	Y.DOM.Function.stopTranAnim = function (jumpToEnd, cancelCallback) {
		var props;
		var style;
		// var cssValues = {};
		var x;

		props = this.css(prefix + 'transition-property').split(', ');

		if (!props.length) {
			return this;
		}

		if (!jumpToEnd) {
			// style = Y.Document.defaultView.getComputedStyle(this.get(0), '');
			style = Y.DOM.getDocStyles(this.get(0));

			for (x = 0; x < props.length; x++) {
				this.css(props[x], style.getPropertyValue(props[x]));
			}
		}

		if (cancelCallback) {
			this.unbind(transitionEnd).css(cssReset);
		} else {
			this.trigger(transitionEnd);
		}

		return this;
	};

	//---

	Y.Extend(Y.DOM.Function, {
		cycleNext: function () {
			if (this.next().length > 0) {
				return this.next();
			}

			return this.siblings().first();
		},

		cyclePrev: function () {
			if (this.prev().length > 0) {
				return this.prev();
			}

			return this.siblings().last();
		}
	});

	//---

	Y.Extend(Y.DOM.Function, {
		role: function () {
			var args = Y.G.Slice.call(arguments);
			var data;

			if (args[0] === undefined || args[0] === null) {
				data = this.attr('role');
			} else {
				data = this.attr('role', args[0]);
			}

			return data;
		}
	});

	//---

}());

//---