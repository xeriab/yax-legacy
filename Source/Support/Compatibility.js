/**
 * YAX Compatibilities [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	// Map over Yax.DOM in case of overwrite
	var _YaxDOM = window.Y.DOM;

	// Map over the $ in case of overwrite
	var _$ = window.$;

	_YaxDOM.noConflict = function (deep) {
		if (window.$ === Y.DOM) {
			window.$ = _$;
		}

		if (deep && window.Y.DOM === Y.DOM) {
			window.Y.DOM = _YaxDOM;
		}

		return Y.DOM;
	};

	//---

	// Y.G.Compatibility = true;

	// Y.DOM._temp = {};

	Y.DOM.camelCase = Y.camelise;
	Y.DOM.isReady = true;
	Y.DOM.isArray = Y.isArray;
	Y.DOM.isFunction = Y.isFunction;
	Y.DOM.isWindow = Y.isWindow;
	Y.DOM.trim = Y.trim;
	Y.DOM.type = Y.type;
	Y.DOM.isNumeric = Y.isNumeric;
	Y.DOM.isEmptyObject = Y.isObjectEmpty;
	Y.DOM.noop = Y.noop;
	Y.DOM.grep = Y.grep;
	Y.DOM.merge = Y.merge;

	Y.DOM.when = Y.When;

	Y.DOM.Deferred = Y.G.Deferred;
	Y.DOM.Callbacks = Y.G.Callbacks;

	Y.DOM.cssHooks = Y.DOM.CSS_Hooks;
	Y.DOM.cssNumber = Y.DOM.CSS_Number;
	Y.DOM.cssProps = Y.DOM.CSS_Properities;

	// The deferred used on DOM ready
	var readyList = null;

	Y.DOM.Function.ready = function (callback) {
		// Add the callback
		Y.DOM.ready.promise().done(callback);
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

			tmp1 = (wait === true ? --Y.DOM.readyWait : Y.DOM.isReady);

			// Abort if there are pending holds or we're already ready
			if (tmp1) {
				return;
			}

			// Remember that the DOM is ready
			Y.DOM.isReady = true;

			tmp2 = (wait !== true && --Y.DOM.readyWait > 0);

			if (tmp2) {
				return;
			}

			// If there are functions bound, to execute
			readyList.resolveWith(document, [Y.DOM]);

			// Trigger any bound ready events
			if (Y.DOM.Function.triggerHandler) {
				Y.DOM(document).triggerHandler('ready');
				Y.DOM(document).off('ready');
			}
		}
	});

	/**
	 * The ready event handler and self cleanup method
	 */
	function completed () {
		document.removeEventListener('DOMContentLoaded', completed, false);
		window.removeEventListener('load', completed, false);
		Y.DOM.ready();
	}

	Y.DOM.ready.promise = function (obj) {
		if (!readyList) {
			readyList = Y.DOM.Deferred();

			// Catch cases where $(document).ready() is called after the browser event has already occurred.
			// we once tried to use readyState 'interactive' here, but it caused issues like the one
			// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
			if (document.readyState === 'complete') {
				// Handle it asynchronously to allow scripts the opportunity to delay ready
				setTimeout(Y.DOM.ready);
			} else {
				// Use the handy event callback
				document.addEventListener('DOMContentLoaded', completed, false);
				// A fallback to window.onload, that will always work
				window.addEventListener('load', completed, false);
			}
		}

		return readyList.promise(obj);
	};

	// Kick off the DOM ready check even if the user does not
	Y.DOM.ready.promise();

	//---

	if (!Y.isDefined(window.Sizzle)) {
		// Used by dateinput
		Y.DOM.Function.clone = function(){
			var ret = Y.DOM();
			this.each(function(){
				ret.push(this.cloneNode(true));
			});

			return ret;
		};

		var oldBind = Y.DOM.Function.bind;

		Y.DOM.Function.bind = function (types, data, callback) {
			var el = this;
			// var $this = Y.DOM(el);
			var specialEvent;

			if (!Y.isSet(callback)) {
				callback = data;
				data = null;
			}

			if (Y.DOM.yDOM) {
				Y.DOM.each(types.split(/\s/), function (i, types) {
					types = types.split(/\./)[0];

					var tmp = Y.hasOwn.call(Y.DOM.event.special, types);

					if (tmp) {
						specialEvent = Y.DOM.event.special[types];

						/// init enable special events on Y.DOM
						if (!specialEvent._init) {
							specialEvent._init = true;

							/// intercept and replace the special event handler to add functionality
							specialEvent.originalHandler = specialEvent.handler;
							specialEvent.handler = function () {

								/// make event argument writable, like on jQuery
								var args = Y.G.slice.call(arguments);

								args[0] = Y.extend({}, args[0]);

								/// define the event handle, Y.DOM.event.dispatch is only for newer versions of jQuery
								Y.DOM.event.handle = function () {
									/// make context of trigger the event element
									var args_ = Y.G.slice.call(arguments);
									var event = args_[0];
									var $target = Y.DOM(event.target);

									$target.trigger.apply($target, arguments);

								};

								specialEvent.originalHandler.apply(this, args);

							};
						}

						specialEvent.setup.apply(el, [data]);
					}
				});
			}

			// return Y.DOM.Function.bindEvent.apply(this, [types, callback]);
			return oldBind.apply(this, [types, callback]);
		};
	}


	//---

	window.cordova = document.URL.indexOf('http://') === -1 &&
		document.URL.indexOf('https://') === -1;

	if (window.cordova === false) {
		Y.DOM(function () {
			Y.DOM(document).trigger('deviceready');
		});
	}

	//---

}());

// FILE: ./Source/Support/Compatibility.js

//---
