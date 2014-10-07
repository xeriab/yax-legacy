/**
 * YAX Effects [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function (undef) {

	//---

	'use strict';

	var prefix = '',
		eventPrefix = undef,
		vendors = {
			Webkit: 'webkit',
			Moz: 'Moz',
			O: 'o',
			ms: 'MS'
		},

		document = Y.doc,
		testEl = document.createElement('div'),
		supportedTransforms =
		/^((translate|rotate|scale)(X|Y|Z|3d)?|matrix(3d)?|perspective|skew(X|Y)?)$/i,
		transform,
		transitionProperty,
		transitionDuration,
		transitionTiming,
		transitionDelay,
		animationName,
		animationDuration,
		animationTiming,
		animationDelay,
		cssReset = {};

	//--

	function dasherize(str) {
		return str.replace(/([a-z])([A-Z])/, '$1-$2').toLowerCase();
	}

	function normalizeEvent(name) {
		return eventPrefix ? eventPrefix + name : name.toLowerCase();
	}

	Y.each(vendors, function (vendor, event) {
		if (testEl.style[vendor + 'TransitionProperty'] !== undef) {
			prefix = '-' + vendor.toLowerCase() + '-';
			eventPrefix = event;
			return false;
		}
	});

	transform = prefix + 'transform';

	cssReset[transitionProperty = prefix + 'transition-property'] =
		cssReset[transitionDuration = prefix + 'transition-duration'] =
		cssReset[transitionDelay = prefix + 'transition-delay'] =
		cssReset[transitionTiming = prefix + 'transition-timing-function'] =
		cssReset[animationName = prefix + 'animation-name'] =
		cssReset[animationDuration = prefix + 'animation-duration'] =
		cssReset[animationDelay = prefix + 'animation-delay'] =
		cssReset[animationTiming = prefix + 'animation-timing-function'] = '';

	/** @namespace testEl.style.transitionProperty */
	Y.DOM.fx = {
		off: (eventPrefix === undef && testEl.style.transitionProperty === undef),
		speeds: {
			_default: 400,
			fast: 200,
			slow: 600
		},
		cssPrefix: prefix,
		transitionEnd: normalizeEvent('TransitionEnd'),
		animationEnd: normalizeEvent('AnimationEnd')
	};

	Y.DOM.Function.animate = function (properties, duration, ease, callback,
		delay) {
		if (Y.isFunction(duration)) {
			callback = duration;
			ease = undef;
			duration = undef;
		}

		if (Y.isFunction(ease)) {
			callback = ease;
			ease = undef;
		}

		if (Y.isPlainObject(duration)) {
			/** @namespace duration.easing */
			ease = duration.easing;
			callback = duration.complete;
			delay = duration.delay;
			duration = duration.duration;
		}

		if (duration) {
			duration = (typeof duration === 'number' ? duration :
				(Y.DOM.fx.speeds[duration] || Y.DOM.fx.speeds._default)) / 1000;
		}

		if (delay) {
			delay = parseFloat(delay) / 1000;
		}

		return this.anim(properties, duration, ease, callback, delay);
	};

	Y.DOM.Function.anim = function (properties, duration, ease, callback, delay) {
		var key, cssValues = {},
			cssProperties, transforms = '',
			that = this,
			wrappedCallback, endEvent = Y.DOM.fx.transitionEnd,
			fired = false;

		if (duration === undef) {
			duration = Y.DOM.fx.speeds._default / 1000;
		}

		if (delay === undef) {
			delay = 0;
		}

		if (Y.DOM.fx.off) {
			duration = 0;
		}

		if (typeof properties === 'string') {
			// keyframe animation
			cssValues[animationName] = properties;
			cssValues[animationDuration] = duration + 's';
			cssValues[animationDelay] = delay + 's';
			cssValues[animationTiming] = (ease || 'linear');
			endEvent = Y.DOM.fx.animationEnd;
		} else {
			cssProperties = [];
			// CSS transitions
			for (key in properties) {
				if (properties.hasOwnProperty(key)) {
					if (supportedTransforms.test(key)) {
						transforms += key + '(' + properties[key] + ') ';
					} else {
						cssValues[key] = properties[key];
						cssProperties.push(dasherize(key));
					}
				}
			}

			if (transforms) {
				cssValues[transform] = transforms;
				cssProperties.push(transform);
			}

			if (duration > 0 && typeof properties === 'object') {
				cssValues[transitionProperty] = cssProperties.join(', ');
				cssValues[transitionDuration] = duration + 's';
				cssValues[transitionDelay] = delay + 's';
				cssValues[transitionTiming] = (ease || 'linear');
			}
		}

		wrappedCallback = function (event) {
			if (!Y.isUndefined(event)) {
				// makes sure the event didn't bubble from 'below'
				if (event.target !== event.currentTarget) {
					return;
				}

				Y.DOM(event.target).unbind(endEvent, wrappedCallback);
			} else {
				// triggered by setTimeout
				Y.DOM(this).unbind(endEvent, wrappedCallback);
			}

			fired = true;

			Y.DOM(this).css(cssReset);

			if (callback) {
				callback.call(this);
			}

			// callback && callback.call(this);
		};

		if (duration > 0) {
			this.bind(endEvent, wrappedCallback);
			// transitionEnd is not always firing on older Android phones
			// so make sure it gets fired
			setTimeout(function () {

				if (fired) {
					return;
				}

				wrappedCallback.call(that);

			}, (duration * 1000) + 25);
		}


		// Trigger page reflow so new elements can animate
		if (this.size()) {
			/*jshint -W030 */
			this.get(0).clientLeft;
		}

		// this.size() && this.get(0).clientLeft;

		this.css(cssValues);

		if (duration <= 0) {
			setTimeout(function () {
				that.each(function () {
					wrappedCallback.call(this);
				});
			}, 0);
		}

		return this;
	};

	testEl = null;

	//---

	Y.extend(Y.DOM, {
		queue: function (elem, type, data) {
			var queue;

			if (elem) {
				type = (type || 'fx') + 'queue';
				queue = Y.DOM.dataPrivative.get(elem, type);

				// Speed up dequeue by getting out quickly if this is just a lookup
				if (data) {
					if (!queue || Y.isArray(data)) {
						queue = Y.DOM.dataPrivative.access(elem, type, Y.DOM.makeArray(data));
					} else {
						queue.push(data);
					}
				}
				return queue || [];
			}
		},

		dequeue: function (elem, type) {
			type = type || 'fx';

			var queue = Y.DOM.queue(elem, type),
				startLength = queue.length,
				fn = queue.shift(),
				hooks = Y.DOM._queueHooks(elem, type),
				next = function () {
					Y.DOM.dequeue(elem, type);
				};

			// If the fx queue is dequeued, always remove the progress sentinel
			if (fn === 'inprogress') {
				fn = queue.shift();
				startLength--;
			}

			if (fn) {

				// Add a progress sentinel to prevent the fx queue from being
				// automatically dequeued
				if (type === 'fx') {
					queue.unshift('inprogress');
				}

				// clear up the last queue stop function
				delete hooks.stop;
				fn.call(elem, next, hooks);
			}

			if (!startLength && hooks) {
				hooks.empty.fire();
			}
		},

		// not intended for public consumption - generates a queueHooks object, or returns the current one
		_queueHooks: function (elem, type) {
			var key = type + 'queueHooks';
			return Y.DOM.dataPrivative.get(elem, key) || Y.DOM.dataPrivative.access(
				elem, key, {
					empty: Y.G.Callbacks('once memory').add(function () {
						Y.DOM.dataPrivative.remove(elem, [type + 'queue', key]);
					})
				});
		}
	});

	//---

	Y.extend(Y.DOM.Function, {
		queue: function (type, data) {
			var setter = 2;

			if (typeof type !== 'string') {
				data = type;
				type = 'fx';
				setter--;
			}

			if (arguments.length < setter) {
				return Y.DOM.queue(this[0], type);
			}

			return data === undef ?
				this :
				this.each(function () {
					var queue = Y.DOM.queue(this, type, data);

					// ensure a hooks for this queue
					Y.DOM._queueHooks(this, type);

					if (type === 'fx' && queue[0] !== 'inprogress') {
						Y.DOM.dequeue(this, type);
					}
				});
		},
		dequeue: function (type) {
			return this.each(function () {
				Y.DOM.dequeue(this, type);
			});
		},
		// Based off of the plugin by Clint Helfers, with permission.
		// http://blindsignals.com/index.php/2009/07/jquery-delay/
		delay: function (time, type) {
			time = Y.DOM.fx ? Y.DOM.fx.speeds[time] || time : time;
			type = type || 'fx';

			return this.queue(type, function (next, hooks) {
				var timeout = setTimeout(next, time);
				hooks.stop = function () {
					clearTimeout(timeout);
				};
			});
		},
		clearQueue: function (type) {
			return this.queue(type || 'fx', []);
		},
		// Get a promise resolved when queues of a certain type
		// are emptied (fx is the type by default)
		promise: function (type, obj) {
			var tmp,
				count = 1,
				defer = Y.G.Deferred(),
				elements = this,
				i = this.length,
				resolve;

			resolve = function () {
				var tmp1 = --count;

				// if (!(--count)) {
				if (!tmp1) {
					/** @namespace defer.resolveWith */
					defer.resolveWith(elements, [elements]);
				}
			};

			if (typeof type !== 'string') {
				obj = type;
				type = undef;
			}

			type = type || 'fx';

			while (i--) {
				tmp = Y.DOM.dataPrivative.get(elements[i], type + 'queueHooks');

				if (tmp && tmp.empty) {
					count++;
					tmp.empty.add(resolve);
				}
			}

			resolve();

			return defer.promise(obj);
		}
	});

	//---

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
			style = Y.DOM.getDocStyles(this.get(0));

			for (x = 0; x < props.length; x++) {
				this.css(props[x], style.getPropertyValue(props[x]));
			}
		}

		if (cancelCallback) {
			this.unbind(Y.DOM.fx.transitionEnd).css(cssReset);
		} else {
			this.trigger(Y.DOM.fx.transitionEnd);
		}

		return this;
	};

	//---

}());

// FILE: ./Source/Modules/Node/Fx.js

//---