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

	Y.Extend(Y.Settings.DOM, {
		WaitForMe: {
			Opacity: 1.0,
			Effect: 'bounce',
			Content: '',
			Background: 'rgba(245, 245, 245, .75)',
			Color: 'rgba(10, 20, 30, .9)',
			Width: 0,
			Height: 0,
			Container: 'body',
			Trigger: 'yax.waitformeclose'
		}
	});

	var PluginOptions = Y.Settings.DOM.WaitForMe;

	function WaitForMe(element, option) {
		this.Element = element;
		this.Options = option;
		this.CSS_Class = 'yax-waitforme';
		this.Effects = null;
		this.EffectElementCount = null;
		this.CreateSubElement = false;
		this.SpecificAttr = 'background-color';
		this.EffectElementHTML = '';
		this.ContainerSize = null;
		this.ElementSize = null;
		this.Div = null;
		this.Content = null;

		this.init();
	}

	WaitForMe.prototype = {
		init: function () {
			this.setContent();

			this._init_();

			//			if (this.Content) {
			//				this.setEvents();
			//			}

			this.setEvents();
		},

		Show: function () {
			// Y.DOM(this.Element).css('cursor', 'none');

			// Close all other WaitForMe
			Y.DOM('div.yax-waitforme').hide();
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

			switch (this.Options.Effect) {
			case 'none':
				this.EffectElementCount = 0;
				break;

			case 'bounce':
				this.EffectElementCount = 3;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'rotateplane':
				this.EffectElementCount = 1;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'stretch':
				this.EffectElementCount = 5;
				this.ContainerSize = '';

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'orbit':
				this.EffectElementCount = 2;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'roundBounce':
				this.EffectElementCount = 12;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'win8':
				this.EffectElementCount = 5;
				this.CreateSubElement = true;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;
				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'win8_linear':
				this.EffectElementCount = 5;
				this.CreateSubElement = true;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'ios':
				this.EffectElementCount = 12;

				// this.ContainerSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ContainerSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				this.ElementSize = '';

				break;

			case 'facebook':
				this.EffectElementCount = 3;
				this.ContainerSize = '';

				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;

			case 'rotation':
				this.EffectElementCount = 1;
				this.SpecificAttr = 'border-color';
				this.ContainerSize = '';

				// this.ElementSize = 'width:' + this.Options.Width + '; height:' + this.Options.Height;

				this.ElementSize = {
					width: this.Options.Width.toString() + 'px',
					height: this.Options.Height.toString() + 'px'
				};

				break;
			}

			this.ElementSize = 'width: ' + this.ElementSize.width + '; height: ' + this
				.ElementSize.height;
			this.ContainerSize = 'width: ' + this.ContainerSize.width + '; height: ' +
				this.ContainerSize.height;

			if (Y.Lang.isEmpty(this.Options.Width) && Y.Lang.isEmpty(this.Options.Height)) {
				this.ElementSize = Y.Lang.empty();
				this.ContainerSize = Y.Lang.empty();
			}

			this.Effects = Y.DOM('<div class="' + this.CSS_Class + '-progress ' + this
				.Options.Effect + '"></div>');

			if (this.EffectElementCount > 0) {


				for (x = 1; x <= this.EffectElementCount; ++x) {
					if (this.CreateSubElement) {
						this.EffectElementHTML += '<div class="' + this.CSS_Class +
							'-progress-element' + x + '" style="' + this.ElementSize +
							'"><div style="' + this.SpecificAttr + ': ' +
							this.Options.Color + '"></div></div>';
					} else {
						this.EffectElementHTML += '<div class="' + this.CSS_Class +
							'-progress-element' + x + '" style="' + this.SpecificAttr +
							': ' + this.Options.Color + '; ' + this.ElementSize + '"></div>';
					}

				}

				this.Effects = Y.DOM('<div class="' + this.CSS_Class + '-progress ' +
					this.Options.Effect + '" style="' + this.ContainerSize + '">' + this.EffectElementHTML +
					'</div>');

				//				this.Effects = Y.DOM('<div></div>').addClass(this.CSS_Class + '-progress ' + this.Options.Effect).css(this.ContainerSize);
				//				this.Effects.append(this.EffectElementHTML);
			}

			if (this.Options.Content) {
				this.Content = Y.DOM('<div class="' + this.CSS_Class +
					'-text" style="color: ' + this.Options.Color + ';">' + this.Options.Content +
					'</div>');
			}

			if (this.Element.find('> .' + this.CSS_Class)) {
				this.Element.find('> .' + this.CSS_Class).remove();
			}

			this.Div = Y.DOM('<div class="' + this.CSS_Class + '-content"></div>');

			this.Div.append(this.Effects, this.Content);

			this.Div.appendTo(this.WaitForMe);

			if (this.Element[0].tagName === 'HTML') {
				this.Element = Y.DOM('body');
			}

			this.Element.addClass(this.CSS_Class + '-container').append(this.WaitForMe);

			this.Element.find('> .' + this.CSS_Class).css({
				background: this.Options.Background
			});

			this.Element.find('.' + this.CSS_Class + '-content').css({
				marginTop: -this.Element.find('.' + this.CSS_Class + '-content').outerHeight() /
					2 + 'px'
			});
		},

		Close: function () {
			this.Element.removeClass(this.CSS_Class + '-container');
			this.Element.find('.' + this.CSS_Class).remove();
		},

		setContent: function () {
			// Get WaitForMe content
			if (this.Options.Content) {
				this.Content = this.Options.Content;
			} else if (this.Element.data('YAX-WaitForMe')) {
				this.Content = this.Element.data('YAX-WaitForMe');
			} else if (Y.Lang.isEmpty(this.Options.Content)) {
				this.Content = Y.Lang.empty();
			} else if (Y.Lang.isNull(this.Options.Content)) {
				this.Content = Y.Lang.empty();
			} else {
				Y.ERROR('No content for WaitForMe: ' + this.Element.selector);
				return;
			}

			if (this.Content.charAt(0) === '#') {
				Y.DOM(this.Content).hide();
				this.Content = Y.DOM(this.Content).html();
				this.contentType = 'html';
			} else {
				this.contentType = 'text';
			}

			// Create WaitForMe container
			this.WaitForMe = Y.DOM('<div></div>').addClass(this.CSS_Class);

			if (this.Options.Container) {
				this.WaitForMe.prependTo(this.Options.Container);
			} else {
				this.WaitForMe.insertAfter(this.Element.parent());
			}

			// Adjust size for html WaitForMe
			if (this.contentType === 'html') {
				this.WaitForMe.css('max-width', 'none');
			}

			this.WaitForMe.css('opacity', this.Options.Opacity);
		},

		setEvents: function () {
			var self = this;

			if (this.Options.Trigger === 'yax.waitformeclose') {
				this.WaitForMe.on('yax.waitformeclose', function () {
					self.Close();
				});

				this.Element.on('yax.waitformeclose', function () {
					self.Close();
				});
			}
		}
	};

	Y.DOM.Function.WaitForMe = function (option) {
		var options = Y.Extend({}, PluginOptions, option);

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

