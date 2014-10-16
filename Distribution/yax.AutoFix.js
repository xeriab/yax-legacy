/**
 * YAX Auto Fix [DOM/NODE][PLUGIN]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y, $ */

(function () {

	//---

	'use strict';

	Y.config.set('yax.plugins.autofix.customOffset', true);
	Y.config.set('yax.plugins.autofix.manual', false);
	Y.config.set('yax.plugins.tooltip.onlyInContainer', true);

	var pluginOptions = Y.config.getAll('yax.plugins.autofix', false, true);

	$.fn.AutoFix = function (options) {
		var settings = Y.extend(pluginOptions, options, {}),
			el = $(this),
			curpos = el.position(),
			offset = settings.customOffset,
			pos = el.offset(),
			fixAll;

		el.addClass('yax-autofix');

		$.fn.ManualFix = function () {
			el = $(this);
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

			if ($(document).scrollTop() > offset &&
				$(document).scrollTop() <= (el.parent().height() +
				(offset - $(window).height()))) {
				el.removeClass('_bottom').addClass('_fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if ($(document).scrollTop() > offset) {
					if (settings.onlyInContainer === true) {
						if ($(document).scrollTop() > (el.parent().height() - $(window).height())) {
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
			$(window).scroll(function () {
				fixAll(el, settings, curpos, pos);
			});
		}
	};

	//---

}());

// FILE: ./Source/Plugins/autoFix/autoFix.js

//---


