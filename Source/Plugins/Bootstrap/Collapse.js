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
		this.$element = Y.DOM(element);
		this.options = Y.DOM.extend({}, Collapse.DEFAULTS, options);
		this.transitioning = null;

		if (this.options.parent) {
			this.$parent = Y.DOM(this.options.parent);
		}

		if (this.options.toggle) {
			this.toggle();
		}
	};

	Collapse.VERSION = '3.2.0';

	Collapse.DEFAULTS = {
		toggle: true
	};

	Collapse.prototype.dimension = function () {
		var hasWidth = this.$element.hasClass('width');

		return hasWidth ? 'width' : 'height';
	};

	Collapse.prototype.show = function () {
		var self = this;

		if (this.transitioning || this.$element.hasClass('in')) {
			return;
		}

		var startEvent = Y.DOM.Event('show.bs.collapse');

		this.$element.trigger(startEvent);

		if (startEvent.isDefaultPrevented()) {
			return;
		}

		var actives = this.$parent && this.$parent.find('> .panel > .in');

		if (actives && actives.length) {
			var hasData = actives.data('bs.collapse');

			if (hasData && hasData.transitioning) {
				return;
			}

			Plugin.call(actives, 'hide');

//			if (hasData) {
//				actives.data('bs.collapse', null);
//			}

			hasData || actives.data('bs.collapse', null);
		}

		// Y.LOG(self);

		var dimension = this.dimension();

		this.$element
			.removeClass('collapse')
			.addClass('collapsing')[dimension](0);

		this.transitioning = 1;

		var complete = function () {
			this.$element.removeClass('collapsing')
				.addClass('collapse in')[dimension]('');

			this.transitioning = 0;

			this.$element.trigger('shown.bs.collapse');
		};

		if (!Y.DOM.support.transition) {
			return complete.call(this);
		}

		var scrollSize = Y.Lang.camelise(['scroll', dimension].join('-'));

		// Y.LOG(Y.DOM.proxy(complete, this));

		/*this.$element
			.one('bsTransitionEnd', Y.DOM.proxy(complete, this))
			.emulateTransitionEnd(350)[dimension](this.$element[0][scrollSize]).stop();*/

		this.$element
			.one('bsTransitionEnd', Y.DOM.proxy(complete, this))
			.stopTranAnim()[dimension](this.$element[0][scrollSize]).stop();
	};

	Collapse.prototype.hide = function () {
		var self = this;

		if (this.transitioning || !this.$element.hasClass('in')) {
			return;
		}

		var startEvent = Y.DOM.Event('hide.bs.collapse');

		this.$element.trigger(startEvent);

		if (startEvent.isDefaultPrevented()) {
			return;
		}

		var dimension = this.dimension();

		// self.$element[dimension](self.$element[dimension]())[0].offsetHeight;

		// self.$element[dimension](self.$element[dimension]())[0].offsetHeight;

		this.$element[dimension](this.$element[dimension]())[0].offsetHeight;

		this.$element
			.addClass('collapsing')
			.removeClass('collapse')
			.removeClass('in');

		this.transitioning = 1;

		var complete = function () {
			this.transitioning = 0;

			this.$element
				.trigger('hidden.bs.collapse')
				.removeClass('collapsing')
				.addClass('collapse');
		};

		if (!Y.DOM.support.transition) {
			return complete.call(this);
		}

		/*this.$element[dimension](0).one('bsTransitionEnd', Y.DOM.proxy(complete, this))
			.emulateTransitionEnd(350).stop();*/

		this.$element[dimension](0).one('bsTransitionEnd', Y.DOM.proxy(complete, this))
			.stopTranAnim().stop();
	};

	Collapse.prototype.toggle = function () {
		if (this.$element.hasClass('in')) {
			this.hide();
		} else {
			this.show();
		}

		// this[this.$element.hasClass('in') ? 'hide' : 'show']();
	};


	// COLLAPSE PLUGIN DEFINITION
	// ==========================

	function Plugin(option) {
		return this.each(function () {
			var $this = Y.DOM(this);
			var data = $this.data('bs.collapse');
			var options = Y.DOM.extend({}, Collapse.DEFAULTS, $this.data(), typeof option === 'object' && option);

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
	}

	var old = Y.DOM.fn.collapse;

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

	Y.DOM(document).on('click.bs.collapse.data-api', '[data-toggle="collapse"]', function (e) {
		var href;

		var $this = Y.DOM(this);

		href = $this.attr('href');

		var target = $this.attr('data-target') ||
			e.preventDefault() ||
			(href && href.replace(/.*(?=#[^\s]+$)/, '')); // strip for ie7

		// Y.LOG(target);

		var $target = Y.DOM(target);
		var data = $target.data('bs.collapse');
		var option = data ? 'toggle' : $this.data();
		var parent = $this.attr('data-parent');
		var $parent = parent && Y.DOM(parent);

		// Y.LOG(data);

		if (!data || !data.transitioning) {
			if ($parent) {
				$parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed');
//				Y.LOG($parent.find('[data-toggle="collapse"][data-parent="' + parent + '"]').not($this).addClass('collapsed'));
			}

			$this[$target.hasClass('in') ? 'addClass' : 'removeClass']('collapsed');
		}

		Plugin.call($target, option);
	});

	//---

}());

//---
