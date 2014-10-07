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

	Y.extend(Y.Settings.DOM, {
		tooltip: {
			opacity: 1,
			content: '',
			size: 'small',
			gravity: 'north',
			theme: 'dark',
			trigger: 'hover',
			animation: 'flipIn',
			confirm: false,
			yes: 'Yes',
			no: 'No',
			finalMessage: '',
			finalMessageDuration: 500,
			onYes: Y.noop,
			onNo: Y.noop,
			container: 'body'
		}
	});

	var pluginOptions = Y.Settings.DOM.tooltip;

	function Tooltip(element, options) {
		this.element = element;
		this.options = options;
		this.delay = null;
		this.init();
	}

	Tooltip.prototype = {
		init: function () {
			this.setContent();

			if (this.content) {
				this.setEvents();
			}
		},

		show: function () {
			Y.DOM(this.element).css('cursor', 'pointer');

			// Close all other Tooltips
			// Y.DOM('div.yax-tooltip').hide();
			Y.DOM('div.yax-tooltip').remove();
			Y.win.clearTimeout(this.delay);
			this.setContent();
			this.setPositions();

			this.Tooltip.css('display', 'block');
		},

		hide: function () {
			// this.Tooltip.hide();
			this.Tooltip.remove();
			window.clearTimeout(this.delay);
			// this.Tooltip.css('display', 'none');
			this.Tooltip.css('display', 'none');
		},

		toggle: function () {
			if (this.Tooltip.is(':visible')) {
				this.hide();
			} else {
				this.show();
			}
		},

		addAnimation: function () {
			switch (this.options.animation) {
			case 'none':
				break;

			case 'fadeIn':
				this.Tooltip.addClass('animated');
				this.Tooltip.addClass('fadeIn');
				break;

			case 'flipIn':
				this.Tooltip.addClass('animated');
				this.Tooltip.addClass('flipIn');
				break;
			}
		},

		setContent: function () {
			// Get Tooltip content
			if (this.options.content) {
				this.content = this.options.content;
			} else if (this.element.data('tooltip')) {
				this.content = this.element.data('tooltip');
			} else if (this.element.title()) {
				this.content = this.element.title();
				this.element.title('');
			} else {
				Y.error('no content for Tooltip: ' + this.element.selector);
				return;
			}

			if (this.content.charAt(0) === '#') {
				Y.DOM(this.content).hide();
				this.content = Y.DOM(this.content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create Tooltip container
			this.Tooltip = Y.DOM('<div class="yax-tooltip ' +
				this.options.theme + ' ' +
				this.options.size + ' ' +
				this.options.gravity +
				'"><div class="tooltiptext">' +
				this.content +
				'</div><div class="tip"></div></div>'
			);

			this.Tip = this.Tooltip.find('.tip');


			// this.Tooltip.insertBefore(this.element.parent());

			// this.options.container ? this.Tooltip.prependTo(this.options.container) : this.Tooltip.insertAfter(this.element.parent());
			if (this.options.container !== '' || this.options.container) {
				this.Tooltip.prependTo(this.options.container);
				// this.Tooltip.appendTo(this.options.container);
			} else {
				// this.Tooltip.insertAfter(this.element.parent());
				// this.Tooltip.insertBefore(this.element.parent());
				this.Tooltip.insertBefore(this.element.parent());
			}


			// this.Tooltip.insertBefore(Y.DOM(this.element));

			// Y.DOM(this.element).parent().append(this.Tooltip);

			// this.element.append(this.Tooltip);


			// Adjust size for html Tooltip
			if (this.contentType === 'html') {
				this.Tooltip.css('max-width', 'none');
			}

			this.Tooltip.css('opacity', this.options.opacity);

			this.addAnimation();

			if (this.options.confirm) {
				this.addConfirm();
			}
		},

		getPosition: function () {
			var element = this.element[0];
			return Y.extend({}, (Y.isFunction(element.getBoundingClientRect)) ? element.getBoundingClientRect() : {
				width: element.offsetWidth,
				height: element.offsetHeight
			}, this.element.offset());
		},

		setPositions: function () {
			// var pos = this.getPosition();
			var leftPos = 0;
			var topPos = 0;
			var elemTop = this.element.offset().top;
			var elemLeft = this.element.offset().left;

			if (this.element.css('position') === 'fixed' ||
				this.element.css('position') === 'absolute') {
				elemTop = 0;
				elemLeft = 0;
			}

			if (Y.DOM(Y.win).width() < this.Tooltip.width() * 1.5) {
				this.Tooltip.css('max-width', Y.DOM(Y.win).width() / 2);
			} else {
				this.Tooltip.css('max-width', 340);
			}

			switch (this.options.gravity) {
				case 'south':
					leftPos = elemLeft + this.element.outerWidth() / 
						2 - this.Tooltip.outerWidth() / 2;
					
					topPos = elemTop - this.Tooltip.outerHeight() - 
						this.Tip.outerHeight() / 2;
					
					break;

				case 'west':
					leftPos = elemLeft + this.element.outerWidth() + 
						this.Tip.outerWidth() / 2;
					
					topPos = elemTop + this.element.outerHeight() / 
						2 - (this.Tooltip.outerHeight() /2);
					
					break;

				case 'north':
					leftPos = elemLeft + this.element.outerWidth() / 
						2 - (this.Tooltip.outerWidth() / 2);
					
					topPos = elemTop + this.element.outerHeight() + 
						this.Tip.outerHeight() / 2;
					
					break;

				case 'east':
					leftPos = elemLeft - this.Tooltip.outerWidth() - 
						this.Tip.outerWidth() / 2;
					
					topPos = elemTop + this.element.outerHeight() / 
						2 - this.Tooltip.outerHeight() / 2;
					
					break;

				case 'center':
					leftPos = elemLeft + this.element.outerWidth() / 
						2 - (this.Tooltip.outerWidth() / 2);
					
					topPos = elemTop + this.element.outerHeight() / 
						2 - this.Tip.outerHeight() / 2;
					
					break;
			}

			this.Tooltip.css('left', leftPos);
			this.Tooltip.css('top', topPos);
		},

		setEvents: function () {
			var self = this;

			if (this.options.trigger === 'hover' ||
				this.options.trigger === 'mouseover' ||
				this.options.trigger === 'onmouseover') {
				this.element.mouseover(function () {
					self.setPositions();
					self.show();
				}).mouseout(function () {
					self.hide();
				});
			} else if (this.options.trigger === 'click' ||
				this.options.trigger === 'onclick') {
				this.Tooltip.click(function (event) {
					event.stopPropagation();
				});

				this.element.click(function (event) {
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

			if (this.content) {
				this.setEvents();
			}
		},

		addConfirm: function () {
			this.Tooltip.append('<ul class="confirm"><li class="yax-tooltip-yes">' +
				this.options.yes + '</li><li class="yax-tooltip-no">' + this.options.no +
				'</li></ul>');
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
			if (this.options.finalMessage) {
				var self = this;
				self.Tooltip.find('div:first').html(this.options.finalMessage);
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

	Y.DOM.Function.tooltip = function (options) {
		options = Y.extend({}, pluginOptions, options);

		return this.each(function () {
			return new Tooltip(Y.DOM(this), options);
		});
	};

	//---

}());

// FILE: ./Source/Plugins/Tooltip/Tooltip.js

//---


