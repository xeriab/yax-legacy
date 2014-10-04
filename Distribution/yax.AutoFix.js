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

	Y.Extend(Y.Settings.DOM, {
		AutoFix: {
			CustomOffset: true,
			Manual: true,
			OnlyInContainer: true
		}
	});

	var PluginOptions = Y.Settings.DOM.AutoFix;

	Y.DOM.Function.AutoFix = function (options) {
		var settings = Y.Extend(PluginOptions, options, {}),
			el = Y.DOM(this),
			curpos = el.position(),
			offset = settings.CustomOffset,
			pos = el.offset(),
			fixAll;

		el.addClass('yax-autofix');

		Y.DOM.Function.ManualFix = function () {
			el = Y.DOM(this);
			pos = el.offset();

			if (el.hasClass('_fixed')) {
				el.removeClass('_fixed');
			} else {
				el.addClass('_fixed').css({
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

			if (Y.DOM(Y.Document).scrollTop() > offset &&
				Y.DOM(Y.Document).scrollTop() <= (el.parent().height() +
				(offset - Y.DOM(Y.Window).height()))) {
				el.removeClass('_bottom').addClass('_fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Y.DOM(Y.Document).scrollTop() > offset) {
					if (settings.OnlyInContainer === true) {
						if (Y.DOM(Y.Document).scrollTop() > (el.parent().height() - Y.DOM(Y.Window).height())) {
							el.addClass('_bottom _fixed').removeAttr('style').css({
								left: curpos.left
							});
						} else {
							el.removeClass('_bottom _fixed').removeAttr('style');

						}
					}
				} else {
					el.removeClass('_bottom _fixed').removeAttr('style');
				}
			}
		};

		if (settings.Manual === false) {
			Y.DOM(Y.Window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};

	//---

}());

//---


