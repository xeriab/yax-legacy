/**
 * YAX Effect Methods [DOM/NODE]
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

	var origShow = Y.DOM.Function.show,
		origHide = Y.DOM.Function.hide,
		origToggle = Y.DOM.Function.toggle,
		rrun = /queueHooks$/;

	function anim(el, speed, opacity, scale, callback) {
		if (typeof speed === 'function' && !callback) {
			callback = speed;
			speed = undef;
		}

		var props = {
			opacity: opacity
		};

		if (scale) {
			props.scale = scale;
			el.css(Y.DOM.fx.cssPrefix + 'transform-origin', '0 0');
		}

		return el.animate(props, speed, null, callback);
	}

	function hide(el, speed, scale, callback) {
		return anim(el, speed, 0, scale, function () {
			origHide.call(Y.DOM(this));

			if (callback) {
				callback.call(this);
			}

			// callback && callback.call(this);
		});
	}

	Y.DOM.Function.show = function (speed, callback) {
		origShow.call(this);

		if (speed === undef) {
			speed = 0;
		} else {
			this.css('opacity', 0);
		}

		return anim(this, speed, 1, '1,1', callback);
	};

	Y.DOM.Function.hide = function (speed, callback) {
		if (speed === undef) {
			return origHide.call(this);
		}

		return hide(this, speed, '0,0', callback);
	};

	Y.DOM.Function.toggle = function (speed, callback) {
		if (speed === undef || typeof speed === 'boolean') {
			return origToggle.call(this, speed);
		}

		return this.each(function () {
			var el = Y.DOM(this);
			el[el.css('display') === 'none' ? 'show' : 'hide'](speed, callback);
		});
	};

	Y.DOM.Function.fadeTo = function (speed, opacity, callback) {
		return anim(this, speed, opacity, null, callback);
	};

	Y.DOM.Function.fadeIn = function (speed, callback) {
		var target = this.css('opacity');

		if (target > 0) {
			this.css('opacity', 0);
		} else {
			target = 1;
		}

		return origShow.call(this).fadeTo(speed, target, callback);
	};

	Y.DOM.Function.fadeOut = function (speed, callback) {
		return hide(this, speed, null, callback);
	};

	Y.DOM.Function.fadeToggle = function (speed, callback) {
		return this.each(function () {
			var el = Y.DOM(this);
			el[(el.css('opacity') === 0 || el.css('display') === 'none') ? 'fadeIn' : 'fadeOut'](speed, callback);
		});
	};

	Y.DOM.Function.stop = function (type, clearQueue, gotoEnd) {
		var stopQueue = function (hooks) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop(gotoEnd);
		};

		if (typeof type !== 'string') {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undef;
		}

		if (clearQueue && type !== false) {
			this.queue(type || 'fx', []);
		}

		return this.each(function () {
			var dequeue = true,
				index = type !== null && type + 'queueHooks',
				timers = Y.DOM.Timers,
				data = Y.DOM.dataPrivative.get(this);

			if (index) {
				if (data[index] && data[index].stop) {
					stopQueue(data[index]);
				}
			} else {
				for (index in data) {
					if (data.hasOwnProperty(index)) {
						if (data[index] && data[index].stop && rrun.test(index)) {
							stopQueue(data[index]);
						}
					}
				}
			}

			for (index = timers.length; index--; index) {
				/** @namespace timers[index].elem */
				if (timers[index].elem === this && (type === null || timers[index].queue === type)) {
					timers[index].anim.stop(gotoEnd);
					dequeue = false;
					timers.splice(index, 1);
				}
			}

			// start the next in the queue if the last step wasn't forced
			// timers currently will call their complete callbacks, which will dequeue
			// but only if they were gotoEnd
			if (dequeue || !gotoEnd) {
				Y.DOM.dequeue(this, type);
			}
		});
	};

	//---

}());

// FILE: ./Source/Modules/Node/FxMethods.js

//---