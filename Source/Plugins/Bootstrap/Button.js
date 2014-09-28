/**
 * YAX Bootstrap Plugins | Button
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

	// BUTTON PUBLIC CLASS DEFINITION
	// ==============================
	var Button = function (element, options) {
		this.element = Y.DOM(element);
		this.options = Y.Extend({}, Button.DEFAULTS, options);
		this.isLoading = false;
	};

	Button.VERSION = '3.2.0';

	Button.DEFAULTS = {
		loadingText: 'loading...'
	};

	Button.prototype.setState = function (state) {
		var d = 'disabled';
		var $el = this.element;
		var val = $el.is('input') ? 'val' : 'html';
		var data = $el.data();

		state = state + 'Text';

		/** @namespace data.resetText */
		if (data.resetText === null) {
			$el.data('resetText', $el[val]());
		}

		$el[val](data[state] === null ? this.options[state] : data[state]);

		// push to event loop to allow forms to submit
		setTimeout(Y.DOM.proxy(function () {
			if (state === 'loadingText') {
				this.isLoading = true;
				$el.addClass(d).attr(d, d);
			} else if (this.isLoading) {
				this.isLoading = false;
				$el.removeClass(d).removeAttr(d);
			}
		}, this), 0);
	};

	Button.prototype.toggle = function () {
		var changed = true;
		var parent = this.element.closest('[data-toggle="buttons"]');

		if (parent.length) {
			var $input = this.element.find('input');

			if ($input.prop('type') === 'radio') {
				if ($input.prop('checked') && this.element.hasClass('active')) {
					changed = false;
				} else {
					parent.find('.active').removeClass('active');
				}
			}

			if (changed) {
				$input.prop('checked', !this.element.hasClass('active')).trigger('change');
			}
		}

		if (changed) {
			this.element.toggleClass('active');
		}
	};

	// BUTTON PLUGIN DEFINITION
	// ========================
	function Plugin(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.button');
			var options = typeof option === 'object' && option;

			if (!data) {
				data = new Button(this, options);
				$this.data('bs.button', data);
			}

			if (option === 'toggle') {
				data.toggle();
			} else if (option) {
				data.setState(option);
			}
		});
	}

	var old = Y.DOM.fn.button;

	Y.DOM.fn.button = Plugin;
	Y.DOM.fn.button.Constructor = Button;

	// BUTTON NO CONFLICT
	// ==================
	Y.DOM.fn.button.noConflict = function () {
		Y.DOM.fn.button = old;
		return this;
	};

	// BUTTON DATA-API
	// ===============
	Y.DOM(Y.Document).on('click.bs.button.data-api', '[data-toggle^="button"]', function (e) {
		var $btn = Y.DOM(e.target);

		if (!$btn.hasClass('btn')) {
			$btn = $btn.closest('.btn');
		}

		Plugin.call($btn, 'toggle');

		e.preventDefault();
	});

	//---

}());

//---
