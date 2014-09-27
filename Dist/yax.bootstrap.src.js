/**
 * YAX Bootstrap Plugins | Transition
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

	// CSS TRANSITION SUPPORT (Shoutout: http://www.modernizr.com/)
	// ============================================================

	function transitionEnd() {
		var el = Y.Document.createElement('yaxbs');
		var name;

		var transEndEventNames = {
			WebkitTransition: 'webkitTransitionEnd',
			MozTransition: 'transitionend',
			OTransition: 'oTransitionEnd otransitionend',
			transition: 'transitionend'
		};

		for (name in transEndEventNames) {
			if (Y.HasOwnProperty.call(transEndEventNames, name)) {
				if (!Y.Lang.isDefined(el.style[name])) {
					return {
						// end: transEndEventNames[name]
						end: Y.DOM.fx.transitionEnd
					};
				}
			}
		}

		/*if (Y.DOM.fx) {
			return {
				end: Y.DOM.fx.transitionEnd
			};
		}*/

		return false; // explicit for ie8 (	._.)
	}

	// http://blog.alexmaccaw.com/css-transitions
	Y.DOM.Function.emulateTransitionEnd = function (duration) {
		var called = false;
		var $el = this;

		Y.DOM(this).one(Y.DOM.support.transition.end, function () {
			called = true;
		});

		var callback = function () {
			if (!called) {
				Y.DOM($el).trigger(Y.DOM.support.transition.end);
			} else {
				Y.DOM($el).unbind(Y.DOM.support.transition.end);
			}
		};

		//Y.DOM($el).stopTranAnim(callback);

		setTimeout(callback, duration);

		//Y.LOG(this);

		return this;
	};

	Y.DOM(function () {
		Y.DOM.support.transition = transitionEnd();

		if (!Y.DOM.support.transition) {
			return;
		}

		Y.DOM.each({
			'bsTransitionEnd': Y.DOM.fx.transitionEnd
		}, function (orig, fix) {
			var attaches = 0;

			var handler = function (event) {
				Y.DOM.event.simulate(fix, event.target, Y.Extend({}, event), true);
			};

			Y.DOM.event.special[orig] = {
				bindType: Y.DOM.support.transition.end,

				delegateType: Y.DOM.support.transition.end,

				handle: function (e) {
					if (Y.DOM(e.target).is(this)) {
						Y.LOG(e);
						return e.handleObj.handler.apply(this, arguments);
					}
				},

				setup: function () {
					if (attaches++ === 0) {
						Y.Document.addEventListener(orig, handler, true);
						Y.Document.addEventListener(fix, handler, true);
					}
				},

				teardown: function () {
					if (--attaches === 0) {
						Y.Document.removeEventListener(orig, handler, true);
						Y.Document.removeEventListener(fix, handler, true);
					}
				}
			};
		});

		/*Y.DOM.Event.special.bsTransitionEnd = {
			bindType: Y.DOM.support.transition.end,
			delegateType: Y.DOM.support.transition.end,
			handle: function (e) {
				if (Y.DOM(e.target).is(this)) {
					Y.LOG(e);
					return e.handleObj.handler.apply(this, arguments);
				}
			}
		};*/
	});

	//---

}());

