/**
 * YAX Simple DOM/NODE
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*jshint node: true */
/*global Y, YAX */

(function(window, document, undef) {

	//---

	'use strict';

	Y.DOM = {
		get: function (id) {
			return Y.isString(id) ? document.getElementById(id) : id;
		},

		getStyle: function (el, style) {

			var value = el.style[style] || (el.currentStyle && el.currentStyle[style]);

			if ((!value || value === 'auto') && document.defaultView) {
				var css = document.defaultView.getComputedStyle(el, null);
				value = css ? css[style] : null;
			}

			return value === 'auto' ? null : value;
		},

		create: function (tagName, className, container) {

			var el = document.createElement(tagName);
			el.className = className;

			if (container) {
				container.appendChild(el);
			}

			return el;
		},

		remove: function (el) {
			var parent = el.parentNode;
			if (parent) {
				parent.removeChild(el);
			}
		},

		toFront: function (el) {
			el.parentNode.appendChild(el);
		},

		toBack: function (el) {
			var parent = el.parentNode;
			parent.insertBefore(el, parent.firstChild);
		},

		hasClass: function (el, name) {
			if (el.classList !== undef) {
				return el.classList.contains(name);
			}
			var className = Y.DOM.getClass(el);
			return className.length > 0 && new RegExp('(^|\\s)' + name + '(\\s|$)').test(className);
		},

		addClass: function (el, name) {
			if (el.classList !== undef) {
				var classes = Y.Util.splitWords(name);
				var i;
				var len;

				for (i = 0, len = classes.length; i < len; i++) {
					el.classList.add(classes[i]);
				}
			} else if (!Y.DOM.hasClass(el, name)) {
				var className = Y.DOM.getClass(el);
				Y.DOM.setClass(el, (className ? className + ' ' : '') + name);
			}
		},

		removeClass: function (el, name) {
			if (el.classList !== undef) {
				el.classList.remove(name);
			} else {
				Y.DOM.setClass(el, Y.Util.trim((' ' + Y.DOM.getClass(el) + ' ').replace(' ' + name + ' ', ' ')));
			}
		}, 

		setClass: function (el, name) {
			if (el.className.baseVal === undef) {
				el.className = name;
			} else {
				// in case of SVG element
				el.className.baseVal = name;
			}
		},

		getClass: function (el) {
			return el.className.baseVal === undef ? el.className : el.className.baseVal;
		},

		setOpacity: function (el, value) {

			if ('opacity' in el.style) {
				el.style.opacity = value;

			} else if ('filter' in el.style) {

				var filter = false,
					filterName = 'DXImageTransform.Microsoft.Alpha';

				// filters collection throws an error if we try to retrieve a filter that doesn't exist
				try {
					filter = el.filters.item(filterName);
				} catch (e) {
					// don't set opacity to 1 if we haven't already set an opacity,
					// it isn't needed and breaks transparent pngs.
					if (value === 1) { return; }
				}

				value = Math.round(value * 100);

				if (filter) {
					filter.Enabled = (value !== 100);
					filter.Opacity = value;
				} else {
					el.style.filter += ' progid:' + filterName + '(opacity=' + value + ')';
				}
			}
		},

		testProp: function (props) {
			var style = document.documentElement.style;
			var i;

			for (i = 0; i < props.length; i++) {
				if (props[i] in style) {
					return props[i];
				}
			}
			return false;
		}
	};

	//---

}(window, window.document));

// FILE: ./Source/Modules/Node/SimpleDOM.js

//---
