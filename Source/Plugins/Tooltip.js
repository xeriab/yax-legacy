/**
 * YAX Plugins | Tooltip
 *
 * Cross browser Tooltip implementation using YAX's API [Node]
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
/*global Y, YAX */

(function () {

	'use strict';

	// Plugin information

	// Default options for the Plugin
//	Y.Settings.Node = {
//		Tooltip: {
//			Opacity: 0.75,
//			Content: '',
//			Size: 'small',
//			Gravity: 'north',
//			Theme: 'dark',
//			Trigger: 'hover',
//			Animation: 'flipIn',
//			Confirm: false,
//			Yes: 'Yes',
//			No: 'No',
//			FinalMessage: '',
//			FinalMessageDuration: 500,
//			OnYes: Y.Lang.Noop,
//			OnNo: Y.Lang.Noop,
//			Container: 'body'
//		}
//	};

	Y.Extend(Y.Settings.DOM, {
		Tooltip: {
			Opacity: 0.75,
			Content: '',
			Size: 'small',
			Gravity: 'north',
			Theme: 'dark',
			Trigger: 'hover',
			Animation: 'flipIn',
			Confirm: false,
			Yes: 'Yes',
			No: 'No',
			FinalMessage: '',
			FinalMessageDuration: 500,
			OnYes: Y.Lang.noop,
			OnNo: Y.Lang.noop,
			Container: 'body'
		}
	});

//	Y.Settings.Node.Tooltip = {
//		Opacity: 0.75,
//		Content: '',
//		Size: 'small',
//		Gravity: 'north',
//		Theme: 'dark',
//		Trigger: 'hover',
//		Animation: 'flipIn',
//		Confirm: false,
//		Yes: 'Yes',
//		No: 'No',
//		FinalMessage: '',
//		FinalMessageDuration: 500,
//		OnYes: Y.Lang.Noop,
//		OnNo: Y.Lang.Noop,
//		Container: 'body'
//	};

	var PluginOptions = Y.Settings.DOM.Tooltip;

	function Tooltip(element, options) {
		this.Element = element;
		this.Options = options;
		this.Delay = null;
		this.init();
	}

	Tooltip.prototype = {
		init: function () {
			this.setContent();

			if (this.Content) {
				this.setEvents();
			}
		},

		Show: function () {
			Y.Node(this.Element).css('cursor', 'pointer');

			// Close all other Tooltips
			Y.Node('div.exen-YAX-Tooltip').hide();
			// Y.Node('div.exen-YAX-Tooltip').remove();
			window.clearTimeout(this.Delay);
			this.Tooltip.css('display', 'block');
		},

		Hide: function () {
			this.Tooltip.hide();
			window.clearTimeout(this.Delay);
			// this.Tooltip.css('display', 'none');
			this.Tooltip.css('display', 'none');
		},

		Toggle: function () {
			if (this.Tooltip.is(':visible')) {
				this.Hide();
			} else {
				this.Show();
			}
		},

		addAnimation: function () {
			switch (this.Options.Animation) {
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
			if (this.Options.Content) {
				this.Content = this.Options.Content;
			} else if (this.Element.data('tooltip')) {
				this.Content = this.Element.data('tooltip');
			} else if (this.Element.title()) {
				this.Content = this.Element.title();
				this.Element.title('');
			} else {
				Y.ERROR('No content for Tooltip: ' + this.Element.selector);
				return;
			}

			if (this.Content.charAt(0) === '#') {
				Y.Node(this.Content).hide();
				this.Content = Y.Node(this.Content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create Tooltip container
			this.Tooltip = Y.Node('<div class="exen-YAX-Tooltip ' +
				this.Options.Theme + ' ' +
				this.Options.Size + ' ' +
				this.Options.Gravity +
				'"><div class="TooltipText">' +
				this.Content +
				'</div><div class="tip"></div></div>'
			);

			this.Tip = this.Tooltip.find('.tip');


			// this.Tooltip.insertBefore(this.Element.parent());

			// this.Options.Container ? this.Tooltip.prependTo(this.Options.Container) : this.Tooltip.insertAfter(this.Element.parent());
			if (this.Options.Container !== '' || this.Options.Container) {
				this.Tooltip.prependTo(this.Options.Container);
				// this.Tooltip.appendTo(this.Options.Container);
			} else {
				// this.Tooltip.insertAfter(this.Element.parent());
				this.Tooltip.insertBefore(this.Element.parent());
				// this.Tooltip.insertAfter(this.Element.parent());
				// this.Element.append(this.Tooltip);
			}


			// this.Tooltip.insertBefore(Y.Node(this.Element));

			// Y.Node(this.Element).parent().append(this.Tooltip);

			// this.Element.append(this.Tooltip);


			// Adjust size for html Tooltip
			if (this.contentType === 'html') {
				this.Tooltip.css('max-width', 'none');
			}

			this.Tooltip.css('opacity', this.Options.Opacity);

			this.addAnimation();

			if (this.Options.Confirm) {
				this.addConfirm();
			}
		},

		getPosition: function () {
			var Element = this.Element[0];
			return Y.Node.Extend({}, (typeof Element.getBoundingClientRect === 'function') ? Element.getBoundingClientRect() : {
				width: Element.offsetWidth,
				height: Element.offsetHeight
			}, this.Element.offset());
		},

		setPositions: function () {
			// var pos = this.getPosition(),
			var leftPos = 0,
				topPos = 0,
				ElementTop = this.Element.offset().top,
				ElementLeft = this.Element.offset().left;

			if (this.Element.css('position') === 'fixed' || this.Element.css('position') === 'absolute') {
				ElementTop = 0;
				ElementLeft = 0;
			}

			switch (this.Options.Gravity) {
				case 'south':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - this.Tooltip.outerWidth() / 2;
					topPos = ElementTop - this.Tooltip.outerHeight() - this.Tip.outerHeight() / 2;
					break;

				case 'west':
					leftPos = ElementLeft + this.Element.outerWidth() + this.Tip.outerWidth() / 2;
					topPos = ElementTop + this.Element.outerHeight() / 2 - (this.Tooltip.outerHeight() / 2);
					break;

				case 'north':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - (this.Tooltip.outerWidth() / 2);
					topPos = ElementTop + this.Element.outerHeight() + this.Tip.outerHeight() / 2;
					break;

				case 'east':
					leftPos = ElementLeft - this.Tooltip.outerWidth() - this.Tip.outerWidth() / 2;
					topPos = ElementTop + this.Element.outerHeight() / 2 - this.Tooltip.outerHeight() / 2;
					break;

				case 'center':
					leftPos = ElementLeft + this.Element.outerWidth() / 2 - (this.Tooltip.outerWidth() / 2);
					topPos = ElementTop + this.Element.outerHeight() / 2 - this.Tip.outerHeight() / 2;
					break;
			}

			this.Tooltip.css('left', leftPos);
			this.Tooltip.css('top', topPos);
		},

		setEvents: function () {
			var self = this;

			if (this.Options.Trigger === 'hover' || this.Options.Trigger === 'mouseover' || this.Options.Trigger === 'onmouseover') {
				this.Element.mouseover(function () {
					self.setPositions();
					self.Show();
				}).mouseout(function () {
					self.Hide();
				});
			} else if (this.Options.Trigger === 'click' || this.Options.Trigger === 'onclick') {
				this.Tooltip.click(function (event) {
					event.stopPropagation();
				});

				this.Element.click(function (event) {
					event.preventDefault();
					self.setPositions();
					self.Toggle();
					event.stopPropagation();
				});

				Y.Node('html').click(function () {
					self.Hide();
				});
			}
		},

		activate: function () {
			this.setContent();

			if (this.Content) {
				this.setEvents();
			}
		},

		addConfirm: function () {
			this.Tooltip.append('<ul class="confirm"><li class="exen-YAX-Tooltip-yes">' +
				this.Options.Yes + '</li><li class="exen-YAX-Tooltip-no">' + this.Options.No + '</li></ul>');
			this.setConfirmEvents();
		},

		setConfirmEvents: function () {
			var self = this;

			this.Tooltip.find('li.exen-YAX-Tooltip-yes').click(function (event) {
				self.onYes();
				event.stopPropagation();
			});
			this.Tooltip.find('li.exen-YAX-Tooltip-no').click(function (event) {
				self.onNo();
				event.stopPropagation();
			});
		},

		finalMessage: function () {
			if (this.Options.FinalMessage) {
				var self = this;
				self.Tooltip.find('div:first').html(this.Options.FinalMessage);
				self.Tooltip.find('ul').remove();
				self.setPositions();
				setTimeout(function () {
					self.Hide();
					self.setContent();
				}, self.Options.FinalMessageDuration);
			} else {
				this.Hide();
			}
		},

		onYes: function () {
			this.Options.OnYes(this.Element);
			this.finalMessage();
		},

		onNo: function () {
			this.Options.OnNo(this.Element);
			this.Hide();
		}
	};

	Y.DOM.Function.Tooltip = function (options) {
		options = Y.Extend({}, PluginOptions, options);
		// options = Y.Extend(PluginOptions, options);

		return this.each(function () {
			return new Tooltip(Y.DOM(this), options);
		});
	};

	//---

}());

//---
