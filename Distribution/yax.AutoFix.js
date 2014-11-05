/**
 * YAX Auto Fix [DOM/NODE][PLUGIN]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	Y.config.set('AutoFix.customOffset', true);
	Y.config.set('AutoFix.manual', false);
	Y.config.set('AutoFix.onlyInContainer', true);

	var pluginOptions = Y.config.getAll('AutoFix', false, true);

	Y.DOM.Function.AutoFix = function (options) {
		var settings = Y.extend(pluginOptions, options, {}),
			el = Y.DOM(this),
			curpos = el.position(),
			offset = settings.customOffset,
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

			if (Y.DOM(document).scrollTop() > offset &&
				Y.DOM(document).scrollTop() <= (el.parent().height() +
				(offset - Y.DOM(window).height()))) {
				el.removeClass('_bottom').addClass('_fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Y.DOM(document).scrollTop() > offset) {
					if (settings.onlyInContainer === true) {
						if (Y.DOM(document).scrollTop() > (el.parent().height() - Y.DOM(window).height())) {
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

		if (settings.manual === false) {
			Y.DOM(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};

	//---

}());

// FILE: ./Source/Plugins/autoFix/autoFix.js

//---


