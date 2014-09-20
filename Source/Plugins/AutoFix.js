/**
 * YAX Plugins | Autofix
 *
 *
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
/*global YAX, Y */

//---

(function () {

	'use strict';

	// Plugin information

	// Default options for the Plugin
	var defaults = {
		customOffset: true,
		manual: true,
		onlyInContainer: true
	};

	Y.DOM.Function.AutoFix = function (options) {
		var settings = Y.Extend(defaults, options, {}),
			el = Y.DOM(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset(),
			fixAll;

		el.addClass('YAX-AutoFix');

		Y.DOM.Function.ManualFix = function () {
			el = Y.DOM(this);
			pos = el.offset();

			if (el.hasClass('_Fixed')) {
				el.removeClass('_Fixed');
			} else {
				el.addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (el, settings, curpos, pos) {
			if (settings.customOffset === false) {
				offset = el.parent().offset().top;
			}

			if (Y.DOM(document).scrollTop() > offset && Y.DOM(document).scrollTop() <= (el.parent().height() + (offset - Y.DOM(window).height()))) {
				el.removeClass('_Bottom').addClass('_Fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Y.DOM(document).scrollTop() > offset) {
					if (settings.onlyInContainer === true) {
						if (Y.DOM(document).scrollTop() > (el.parent().height() - Y.DOM(window).height())) {
							el.addClass('_Bottom _Fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_Bottom _Fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_Bottom _Fixed').removeAttr('style');
				}
			}
		};

		if (settings.manual === false) {
			Y.DOM(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};

	//---

}());

//---
