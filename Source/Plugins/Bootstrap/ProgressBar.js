/**
 * YAX Bootstrap Plugins | ProgressBar
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
/*global Y, YAX, $ */

(function () {

	'use strict';

	// PROGRESSBAR CLASS DEFINITION
	// ============================

	var ProgressBar = function(element, options) {
		this.element = Y.DOM(element);
		this.options = Y.Extend({}, ProgressBar.defaults, options);
	};

	ProgressBar.defaults = {
		transition_delay: 300,
		refresh_speed: 50,
		display_text: 'none',
		use_percentage: true,
		percent_format: function(percent) {
			return percent + '%';
		},
		/* jshint -W098 */
		amount_format: function(amount_part, amount_max, amount_min) {
			return amount_part + ' / ' + amount_max;
		},
		update: Y.Lang.Noop,
		done: Y.Lang.Noop,
		fail: Y.Lang.Noop
	};

	ProgressBar.prototype.transition = function() {
		var $this = this.element;
		var $parent = $this.parent();
		var $back_text = this.$back_text;
		var $front_text = this.$front_text;
		var options = this.options;
		var data_transitiongoal = parseInt($this.attr('data-transitiongoal'), 10);
		var aria_valuemin = parseInt($this.attr('aria-valuemin'), 10) || 0;
		var aria_valuemax = parseInt($this.attr('aria-valuemax'), 10) || 100;
		var is_vertical = $parent.hasClass('vertical');
		var update = options.update && typeof options.update === 'function' ? options.update : ProgressBar.defaults.update;
		var done = options.done && typeof options.done === 'function' ? options.done : ProgressBar.defaults.done;
		var fail = options.fail && typeof options.fail === 'function' ? options.fail : ProgressBar.defaults.fail;

		if (isNaN(data_transitiongoal)) {
			fail('data-transitiongoal not set');
			return;
		}
		var percentage = Math.round(100 * (data_transitiongoal - aria_valuemin) / (aria_valuemax - aria_valuemin));

		if (options.display_text === 'center' && !$back_text && !$front_text) {
			this.$back_text = $back_text = Y.DOM('<span>').addClass('ProgressBar-back-text').prependTo($parent);
			this.$front_text = $front_text = Y.DOM('<span>').addClass('ProgressBar-front-text').prependTo($this);

			var parent_size;

			if (is_vertical) {
				parent_size = $parent.css('height');
				$back_text.css({height: parent_size, 'line-height': parent_size});
				$front_text.css({height: parent_size, 'line-height': parent_size});

				Y.DOM(window).resize(function() {
					parent_size = $parent.css('height');
					$back_text.css({height: parent_size, 'line-height': parent_size});
					$front_text.css({height: parent_size, 'line-height': parent_size});
				}); // normal resizing would brick the structure because width is in px
			}
			else {
				parent_size = $parent.css('width');
				$front_text.css({width: parent_size});

				Y.DOM(window).resize(function() {
					parent_size = $parent.css('width');
					$front_text.css({width: parent_size});
				}); // normal resizing would brick the structure because width is in px
			}
		}

		setTimeout(function() {
			var current_percentage;
			var current_value;
			var this_size;
			var parentSize;
			var text;

			if (is_vertical) {
				$this.css('height', percentage + '%');
			}
			else {
				$this.css('width', percentage + '%');
			}

			var progress = setInterval(function() {
				if (is_vertical) {
					this_size = $this.height();
					parentSize = $parent.height();
				}
				else {
					this_size = $this.width();
					parentSize = $parent.width();
				}

				current_percentage = Math.round(100 * this_size / parentSize);
				current_value = Math.round(aria_valuemin + this_size / parentSize * (aria_valuemax - aria_valuemin));

				if (current_percentage >= percentage) {
					current_percentage = percentage;
					current_value = data_transitiongoal;
					done($this);
					clearInterval(progress);
				}

				if (options.display_text !== 'none') {
					text = options.use_percentage ? options.percent_format(current_percentage) : options.amount_format(current_value, aria_valuemax, aria_valuemin);

					if (options.display_text === 'fill') {
						$this.text(text);
					}
					else if (options.display_text === 'center') {
						$back_text.text(text);
						$front_text.text(text);
					}
				}
				$this.attr('aria-valuenow', current_value);

				update(current_percentage, $this);
			}, options.refresh_speed);
		}, options.transition_delay);
	};


	// PROGRESSBAR PLUGIN DEFINITION
	// =============================

	var old = Y.DOM.fn.ProgressBar;

	Y.DOM.fn.ProgressBar = function(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.ProgressBar');
			var options = typeof option === 'object' && option;

			if (!data) {
				data = new ProgressBar(this, options);
				$this.data('bs.ProgressBar', data);
			}

			data.transition();
		});
	};

	Y.DOM.fn.ProgressBar.Constructor = ProgressBar;


	// PROGRESSBAR NO CONFLICT
	// =======================

	Y.DOM.fn.ProgressBar.noConflict = function () {
		Y.DOM.fn.ProgressBar = old;
		return this;
	};

	//---

}());

//---
