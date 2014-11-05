/**
 * YAX Tooltip [DOM/NODE][PLUGIN]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	Y.config.set('Tooltip.dynamic', false);
	Y.config.set('Tooltip.opacity', 1);
	Y.config.set('Tooltip.gap', 5);
	Y.config.set('Tooltip.title', null);
	Y.config.set('Tooltip.size', 'small');
	Y.config.set('Tooltip.placement', 'south');
	Y.config.set('Tooltip.theme', 'dark');
	Y.config.set('Tooltip.trigger', 'hover focus');
	Y.config.set('Tooltip.animation', 'fadeIn');
	Y.config.set('Tooltip.confirm', false);
	Y.config.set('Tooltip.yes', 'Yes');
	Y.config.set('Tooltip.no', 'No');
	Y.config.set('Tooltip.finalMessage', null);
	Y.config.set('Tooltip.finalMessageDuration', 500);
	Y.config.set('Tooltip.onYes', Y.noop);
	Y.config.set('Tooltip.onNo', Y.noop);
	Y.config.set('Tooltip.container', 'body');

	var pluginOptions = Y.config.getAll('Tooltip', false, true);

	function Tooltip(element, options) {
		this.element = element;
		this.options = options;
		this.delay = null;
		this.type = 'tooltip';
		this.title = null;
		this.init();
	}

	Tooltip.prototype = {
		init: function () {
			this.setContent();

			if (this.title !== null) {
				this.setEvents();
			}

			Y.DOM('tooltip.yax-tooltip-dynamic').hide();
			Y.DOM('tooltip.yax-tooltip-dynamic').remove();

			Y.DOM('tooltip.yax-tooltip').hide();
			Y.DOM('tooltip.yax-tooltip').remove();
		},

		show: function () {
			Y.DOM(this.element).css('cursor', 'pointer');

			// Close all other Tooltips
			Y.DOM('tooltip.yax-tooltip').hide();
			Y.DOM('tooltip.yax-tooltip').remove();

			Y.DOM('tooltip.yax-tooltip-dynamic').hide();
			Y.DOM('tooltip.yax-tooltip-dynamic').remove();

			window.clearTimeout(this.delay);

			this.setContent();

			this.setPositions();

			this.Tooltip.css('display', 'block');

			this.Tooltip.addClass('yax-unselectable');
			this.Tooltip.addClass('yax-undraggable');

			this.element.title('');
		},

		hide: function () {
			this.Tooltip.hide();
			this.Tooltip.remove();

			window.clearTimeout(this.delay);

			this.Tooltip.css('display', 'none');

			this.element.title(this.title);
			this.element.removeData('tooltip');
		},

		toggle: function () {
			if (this.Tooltip.is(':visible')) {
				this.hide();
			} else {
				this.show();
			}
		},

		addAnimation: function () {
			if (Y.isTrue(this.options.dynamic)) {
				this.options.animation = 'none';
			}

			switch (this.options.animation) {
				case 'none':
					break;

				case 'fade':
					this.Tooltip.addClass('yax-animated');
					this.Tooltip.addClass('yax-fade');
					break;

				case 'FadeIn':
					this.Tooltip.addClass('yax-animated');
					this.Tooltip.addClass('yaxFadeIn');
					break;

				case 'fadeIn':
					this.Tooltip.addClass('yax-animated');
					this.Tooltip.addClass('fadeIn');
					break;

				case 'flipIn':
					this.Tooltip.addClass('yax-animated');
					this.Tooltip.addClass('flipIn');
					break;
			}
		},

		setContent: function () {
			var isDynamic = (Y.isSet(this.options.dynamic) && Y.isTrue(this.options.dynamic));

			// Get Tooltip title
			if (this.options.title) {
				this.title = this.options.title;
			} else if (this.element.data('tooltip')) {
				this.title = this.element.data('tooltip');
			} else if (this.element.attr('title')) {
				this.title = this.element.title();
				this.element.data('tooltip', this.element.title());
			} else {
				Y.ERROR('No title for Tooltip: ' + this.element.selector);
				return;
			}

			if (this.title.charAt(0) === '#') {
				Y.DOM(this.title).hide();
				this.title = Y.DOM(this.title).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create Tooltip container
			this.Tooltip = Y.DOM('<tooltip class="yax-tooltip' +
				(isDynamic ? '-dynamic ' : ' ') +
				(!isDynamic ? Y.ucFirst(this.options.theme) + ' ' : Y.empty) +
				(!isDynamic ? Y.ucFirst(this.options.size) + ' ' : Y.empty) +
				(!isDynamic ? this.options.placement : Y.empty) +
				'"><content>' + this.title + '</content>' +
				(!isDynamic ? '<arrow class="yax-tip">' + '</arrow>' : Y.empty) +
				'</tooltip>'
			);

			if (!isDynamic) {
				this.Tip = this.Tooltip.find('.yax-tip');
			}

			if ((!Y.isNull(this.options.container) ||
				!Y.isEmpty(this.options.container)) &&
				this.options.container) {
				this.Tooltip.prependTo(this.options.container);
			} else {
				this.Tooltip.insertBefore(this.element.parent());
			}

			// Adjust size for html Tooltip
			if (this.contentType === 'html') {
				this.Tooltip.css('max-width', 'none');
			}

			if (!isDynamic) {
				this.Tooltip.css('opacity', this.options.opacity);
			}

			this.addAnimation();

			if (!isDynamic) {
				if (this.options.confirm) {
					this.addConfirm();
				}
			}
		},

		getPosition: function () {
			var element = this.element[0];
			return Y.extend({}, (Y.isFunction(element.getBoundingClientRect)) ?
				element.getBoundingClientRect() : {
				width: element.offsetWidth,
				height: element.offsetHeight
			}, this.element.offset());
		},

		setDynamicPositions: function () {
			var leftPos = 0;
			var topPos = 0;
			var elemTop = this.getPosition().top;
			var elemLeft = this.getPosition().left;
			var elemWidth = this.element.outerWidth();
			var elemHeight = this.element.outerHeight();
			var tooltipWidth = this.Tooltip.outerWidth();
			var tooltipHeight = this.Tooltip.outerHeight();
			// var gap = this.options.gap;

			if (this.element.css('position') === 'fixed' ||
				this.element.css('position') === 'absolute') {
				elemTop = 0;
				elemLeft = 0;
			}

			if (Y.DOM(window).width() < tooltipWidth * 1.5) {
				this.Tooltip.css('max-width', Y.DOM(window).width() / 2);
			} else {
				this.Tooltip.css('max-width', 240);
			}

			leftPos = elemLeft + (elemWidth / 2) - (tooltipWidth / 2);
			topPos = elemTop - tooltipHeight - 10;

			if (leftPos < 0) {
				leftPos = elemLeft + elemWidth / 2 - 10;
				this.Tooltip.addClass('left');
			} else {
				this.Tooltip.removeClass('left');
			}

			if (leftPos + tooltipWidth > Y.DOM(window).width()) {
				leftPos = elemLeft - tooltipWidth + elemWidth / 2 + 10;
				this.Tooltip.addClass('right');
			} else {
				this.Tooltip.removeClass('right');
			}

			if (topPos < 0) {
				topPos = elemTop + elemHeight;
				this.Tooltip.addClass('top');
			} else {
				this.Tooltip.removeClass('top');
			}

			this.Tooltip.css({
				left: leftPos,
				top: topPos
			});
		},

		setStaticPositions: function () {
			var leftPos = 0;
			var topPos = 0;
			var elemTop = this.getPosition().top;
			var elemLeft = this.getPosition().left;
			var elemWidth = this.element.outerWidth();
			var elemHeight = this.element.outerHeight();
			var tooltipWidth = this.Tooltip.outerWidth();
			var tooltipHeight = this.Tooltip.outerHeight();
			var tipWidth = this.Tip.outerWidth();
			var tipHeight = this.Tip.outerHeight();
			var gap = this.options.gap;

			if (this.element.css('position') === 'fixed' ||
				this.element.css('position') === 'absolute') {
				elemTop = 0;
				elemLeft = 0;
			}

			if (Y.DOM(window).width() < tooltipWidth * 1.5) {
				this.Tooltip.css('max-width', Y.DOM(window).width() / 2);
			} else {
				this.Tooltip.css('max-width', 240);
			}

			switch (this.options.placement) {
				case 'north':
					leftPos = elemLeft + elemWidth / 2 - tooltipWidth / 2;
					topPos = elemTop - tooltipHeight - tipHeight / 2 - gap;
					break;

				case 'east':
					leftPos = elemLeft + elemWidth + tipWidth / 2 + gap;
					topPos = elemTop + elemHeight / 2 - tooltipHeight / 2;
					break;

				case 'south':
					leftPos = elemLeft + elemWidth / 2 - tooltipWidth / 2;
					topPos = elemTop + elemHeight + tipHeight / 2 + gap;
					break;

				case 'west':
					leftPos = elemLeft - tooltipWidth - tipWidth / 2 - gap;
					topPos = elemTop + elemHeight / 2 - tooltipHeight / 2;
					break;

				case 'center':
					leftPos = elemLeft + elemWidth / 2 - tooltipWidth / 2;
					topPos = elemTop + elemHeight / 2 - tipHeight / 2;
					break;

				case 'legacy':
					leftPos = elemLeft + elemWidth / 2 - tooltipWidth / 2;
					topPos = elemTop + elemHeight / 2 + 10;
					break;
			}

			this.Tooltip.css({
				left: leftPos,
				top: topPos
			});
		},

		setPositions: function () {
			if (Y.isSet(this.options.dynamic) && Y.isTrue(this.options.dynamic)) {
				this.setDynamicPositions();
			} else {
				this.setStaticPositions();
			}
		},

		setEvents: function () {
			var self = this;
			var triggers = this.options.trigger.split(' ');
			var x;
			var trigger;
			var eventIn;
			var eventOut;
			var inFunc;
			var outFunc;

			inFunc = function (event) {
				if (Y.isTrue(self.options.confirm)) {
					self.options.trigger = 'click';
					self.element.trigger('click');
					event.stopPropagation();
					event.preventDefault();
				}

				event.preventDefault();

				self.setPositions();

				self.show();

				if (Y.isTrue(self.options.dynamic)) {
					self.Tooltip.animate({
						translateY: '2px',
						opacity: 1
					}, 75, 'ease-out');
					// }, 75, 'linear');
				}

				event.preventDefault();
			};

			outFunc = function (event) {
				if (Y.isFalse(self.options.confirm)) {
					event.preventDefault();
					self.hide();
					event.stopPropagation();
				} else {
					event.stopPropagation();
					event.preventDefault();
				}
			};

			for (x = triggers.length; x--; x) {
				trigger = triggers[x];

				if (trigger !== 'manual') {
					eventIn  = trigger === 'hover' ? 'mouseenter' : 'focusin';
					eventOut = trigger === 'hover' ? 'mouseleave' : 'focusout';

					self.element.on(eventIn  + '.' + self.type, Y.DOM.proxy(inFunc, self));
					self.element.on(eventOut + '.' + self.type, Y.DOM.proxy(outFunc, self));
				}
			}

			if (self.options.trigger === 'click') {
				self.Tooltip.one('click', function (event) {
					event.stopPropagation();
				});

				self.element.one('click', function (event) {
					event.preventDefault();
					self.setPositions();
					self.toggle();
					event.stopPropagation();
				});

				Y.DOM('html').click(function () {
					self.hide();
				});
			}
		},

		activate: function () {
			this.setContent();

			if (this.title) {
				this.setEvents();
			}
		},

		addConfirm: function () {
			/** @namespace this.options.yes */
			/** @namespace this.options.no */
			this.Tooltip.append(
				'<ul class="confirm"><li class="yax-tooltip-yes">' +
				this.options.yes +
				'</li><li class="yax-tooltip-no">' +
				this.options.no +
				'</li></ul>'
			);

			this.setConfirmEvents();
		},

		setConfirmEvents: function () {
			var self = this;

			this.Tooltip.find('li.yax-tooltip-yes').click(function (event) {
				self.onYes();
				event.stopPropagation();
			});

			this.Tooltip.find('li.yax-tooltip-no').click(function (event) {
				self.onNo();
				event.stopPropagation();
			});
		},

		finalMessage: function () {
			/** @namespace this.options.finalMessageDuration */
			if (this.options.finalMessage) {
				var self = this;
				self.Tooltip.find('tooltip:first').html(this.options.finalMessage);
				self.Tooltip.find('ul').remove();

				self.setPositions();

				setTimeout(function () {
					self.hide();
					self.setContent();
				}, self.options.finalMessageDuration);
			} else {
				this.hide();
			}
		},

		onYes: function () {
			this.options.onYes(this.element);
			this.finalMessage();
		},

		onNo: function () {
			this.options.onNo(this.element);
			this.hide();
		}
	};

	Y.DOM.Function.Tooltip = function (options) {
		options = Y.extend({}, pluginOptions, options);

		var tooltip = new Tooltip(Y.DOM(this), options);

		return this.each(function () {
			return tooltip;
		});
	};

	//---

}());

// FILE: ./Source/Plugins/Tooltip/Tooltip.js

//---


