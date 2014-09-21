/**
 * YAX Bootstrap Plugins | Transition
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
/*global Y, YAX, $*/

(function () {

	'use strict';

	// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
	// ============================================================

	function transitionEnd() {
		var el = Y.Document.createElement('yaxbs');
		var name;

		var transEndEventNames = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd otransitionend',
			transition: 'transitionend'
		};

		for (name in transEndEventNames) {
			if (Y.HasOwnProperty.call(transEndEventNames, name)) {
				if (!Y.Lang.isDefined(el.style[name])) {
					return {
						// end: transEndEventNames[name]
						end: Y.DOM.fx.transitionEnd
					};
				}
			}
		}

		/*if (Y.DOM.fx) {
			return {
				end: Y.DOM.fx.transitionEnd
			};
		}*/

		return false; // explicit for ie8 (	._.)
	}

	// http://blog.alexmaccaw.com/css-transitions
	Y.DOM.Function.emulateTransitionEnd = function (duration) {
		var called = false;
		var $el = this;

		Y.DOM(this).bind('bsTransitionEnd', function () {
			called = true;
		});

		var callback = function () {
			if (!called) {
				Y.DOM($el).trigger(Y.DOM.support.transition.end);
			}
		};

		setTimeout(callback, duration);

		return this;
	};

	Y.DOM(function () {
		Y.DOM.support.transition = transitionEnd();

		if (!Y.DOM.support.transition) {
			return;
		}

		Y.DOM.each({
			bsTransitionEnd: Y.DOM.fx.transitionEnd,
			yaxbs: Y.DOM.fx.transitionEnd
		}, function (orig, fix) {
			var attaches = 0;

			var handler = function (event) {
				Y.DOM.event.simulate(fix, event.target, Y.DOM.extend({}, event), true);
			};

			Y.DOM.event.special[orig] = {
				bindType: Y.DOM.support.transition.end,

				delegateType: Y.DOM.support.transition.end,

				handle: function (e) {
					if (Y.DOM(e.target).is(this)) {
						Y.LOG(e);
						return e.handleObj.handler.apply(this, arguments);
					}
				},

				setup: function () {
					if (attaches++ === 0) {
						Y.Document.addEventListener(orig, handler, true);
						Y.Document.addEventListener(fix, handler, true);
					}
				},

				teardown: function () {
					if (--attaches === 0) {
						Y.Document.removeEventListener(orig, handler, true);
					}
				}
			};
		});

		/*Y.DOM.Event.special.bsTransitionEnd = {
			bindType: Y.DOM.support.transition.end,
			delegateType: Y.DOM.support.transition.end,
			handle: function (e) {
				if (Y.DOM(e.target).is(this)) {
					Y.LOG(e);
					return e.handleObj.handler.apply(this, arguments);
				}
			}
		};*/
	});

	//---

}());

//---
