/**
 * YAX DOM | WiatForMe Plugin
 *
 *
 * @version     0.15
 * @depends:    Core, DOM, Events
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

	//---

	Y.extend(Y.Settings.DOM, {
		waitForMe: {
			opacity: 1.0,
			effect: 'bounce',
			content: '',
			background: 'rgba(245, 245, 245, .75)',
			color: 'rgba(10, 20, 30, .9)',
			width: 0,
			height: 0,
			container: 'body',
			trigger: 'close.yax.waitforme'
		}
	});

	var pluginOptions = Y.Settings.DOM.waitForMe;

	function WaitForMe(element, option) {
		this.element = element;
		this.options = option;
		this.cssClass = 'js-waitforme';
		this.effects = null;
		this.effectElementCount = null;
		this.createSubElement = false;
		this.specificAttr = 'background-color';
		this.effectElementHTML = '';
		this.containerSize = null;
		this.elementSize = null;
		this.div = null;
		this.content = null;

		this.init();
	}

	WaitForMe.prototype = {
		init: function () {
			this.setContent();

			this._init_();

			//			if (this.content) {
			//				this.setEvents();
			//			}

			this.setEvents();
		},

		Show: function () {
			// Y.DOM(this.element).css('cursor', 'none');

			// Close all other WaitForMe
			Y.DOM('div.js-waitforme').hide();
			this.WaitForMe.css('display', 'block');
		},

		Hide: function () {
			this.WaitForMe.hide();
			this.WaitForMe.css('display', 'none');
		},

		Toggle: function () {
			if (this.WaitForMe.is(':visible')) {
				this.Hide();
			} else {
				this.Show();
			}
		},

		_init_: function () {
			var x;

			switch (this.options.effect) {
			case 'none':
				this.effectElementCount = 0;
				break;

			case 'bounce':
				this.effectElementCount = 3;
				this.containerSize = '';

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;

			case 'rotateplane':
				this.effectElementCount = 1;
				this.containerSize = '';

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;

			case 'stretch':
				this.effectElementCount = 5;
				this.containerSize = '';

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;

			case 'orbit':
				this.effectElementCount = 2;

				this.containerSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				this.elementSize = '';

				break;

			case 'roundBounce':
				this.effectElementCount = 12;

				this.containerSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				this.elementSize = '';

				break;

			case 'win8':
				this.effectElementCount = 5;
				this.createSubElement = true;

				// this.containerSize = 'width:' + this.options.width + '; height:' + this.options.height;
				// this.elementSize = 'width:' + this.options.width + '; height:' + this.options.height;

				this.containerSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;

			case 'win8_linear':
				this.effectElementCount = 5;
				this.createSubElement = true;

				// this.containerSize = 'width:' + this.options.width + '; height:' + this.options.height;

				this.containerSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				this.elementSize = '';

				break;

			case 'ios':
				this.effectElementCount = 12;

				// this.containerSize = 'width:' + this.options.width + '; height:' + this.options.height;

				this.containerSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				this.elementSize = '';

				break;

			case 'facebook':
				this.effectElementCount = 3;
				this.containerSize = '';

				// this.elementSize = 'width:' + this.options.width + '; height:' + this.options.height;

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;

			case 'rotation':
				this.effectElementCount = 1;
				this.specificAttr = 'border-color';
				this.containerSize = '';

				// this.elementSize = 'width:' + this.options.width + '; height:' + this.options.height;

				this.elementSize = {
					width: this.options.width.toString() + 'px',
					height: this.options.height.toString() + 'px'
				};

				break;
			}

			this.elementSize = 'width: ' + this.elementSize.width + '; height: ' + this
				.elementSize.height;
			this.containerSize = 'width: ' + this.containerSize.width + '; height: ' +
				this.containerSize.height;

			if (Y.Lang.isEmpty(this.options.width) && Y.Lang.isEmpty(this.options.height)) {
				this.elementSize = Y.Lang.empty();
				this.containerSize = Y.Lang.empty();
			}

			this.effects = Y.DOM('<div class="' + this.cssClass + '-progress ' + this
				.options.effect + '"></div>');

			if (this.effectElementCount > 0) {


				for (x = 1; x <= this.effectElementCount; ++x) {
					if (this.createSubElement) {
						this.effectElementHTML += '<div class="' + this.cssClass +
							'-progress-element' + x + '" style="' + this.elementSize +
							'"><div style="' + this.specificAttr + ': ' +
							this.options.color + '"></div></div>';
					} else {
						this.effectElementHTML += '<div class="' + this.cssClass +
							'-progress-element' + x + '" style="' + this.specificAttr +
							': ' + this.options.color + '; ' + this.elementSize + '"></div>';
					}

				}

				this.effects = Y.DOM('<div class="' + this.cssClass + '-progress ' +
					this.options.effect + '" style="' + this.containerSize + '">' + this.effectElementHTML +
					'</div>');

				//				this.effects = Y.DOM('<div></div>').addClass(this.cssClass + '-progress ' + this.options.effect).css(this.containerSize);
				//				this.effects.append(this.effectElementHTML);
			}

			if (this.options.content) {
				this.content = Y.DOM('<div class="' + this.cssClass +
					'-text" style="color: ' + this.options.color + ';">' + this.options.content +
					'</div>');
			}

			if (this.element.find('> .' + this.cssClass)) {
				this.element.find('> .' + this.cssClass).remove();
			}

			this.div = Y.DOM('<div class="' + this.cssClass + '-content"></div>');

			this.div.append(this.effects, this.content);

			this.div.appendTo(this.WaitForMe);

			if (this.element[0].tagName === 'HTML') {
				this.element = Y.DOM('body');
			}

			this.element.addClass(this.cssClass + '-container').append(this.WaitForMe);

			this.element.find('> .' + this.cssClass).css({
				background: this.options.background
			});

			this.element.find('.' + this.cssClass + '-content').css({
				marginTop: -this.element.find('.' + this.cssClass + '-content').outerHeight() /
					2 + 'px'
			});
		},

		Close: function () {
			this.element.removeClass(this.cssClass + '-container');
			this.element.find('.' + this.cssClass).remove();
		},

		setContent: function () {
			// Get WaitForMe content
			if (this.options.content) {
				this.content = this.options.content;
			} else if (this.element.data('YAX-WaitForMe')) {
				this.content = this.element.data('YAX-WaitForMe');
			} else if (Y.Lang.isEmpty(this.options.content)) {
				this.content = Y.Lang.empty();
			} else if (Y.Lang.isNull(this.options.content)) {
				this.content = Y.Lang.empty();
			} else {
				Y.ERROR('No content for WaitForMe: ' + this.element.selector);
				return;
			}

			if (this.content.charAt(0) === '#') {
				Y.DOM(this.content).hide();
				this.content = Y.DOM(this.content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create WaitForMe container
			this.WaitForMe = Y.DOM('<div></div>').addClass(this.cssClass);

			if (this.options.container) {
				this.WaitForMe.prependTo(this.options.container);
			} else {
				this.WaitForMe.insertAfter(this.element.parent());
			}

			// Adjust size for html WaitForMe
			if (this.contentType === 'html') {
				this.WaitForMe.css('max-width', 'none');
			}

			this.WaitForMe.css('opacity', this.options.opacity);
		},

		setEvents: function () {
			var self = this;

			if (this.options.trigger === 'close.yax.waitforme') {
				this.WaitForMe.on('close.yax.waitforme', function () {
					self.Close();
				});

				this.element.on('close.yax.waitforme', function () {
					self.Close();
				});
			}
		}
	};

	Y.DOM.Function.waitForMe = function (option) {
		var options = Y.extend({}, pluginOptions, option);

		if (option === 'close') {
			return new WaitForMe(Y.DOM(this), options).Close();
		}

		return this.each(function () {
			return new WaitForMe(Y.DOM(this), options);
		});
	};

	//---

}());

//---