//---


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
		this.options = Y.Extend({}, Affix.DEFAULTS, options);

		this.$target = Y.DOM(this.options.target)
			.on('scroll.bs.affix.data-api', Y.DOM.proxy(this.checkPosition, this))
			.on('click.bs.affix.data-api', Y.DOM.proxy(this.checkPositionWithEventLoop, this));

		this.element = Y.DOM(element);
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

		this.element.removeClass(Affix.RESET).addClass('affix');

		var scrollTop = this.$target.scrollTop();
		var position = this.element.offset();

		//return (this.pinnedOffset = position.top - scrollTop);

		this.pinnedOffset = position.top - scrollTop;

		return (this.pinnedOffset);
	};

	Affix.prototype.checkPositionWithEventLoop = function () {
		setTimeout(Y.DOM.proxy(this.checkPosition, this), 1);
	};

	Affix.prototype.checkPosition = function () {
		if (!this.element.is(':visible')) {
			return;
		}

		var scrollHeight = Y.DOM(Y.Document).height();
		var scrollTop = this.$target.scrollTop();
		var position = this.element.offset();
		var offset = this.options.offset;
		var offsetTop = offset.top;
		var offsetBottom = offset.bottom;

		if (typeof offset !== 'object') {
			offsetBottom = offsetTop = offset;
		}

		if (typeof offsetTop === 'function') {
			offsetTop = offset.top(this.element);
		}

		if (typeof offsetBottom === 'function') {
			offsetBottom = offset.bottom(this.element);
		}

		var affix = this.unpin !== null && (scrollTop + this.unpin <= position.top) ? false :
				offsetBottom !== null && (position.top + this.element.height() >= scrollHeight - offsetBottom) ? 'bottom' :
				offsetTop !== null && (scrollTop <= offsetTop) ? 'top' : false;

		if (this.affixed === affix) {
			return;
		}

		if (this.unpin !== null) {
			this.element.css('top', '');
		}

		var affixType = 'affix' + (affix ? '-' + affix : '');
		var e = Y.DOM.Event(affixType + '.bs.affix');

		this.element.trigger(e);

		if (e.isDefaultPrevented()) {
			return;
		}

		this.affixed = affix;
		this.unpin = affix === 'bottom' ? this.getPinnedOffset() : null;

		this.element
			.removeClass(Affix.RESET)
			.addClass(affixType)
			.trigger(Y.DOM.Event(affixType.replace('affix', 'affixed')));

		if (affix === 'bottom') {
			this.element.offset({
				top: scrollHeight - this.element.height() - offsetBottom
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
		this.$element = Y.DOM(element);
		this.options = Y.Extend({}, Button.DEFAULTS, options);
		this.isLoading = false;
	};

	Button.VERSION = '3.2.0';

	Button.DEFAULTS = {
		loadingText: 'loading...'
	};

	Button.prototype.setState = function (state) {
		var d = 'disabled';
		var $el = this.$element;
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
		var $parent = this.$element.closest('[data-toggle="buttons"]');

		if ($parent.length) {
			var $input = this.$element.find('input');

			if ($input.prop('type') === 'radio') {
				if ($input.prop('checked') && this.$element.hasClass('active')) {
					changed = false;
				} else {
					$parent.find('.active').removeClass('active');
				}
			}

			if (changed) {
				$input.prop('checked', !this.$element.hasClass('active')).trigger('change');
			}
		}

		if (changed) {
			this.$element.toggleClass('active');
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

				// Y.LOG($this);
			}

			// Y.LOG(option);

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
		// Y.LOG(e);
		var $btn = Y.DOM(e.target);

		if (!$btn.hasClass('btn')) {
			$btn = $btn.closest('.btn');
		}

		Plugin.call($btn, '');

		e.preventDefault();
	});

	//---

}());

//---


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
			if ('ontouchstart' in Y.Document.documentElement && !$parent.closest('.navbar-nav').length) {
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

	Y.DOM(Y.Document)
		.on('click.bs.dropdown.data-api', clearMenus)
		.on('click.bs.dropdown.data-api', '.dropdown form', function (e) {
			e.stopPropagation();
		})
		.on('click.bs.dropdown.data-api', toggle, Dropdown.prototype.toggle)
		.on('keydown.bs.dropdown.data-api', toggle + ', [role="menu"], [role="listbox"]', Dropdown.prototype.keydown);

	//---

}());

//---


