/**
 * YAX Simple Selector [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint browser: true */
/*jslint white: true */
/*jshint -W084 */
/*jslint node: false */
/*global YAX, Y */

(function () {

	//---

	'use strict';

	// var tmpYaxDom = Y.DOM;

	var oldQSA = Y.DOM.qsa;
	var oldMatches = Y.DOM.matches;
	var classTag = Y.DOM.classTag;
	var Filters;

	//---

	Y.DOM.expr.match = {};

	Y.DOM.expr.match.needsContext = new RegExp( "^" + Y.G.regexList.whitespace +
		"*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
		Y.G.regexList.whitespace + "*((?:-\\d)?\\d*)" + Y.G.regexList.whitespace +
		"*\\)|)(?=[^-]|$)", "i" );

	//---

	function visible(element) {
		element = Y.DOM(element);
		return !!(element.width() || element.height()) && element.css('display') !== 'none';
	}

	// Complex selectors are not supported:
	//   li:has(label:contains("foo")) + li:has(label:contains("bar"))
	//   ul.inner:first > li
	Filters = Y.DOM.Expr[':'] = Y.DOM.expr[':'] = {
		visible: function () {
			if (visible(this)) {
				return this;
			}
		},
		hidden: function () {
			if (visible(this)) {
				return this;
			}
		},
		selected: function () {
			if (visible(this)) {
				return this;
			}
		},
		checked: function () {
			if (visible(this)) {
				return this;
			}
		},
		parent: function () {
			return this.parentNode;
		},
		first: function (index) {
			if (index === 0) {
				return this;
			}
		},
		last: function (index, nodes) {
			if (index === nodes.length - 1) {
				return this;
			}
		},
		eq: function (index, _, value) {
			if (index === value) {
				return this;
			}
		},
		contains: function (index, _, text) {
			if (Y.DOM(this).text().indexOf(text) > -1) {
				return this;
			}
		},
		has: function (index, _, selector) {
			if (Y.DOM.qsa(this, selector).length) {
				return this;
			}
		}
	};

	function process(selector, callback) {
		// Quote the hash in `a[href^=#]` expression
		selector = selector.replace(/\=#\]/g, '="#"]');

		var filter, argument, match = Y.G.regexList.filterReplacement.exec(selector), num;

		if (match && Filters.hasOwnProperty(match[2])) {
			filter = Filters[match[2]];
			argument = match[3];
			selector = match[1];

			if (argument) {
				num = Number(argument);

				if (isNaN(num)) {
					argument = argument.replace(/^["']|["']$/g, '');
				} else {
					argument = num;
				}
			}
		}

		return callback(selector, filter, argument);
	}

	Y.DOM.qsa = function (node, selector) {
		var taggedParent, nodes;

		return process(selector, function (_selector, filter, argument) {
			try {
				if (!_selector && filter) {
					_selector = '*';
				} else if (Y.G.regexList.childReplacement.test(_selector)) {
					// support "> *" child queries by tagging the parent node with a
					// unique class and prepending that classname onto the selector
					taggedParent = Y.DOM(node).addClass(classTag);
					_selector = '.' + classTag + ' ' + _selector;
				}

				nodes = oldQSA(node, _selector);
			} catch (e) {
				Y.ERROR('Error performing selector: %o', selector);
				throw e;
			} finally {
				if (taggedParent) {
					taggedParent.removeClass(classTag);
				}
			}

			return !filter ? nodes :
				Y.unique(Y.DOM.map(nodes, function (n, i) {
					return filter.call(n, i, nodes, argument);
				}));
		});
	};

	Y.DOM.matches = function (node, selector) {
		return process(selector, function (_selector, filter, argument) {
			return (!_selector || oldMatches(node, _selector)) && (!filter || filter.call(node, null, argument) === node);
		});
	};

	//---

}());

// FILE: ./Source/Modules/Node/SimpleSelector.js

//---