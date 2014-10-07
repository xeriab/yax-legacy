/**
 * YAX Extra Stuff [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, transitionProperty, transitionDuration, transitionTiming*/

(function () {

	//---

	'use strict';

	Y.DOM.extend({
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

				result = this.regex.exec(Y.trim(value.toString()));

				if (result[2]) {
					num = parseInt(result[1], 10);
					mult = this.powers[result[2]] || 1;
					return num * mult;
				}

				return value;
			},

			add: function (element, interval, label, callback, times, belay) {
				var counter = 0,
					handler;

				if (Y.isFunction(label)) {
					if (!times) {
						times = callback;
					}
					callback = label;
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

				callback.$timerID = callback.$timerID || this.GUID++;

				handler = function () {
					if (belay && handler.inProgress) {
						return;
					}
					handler.inProgress = true;
					if ((++counter > times && times !== 0) ||
						callback.call(element, counter) === false) {
						Y.DOM.timer.remove(element, label, callback);
					}
					handler.inProgress = false;
				};

				handler.$timerID = callback.$timerID;

				if (!element.$timers[label][callback.$timerID]) {
					element.$timers[label][callback.$timerID] = Y.win.setInterval(handler,
						interval);
				}

				if (!this.global[label]) {
					this.global[label] = [];
				}
				this.global[label].push(element);

			},

			remove: function (element, label, callback) {
				var timers = element.$timers,
					ret, lab, _fn;

				if (timers) {

					if (!label) {
						for (lab in timers) {
							if (timers.hasOwnProperty(lab)) {
								this.remove(element, lab, callback);
							}
						}
					} else if (timers[label]) {
						if (callback) {
							if (callback.$timerID) {
								window.clearInterval(timers[label][callback.$timerID]);
								delete timers[label][callback.$timerID];
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
							//if (Y.hasOwn.call(timers, ret)) {
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

	// YAX Timers
	Y.DOM.Function.extend({
		everyTime: function (interval, label, callback, times, belay) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, callback, times, belay);
			});
		},
		
		oneTime: function (interval, label, callback) {
			return this.each(function () {
				Y.DOM.timer.add(this, interval, label, callback, 1);
			});
		},
		
		stopTime: function (label, callback) {
			return this.each(function () {
				Y.DOM.timer.remove(this, label, callback);
			});
		}
	});

	//---

	Y.extend(Y.DOM.Function, {
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

	Y.extend(Y.DOM.Function, {
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

// FILE: ./Source/Modules/Node/Extra.js

//---