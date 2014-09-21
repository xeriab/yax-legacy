/**
 * Node/DOM Compatibility
 *
 * Compatibility Module for YAX's DOM API.
 *
 * @version     0.15
 * @depends:    Core
 * @license     Dual licensed under the MIT and GPL licenses.
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	'use strict';

	//---

	// Map over Yax.DOM in case of overwrite
	var _YaxDOM = Y.Window.Y.Node;

	// Map over the $ in case of overwrite
	var _$ = Y.Window.$;

	_YaxDOM.noConflict = function (deep) {
		if (Y.Window.$ === Y.Node) {
			Y.Window.$ = _$;
		}

		if (deep && Y.Window.Y.Node === Y.Node) {
			Y.Window.Y.Node = _YaxDOM;
		}

		return Y.Node;
	};

	//---

	// Y.G.Compatibility = true;

	// Y.DOM._temp = Object.create({});

	Y.DOM.camelCase = Y.Lang.camelise;
	Y.DOM.isReady = true;
	Y.DOM.isArray = Y.Lang.isArray;
	Y.DOM.isFunction = Y.Lang.isFunction;
	Y.DOM.isWindow = Y.Lang.isWindow;
	Y.DOM.trim = Y.Lang.trim;
	Y.DOM.type = Y.Lang.type;
	Y.DOM.isNumeric = Y.Lang.isNumeric;
	Y.DOM.isEmptyObject = Y.Lang.isObjectEmpty;
	Y.DOM.noop = Y.DOM.Noop = Y.Lang.noop;

	Y.DOM.when = Y.Lang.When;

	Y.DOM.Deferred = Y.G.Deferred;
	Y.DOM.Callbacks = Y.G.Callbacks;

	Y.DOM.cssHooks = Y.DOM.CSS_Hooks;
	Y.DOM.cssNumber = Y.DOM.CSS_Number;
	Y.DOM.cssProps = Y.DOM.CSS_Properities;

	Y.DOM.expando = Y.DOM.Expando;

	// The deferred used on DOM ready
	var readyList = null;

	Y.DOM.Function.ready = function (callback) {
		// Add the callback
		Y.DOM.ready.promise(this).done(callback);

		return this;
	};

	Y.DOM.extend({
		// Is the DOM ready to be used? Set to true once it occurs.
		isReady: false,

		// A counter to track how many items to wait for before
		// the ready event fires. See #6781
		readyWait: 1,

		// Hold (or release) the ready event
		holdReady: function (hold) {
			if (hold) {
				Y.DOM.readyWait++;
			} else {
				Y.DOM.ready(true);
			}
		},

		// Handle when the DOM is ready
		ready: function (wait) {
			var tmp1;
			var tmp2;

			// Abort if there are pending holds or we're already ready
			/*if (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady) {
				return;
			}*/

			// Y.LOG(wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			tmp1 = (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			// Y.LOG(tmp)

			// Abort if there are pending holds or we're already ready
			if (tmp1) {
				return;
			}

			// Remember that the DOM is ready
			Y.DOM.isReady = true;

			// If a normal DOM Ready event fired, decrement, and wait if need be
			/*if (wait !== true && --Y.DOM.readyWait > 0) {
				return;
			}*/

			tmp2 = (wait !== true && --Y.DOM.readyWait > 0);

			if (tmp2) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(Y.Document, [Y.DOM]);

			// Trigger any bound ready events
			if (Y.DOM.fn.triggerHandler) {
				Y.DOM(Y.Document).triggerHandler('ready');
				Y.DOM(Y.Document).off('ready');
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed() {
		Y.Document.removeEventListener('DOMContentLoaded', completed, false);
		Y.Window.removeEventListener('load', completed, false);
		Y.DOM.ready();
	}

	Y.DOM.ready.promise = function (obj) {
		// Y.LOG(readyList);

		if (!readyList) {
			readyList = Y.DOM.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// we once tried to use readyState 'interactive' here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if (Y.Document.readyState === 'complete') {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(Y.DOM.ready);
			} else {
				// Use the handy event callback
				Y.Document.addEventListener('DOMContentLoaded', completed, false);

				// A fallback to Y.Window.onload, that will always work
				Y.Window.addEventListener('load', completed, false);
			}
		}

		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	Y.DOM.ready.promise();

	if (Y.HasOwnProperty.call(Y.Window, 'Sizzle')) {
		Y.DOM.isXMLDoc = Y.Window.Sizzle.isXML;
		Y.DOM.text = Y.DOM.Text = Y.Window.Sizzle.getText;
	}

	//---

	Y.DOM.event.simulate = function (type, elem, event, bubble) {
		var e = Y.Extend(new Y.DOM.Event(type), event, {
			type: type,
			isSimulated: true,
			originalEvent: {},
			bubbles: true
		});

		Y.DOM(elem).trigger(e);

		if (e.isDefaultPrevented()) {
			event.preventDefault();
		}
	};

	Y.DOM.each({
		focus: 'focusin',
		blur: 'focusout'
	}, function (orig, fix) {
		var attaches = 0;

		var handler = function (event) {
			Y.DOM.event.simulate(fix, event.target, Y.DOM.extend({}, event), true);
		};

		Y.DOM.event.special[fix] = {
			setup: function () {
				if (attaches++ === 0) {
					Y.Document.addEventListener(orig, handler, true);
				}
			},

			teardown: function () {
				if (--attaches === 0) {
					Y.Document.removeEventListener(orig, handler, true);
				}
			}
		};
	});

	//---

	Y.Window.cordova = document.URL.indexOf('http://') === -1 && Y.Document.URL.indexOf('https://') === -1;

	if (Y.Window.cordova === false) {
		Y.DOM(function () {
			Y.DOM(Y.Document).trigger('deviceready');
		});
	}


	//---

}());

//---
