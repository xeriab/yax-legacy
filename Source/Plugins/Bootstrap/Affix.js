/**
 * YAX Bootstrap Plugins | Affix
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

	// AFFIX CLASS DEFINITION
	// ======================

	var Affix = function (element, options) {
		this.options = Y.DOM.extend({}, Affix.DEFAULTS, options);

		this.$target = Y.DOM(this.options.target)
			.on('scroll.bs.affix.data-api', Y.DOM.proxy(this.checkPosition, this))
			.on('click.bs.affix.data-api', Y.DOM.proxy(this.checkPositionWithEventLoop, this));

		this.$element = Y.DOM(element);
		this.affixed =
			this.unpin =
				this.pinnedOffset = null;

		this.checkPosition();
	};

	Affix.VERSION = '3.2.0';

	Affix.RESET = 'affix affix-top affix-bottom';

	Affix.DEFAULTS = {
		offset: 0,
		target: window
	};

	Affix.prototype.getPinnedOffset = function () {
		if (this.pinnedOffset) {
			return this.pinnedOffset;
		}

		this.$element.removeClass(Affix.RESET).addClass('affix');

		var scrollTop = this.$target.scrollTop();
		var position = this.$element.offset();

		//return (this.pinnedOffset = position.top - scrollTop);

		this.pinnedOffset = position.top - scrollTop;

		return (this.pinnedOffset);
	};

	Affix.prototype.checkPositionWithEventLoop = function () {
		setTimeout(Y.DOM.proxy(this.checkPosition, this), 1);
	};

	Affix.prototype.checkPosition = function () {
		if (!this.$element.is(':visible')) {
			return;
		}

		var scrollHeight = Y.DOM(document).height();
		var scrollTop = this.$target.scrollTop();
		var position = this.$element.offset();
		var offset = this.options.offset;
		var offsetTop = offset.top;
		var offsetBottom = offset.bottom;

		if (typeof offset !== 'object') {
			offsetBottom = offsetTop = offset;
		}

		if (typeof offsetTop === 'function') {
			offsetTop = offset.top(this.$element);
		}

		if (typeof offsetBottom === 'function') {
			offsetBottom = offset.bottom(this.$element);
		}

		var affix = this.unpin !== null && (scrollTop + this.unpin <= position.top) ? false :
				offsetBottom !== null && (position.top + this.$element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
				offsetTop !== null && (scrollTop <= offsetTop) ? 'top' : false;

		if (this.affixed === affix) {
			return;
		}

		if (this.unpin !== null) {
			this.$element.css('top', '');
		}

		var affixType = 'affix' + (affix ? '-' + affix : '');
		var e = Y.DOM.Event(affixType + '.bs.affix');

		this.$element.trigger(e);

		if (e.isDefaultPrevented()) {
			return;
		}

		this.affixed = affix;
		this.unpin = affix === 'bottom' ? this.getPinnedOffset() : null;

		this.$element
			.removeClass(Affix.RESET)
			.addClass(affixType)
			.trigger(Y.DOM.Event(affixType.replace('affix', 'affixed')));

		if (affix === 'bottom') {
			this.$element.offset({
				top: scrollHeight - this.$element.height() - offsetBottom
			});
		}
	};


	// AFFIX PLUGIN DEFINITION
	// =======================

	function Plugin(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.affix');
			var options = typeof option === 'object' && option;

			if (!data) {
				data = new Affix(this, options);
				$this.data('bs.affix', data);
			}

			if (typeof option === 'string') {
				data[option]();
			}
		});
	}

	var old = Y.DOM.fn.affix;

	Y.DOM.fn.affix = Plugin;
	Y.DOM.fn.affix.Constructor = Affix;


	// AFFIX NO CONFLICT
	// =================

	Y.DOM.fn.affix.noConflict = function () {
		Y.DOM.fn.affix = old;
		return this;
	};


	// AFFIX DATA-API
	// ==============

	Y.DOM(window).on('load', function () {
		Y.DOM('[data-spy="affix"]').each(function () {
			var $spy = Y.DOM(this);
			var data = $spy.data();

			data.offset = data.offset || {};

			if (data.offsetBottom) {
				data.offset.bottom = data.offsetBottom;
			}

			if (data.offsetTop) {
				data.offset.top = data.offsetTop;
			}

			Plugin.call($spy, data);
		});
	});

	//---

}());

//---
