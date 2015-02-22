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
		var options = Y.extend(pluginOptions, options, {});
		var elem = Y.DOM(this);
		var curpos = elem.position();
		var offset = options.customOffset;
		var pos = elem.offset();
		var fixAll;

		elem.addClass('yax-autofix');

		Y.DOM.Function.ManualFix = function () {
			elem = Y.DOM(this);
			pos = elem.offset();

			if (elem.hasClass('yax-fixed')) {
				elem.removeClass('yax-fixed');
			} else {
				elem.addClass('yax-fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			}
		};

		fixAll = function (elem, options, curpos, pos) {
			if (options.customOffset === false) {
				offset = elem.parent().offset().top;
			}

			if (Y.DOM(document).scrollTop() > offset &&
				Y.DOM(document).scrollTop() <= (elem.parent().height() +
				(offset - Y.DOM(window).height()))) {
				elem.removeClass('yax-bottom').addClass('yax-fixed').css({
					top: 0,
					left: pos.left,
					right: 'auto',
					bottom: 'auto'
				});
			} else {
				if (Y.DOM(document).scrollTop() > offset) {
					if (options.onlyInContainer === true) {
						if (Y.DOM(document).scrollTop() > 
							(elem.parent().height() - 
								Y.DOM(window).height())) {
							elem.addClass('yax-bottom yax-fixed')
								.removeAttr('style').css({
									left: curpos.left
								});
						} else {
							elem.removeClass('yax-bottom yax-fixed').removeAttr('style');

						}
					}
				} else {
					elem.removeClass('yax-bottom yax-fixed').removeAttr('style');
				}
			}
		};

		if (options.manual === false) {
			Y.DOM(window).scroll(function () {
				fixAll(elem, options, curpos, pos);
			});
		}
	};

	//---

}());

// FILE: ./Source/Plugins/AutoFix/AutoFix.js

//---