/**
 * YAX Bootstrap Plugins | Collapse
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

	// COLLAPSE PUBLIC CLASS DEFINITION
	// ================================

	var Collapse = function (element, options) {
		this.element = Y.DOM(element);
		this.options = Y.Extend({}, Collapse.DEFAULTS, options);
		this.transitioning = null;

		if (this.options.parent) {
			this.parent = Y.DOM(this.options.parent);
		}

		if (this.options.toggle) {
			this.toggle();
		}
	};

	var Plugin;

	var old;

	Collapse.VERSION = '3.2.0';

	Collapse.DEFAULTS = {
		toggle: true
	};

	Collapse.prototype.dimension = function () {
		var hasWidth = this.element.hasClass('width');

		return hasWidth ? 'width' : 'height';
	};

	Collapse.prototype.show = function () {
		if (this.transitioning || this.element.hasClass('in')) {
			return;
		}

		var startEvent = Y.DOM.Event('show.bs.collapse');

		this.element.trigger(startEvent);

		if (startEvent.isDefaultPrevented()) {
			return;
		}

		var actives = this.parent && this.parent.find('> .panel > .in');

		if (actives && actives.length) {
			var hasData = actives.data('bs.collapse');

			if (hasData && hasData.transitioning) {
				return;
			}

			Plugin.call(actives, 'hide');

			if (hasData) {
				actives.data('bs.collapse', null);
			}
		}

		var dimension = this.dimension();

		this.element.removeClass('collapse')
			.addClass('collapsing')[dimension](0);

		this.transitioning = 1;

		var complete = function () {
			this.element.removeClass('collapsing').addClass('collapse in')[dimension]('');
			this.transitioning = 0;
			this.element.trigger('shown.bs.collapse');

			//Y.LOG('SHOW: ', this);
		};

		if (!Y.DOM.support.transition) {
			return complete.call(this);
		}

		var scrollSize = Y.Lang.camelise(['scroll', dimension].join('-'));

		/*this.element
			.one('bsTransitionEnd', Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350)[dimension](this.element[0][scrollSize]);*/

		/*this.element.one('bsTransitionEnd', Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350)[dimension](this.element[0][scrollSize]);*/

		this.element.bind(Y.DOM.support.transition.end, Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350)[dimension](this.element[0][scrollSize]);

		this.element.one('bsTransitionEnd', Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350)[dimension](this.element[0][scrollSize]);
	};

	Collapse.prototype.hide = function () {
		if (this.transitioning || !this.element.hasClass('in')) {
			return;
		}

		var startEvent = Y.DOM.Event('hide.bs.collapse');

		this.element.trigger(startEvent);

		if (startEvent.isDefaultPrevented()) {
			return;
		}

		var dimension = this.dimension();

		this.element[dimension](this.element[dimension]())[0].offsetHeight;

		this.element.addClass('collapsing')
			.removeClass('collapse')
			.removeClass('in');

		this.transitioning = 1;

		var complete = function () {
			this.transitioning = 0;
			this.element.trigger('hidden.bs.collapse');
			this.element.removeClass('collapsing').addClass('collapse');

			//Y.LOG('HIDE: ', this);
		};

		if (!Y.DOM.support.transition) {
			return complete.call(this);
		}

		/*this.element[dimension](0).one('bsTransitionEnd', Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350);*/

		this.element[dimension](0).bind(Y.DOM.support.transition.end, Y.DOM.Proxy(complete, this))
			.emulateTransitionEnd(350);

		this.element[dimension](0).one('bsTransitionEnd', Y.DOM.proxy(complete, this))
			.emulateTransitionEnd(350);
	};

	Collapse.prototype.toggle = function () {
		if (this.element.hasClass('in')) {
			this.hide();
		} else {
			this.show();
		}
	};


	// COLLAPSE PLUGIN DEFINITION
	// ==========================

	Plugin = function Plugin(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.collapse');
			var options = Y.Extend({}, Collapse.DEFAULTS, $this.data(), typeof option === 'object' && option);

			if (!data && options.toggle && option === 'show') {
				option = !option;
			}

			if (!data) {
				data = new Collapse(this, options);
				$this.data('bs.collapse', data);
			}

			if (typeof option === 'string') {
				data[option]();
			}
		});
	};

	old = Y.DOM.fn.collapse;

	Y.DOM.fn.collapse = Plugin;
	Y.DOM.fn.collapse.Constructor = Collapse;


	// COLLAPSE NO CONFLICT
	// ====================

	Y.DOM.fn.collapse.noConflict = function () {
		Y.DOM.fn.collapse = old;
		return this;
	};


	// COLLAPSE DATA-API
	// =================

	Y.DOM(Y.Document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
		var href;

		var $this = Y.DOM(this);

		href = $this.attr('href');

		var target = $this.attr('data-target') ||
			e.preventDefault() ||
			(href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7

		var $target = Y.DOM(target);
		var data = $target.data('bs.collapse');
		var option = data ? 'toggle' : $this.data();
		var parent = $this.attr('data-parent');
		parent = parent && Y.DOM(parent);

		if (!data || !data.transitioning) {
			if (parent) {
				parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed');
			}

			$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
		}

		Plugin.call($target, option);
	});

	//---

}());

//---


