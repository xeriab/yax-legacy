/**
 * YAX Bootstrap Plugins | Dropdown
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

	// DROPDOWN CLASS DEFINITION
	// =========================

	var backdrop = '.dropdown-backdrop';
	var toggle = '[data-toggle="dropdown"]';

	var Dropdown = function (element) {
		Y.DOM(element).on('click.bs.dropdown', this.toggle);
	};

	function clearMenus(e) {
		if (e && e.which === 3) {
			return;
		}

		Y.DOM(backdrop).remove();

		Y.DOM(toggle).each(function () {
			var $parent = getParent(Y.DOM(this));
			var relatedTarget = { relatedTarget: this };

			if (!$parent.hasClass('open')) {
				return;
			}

			$parent.trigger(e = Y.DOM.Event('hide.bs.dropdown', relatedTarget));

			if (e.isDefaultPrevented()) {
				return;
			}

			$parent.removeClass('open').trigger('hidden.bs.dropdown', relatedTarget);
		});
	}

	Dropdown.VERSION = '3.2.0';

	function getParent($this) {
		var selector = $this.attr('data-target');

		if (!selector) {
			selector = $this.attr('href');
			selector = selector && /#[A-Za-z]/.test(selector) && selector
				.replace(/.*(?=#[^\s]*$)/, ''); // strip for ie7
		}

		var $parent = selector && Y.DOM(selector);

		return $parent && $parent.length ? $parent : $this.parent();
	}

	Dropdown.prototype.toggle = function (e) {
		var $this = Y.DOM(this);

		if ($this.is('.disabled, :disabled')) {
			return;
		}

		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');

		clearMenus();

		if (!isActive) {
			if ('ontouchstart' in document.documentElement && !$parent.closest('.navbar-nav').length) {
				// if mobile we use a backdrop because click events don't delegate
				Y.DOM('<div class="dropdown-backdrop"/>').insertAfter(Y.DOM(this)).on('click', clearMenus);
			}

			var relatedTarget = {
				relatedTarget: this
			};

			$parent.trigger(e = Y.DOM.Event('show.bs.dropdown', relatedTarget));

			if (e.isDefaultPrevented()) {
				return;
			}

			$this.trigger('focus');

			$parent
				.toggleClass('open')
				.trigger('shown.bs.dropdown', relatedTarget);
		}

		return false;
	};

	Dropdown.prototype.keydown = function (e) {
		if (!/(38|40|27)/.test(e.keyCode)) {
			return;
		}

		var $this = Y.DOM(this);

		e.preventDefault();
		e.stopPropagation();

		if ($this.is('.disabled, :disabled')) {
			return;
		}

		var $parent = getParent($this);
		var isActive = $parent.hasClass('open');

		if (!isActive || (isActive && e.keyCode === 27)) {
			if (e.which === 27) {
				$parent.find(toggle).trigger('focus');
			}
			return $this.trigger('click');
		}

		var desc = ' li:not(.divider):visible a';
		var $items = $parent.find('[role="menu"]' + desc + ', [role="listbox"]' + desc);

		if (!$items.length) {
			return;
		}

		var index = $items.index($items.filter(':focus'));

		if (e.keyCode === 38 && index > 0) {
			index--;
		} // up

		if (e.keyCode === 40 && index < $items.length - 1) {
			index++;
		} // down

		if (!~index) {
			index = 0;
		}

		$items.eq(index).trigger('focus');
	};

	// DROPDOWN PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.dropdown');

			if (!data) {
				data = new Dropdown(this);
				$this.data('bs.dropdown', data);
			}

			if (typeof option === 'string') {
				data[option].call($this);
			}
		});
	}

	var old = Y.DOM.fn.dropdown;

	Y.DOM.fn.dropdown = Plugin;
	Y.DOM.fn.dropdown.Constructor = Dropdown;


	// DROPDOWN NO CONFLICT
	// ====================

	Y.DOM.fn.dropdown.noConflict = function () {
		Y.DOM.fn.dropdown = old;
		return this;
	};


	// APPLY TO STANDARD DROPDOWN ELEMENTS
	// ===================================

	Y.DOM(document)
		.on('click.bs.dropdown.data-api', clearMenus)
		.on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
			e.stopPropagation();
		})
		.on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
		.on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown);

	//---

}());

//---
