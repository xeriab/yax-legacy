/**
 * YAX Regex Object
 */

//---

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	Y.RegEx = {
		scriptReplacement: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

		scriptTypeReplacement: /^(?:text|application)\/javascript/i,

		xmlTypeReplacement: /^(?:text|application)\/xml/i,

		jsonTypeReplacement: /^(?:text|application)\/json/i,

		jsonType: 'application/json, text/json',

		htmlType: 'text/html',

		blankReplacement: /^\s*$/,

		FragmentReplacement: /^\s*<(\w+|!)[^>]*>/,

		SingleTagReplacement: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		TagExpanderReplacement:
			/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		ReadyReplacement: /complete|loaded|interactive/,

		SimpleSelectorReplacement: /^[\w\-]*$/,

		RootNodeReplacement: /^(?:body|html)$/i,

		SelectorGroupReplacement: /(([\w#:.~>+()\s\-]+|\*|\[.*?\])+)\s*(,|$)/g,

		FilterReplacement: new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),

		ChildReplacement: /^\s*>/,

		// Matching numbers
		pnum: /[+\-]?(?:\d*\.|)\d+(?:[eE][+\-]?\d+|)/.source,

		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		rdisplayswap: /^(none|table(?!-c[ea]).+)/,

		rmargin: /^margin/,

		rquickExpr: /^(?:\s*(<[\w\W]+>)[^>]*|#([\w\-]*))$/,

		rsingleTag: (/^<(\w+)\s*\/?>(?:<\/\1>|)$/),

		rhtml: /<|&#?\w+;/,

		rtagName: /<([\w:]+)/,

		rnoInnerhtml: /<(?:script|style|link)/i,

		rxhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

		rscriptType: /^$|\/(?:java|ecma)script/i,

		rcheckableType: (/^(?:checkbox|radio)$/i),

		risSimple: /^.[^:#\[\.,]*$/,

		rchecked: /checked\s*(?:[^=]|=\s*.checked.)/i,

		rcleanScript: /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g
	};

	Y.extend(Y.RegEx, {
		rnumsplit: new RegExp('^(' + Y.RegEx.pnum + ')(.*)$', 'i'),

		rnumnonpx: new RegExp('^(' + Y.RegEx.pnum + ')(?!px)[a-z%]+$', 'i'),

		rrelNum: new RegExp('^([+-])=(' + Y.RegEx.pnum + ')', 'i')
	});

	//---

}());

// FILE: ./Source/Core/Regex.js

//---