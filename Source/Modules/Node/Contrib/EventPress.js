/**
 * YAX Node | Press Event
 *
 * Cross browser press event implementation using YAX's API [Node]
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


	var ghostsLifeTime = 1000,
		normalizeArgs,
		ghosts,
		callbacks,
		handlers,
		doc,
		removeGhosts,
		handleGhosts,
		i,
		l;

	normalizeArgs = function (args) {
		var callback,
			selector;

		if (Y.Lang.isFunction(args[0])) {
			callback = args[0];
		} else {
			selector = args[0];
			callback = args[1];
		}

		return [selector, callback];
	};

	if (Y.UserAgent.Features.Touch) {
		ghosts = [];
		callbacks = [];
		handlers = [];
		doc = Y.DOM(document);

		removeGhosts = function () {
			ghosts.splice(0, 2);
		};

		handleGhosts = function (e) {
			for (i = 0, l = ghosts.length; i < l; i += 2) {
				if (Math.abs(e.pageX - ghosts[i]) < 25 && Math.abs(e.pageY - ghosts[i + 1]) < 25) {
					e.stopPropagation();
					e.preventDefault();
				}
			}
		};

		doc.on('click', handleGhosts);

		Y.DOM.Function.onpress = function () {
			// Passing empty selectors, empty arguments list or a document node cause bugs on android/iOS
			// Just to be on the safe side allowing only element and document fragment nodes to be used
			if (!arguments.length || !this.length || !this[0].nodeType || (this[0].nodeType !== 1 && this[0].nodeType !== 11)) {
				return;
			}

			var touches = [],
				that = this,
				args,
				handleTouchStart,
				handleTouchMove,
				handleTouchEnd,
				resetHandlers;

			args = normalizeArgs(arguments);

			handleTouchStart = function (e) {
				e.stopPropagation();
				/** @namespace e.touches */
				var coords = e.touches ? e.touches[0] : e; // Android weirdness fix

				/** @namespace coords.pageX */
				/** @namespace coords.pageY */
				touches[0] = coords.pageX;
				touches[1] = coords.pageY;

				doc.on('touchmove.onpress', handleTouchMove);

				if (args[0]) {
					that.on('touchend.onpress', args[0], handleTouchEnd);
				} else {
					that.on('touchend.onpress', handleTouchEnd);
				}

				// args[0] ? that.on('touchend.onpress', args[0], handleTouchEnd) : that.on('touchend.onpress', handleTouchEnd);
			};

			handleTouchMove = function (e) {
				if (Math.abs(e.touches[0].pageX - touches[0]) > 10 || Math.abs(e.touches[0].pageY - touches[1]) > 10) {
					resetHandlers();
				}
			};

			handleTouchEnd = function (e) {
				resetHandlers();

				args[1].call(this, e);

				if (e.type === 'touchend') {
					ghosts.push(touches[0], touches[1]);
					window.setTimeout(removeGhosts, ghostsLifeTime);
				}
			};

			resetHandlers = function () {
				doc.off('touchmove.onpress', handleTouchMove);

				if (args[0]) {
					that.off('touchend.onpress', args[0], handleTouchEnd);
				} else {
					that.off('touchend.onpress', handleTouchEnd);
				}

				// args[0] ? that.off('touchend.onpress', args[0], handleTouchEnd) : that.off('touchend.onpress', handleTouchEnd);
			};

			callbacks.push(args[1]);

			handlers.push(handleTouchStart);

			if (args[0]) {
				this.on('touchstart.onpress', args[0], handleTouchStart);
				// this.on('click', args[0], handleTouchStart);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('touchstart.onpress', handleTouchStart);
				// this.on('click', handleTouchStart);
				this.on('press.onpress', args[1]);
			}
		};

		Y.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments),
				x;

			if (args[1]) {
				x = callbacks.indexOf(args[1]);

				if (x < 0) { // Something went terribly wrong and there is no associated callback/handler
					return;
				}

				if (args[0]) {
					this.off('touchstart.onpress', args[0], handlers[x]);
					//this.off('click.onpress', args[0], handlers[x]);
					this.off('press.onpress', args[0], args[x]);
				} else {
					this.off('touchstart.onpress', handlers[x]);
					//this.off('click.onpress', handlers[x]);
					this.off('press.onpress', args[1]);
				}
				callbacks.splice(x, 1);
				handlers.splice(x, 1);
			} else {
				if (args[0]) {
					this.off('touchstart.onpress', args[0]);
					//this.off('click.onpress', args[0]);
					this.off('press.onpress', args[0]);
				} else {
					this.off('touchstart.onpress');
					//this.off('click.onpress');
					this.off('press.onpress');
				}
			}
		};
	} else {
		Y.DOM.Function.onpress = function () {
			var args = normalizeArgs(arguments);

			if (args[0]) {
				this.on('click.onpress', args[0], args[1]);
				this.on('press.onpress', args[0], args[1]);
			} else {
				this.on('click.onpress', args[1]);
				this.on('press.onpress', args[1]);
			}
		};

		Y.DOM.Function.offpress = function () {
			var args = normalizeArgs(arguments);

			if (args[0]) {
				this.off('.onpress', args[0], args[1]);
			} else {
				this.off('.onpress', args[1]);
			}

			// args[0] ? this.off('.onpress', args[0], args[1]) : this.off('.onpress', args[1]);
		};
	}

	//---

}());

//---
