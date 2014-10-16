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

	Y.extend(Y.G.regexList, {
		whitespace: "[\\x20\\t\\r\\n\\f]",

		scriptReplacement: /<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi,

		scriptTypeReplacement: /^(?:text|application)\/javascript/i,

		xmlTypeReplacement: /^(?:text|application)\/xml/i,

		jsonTypeReplacement: /^(?:text|application)\/json/i,

		jsonType: 'application/json, text/json',

		htmlType: 'text/html',

		blankReplacement: /^\s*$/,

		fragmentReplacement: /^\s*<(\w+|!)[^>]*>/,

		singleTagReplacement: /^<(\w+)\s*\/?>(?:<\/\1>|)$/,

		tagExpanderReplacement:
			/<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/ig,

		readyReplacement: /complete|loaded|interactive/,

		simpleSelectorReplacement: /^[\w\-]*$/,

		rootNodeReplacement: /^(?:body|html)$/i,

		selectorGroupReplacement: /(([\w#:.~>+()\s\-]+|\*|\[.*?\])+)\s*(,|$)/g,

		filterReplacement: new RegExp('(.*):(\\w+)(?:\\(([^)]+)\\))?$\\s*'),

		childReplacement: /^\s*>/,

		// Matching numbers
		num: /[+\-]?(?:\d*\.|)\d+(?:[eE][+\-]?\d+|)/.source,

		// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
		// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
		displaySwap: /^(none|table(?!-c[ea]).+)/,

		margin: /^margin/,

		quickExpr: /^(?:\s*(<[\w\W]+>)[^>]*|#([\w\-]*))$/,

		singleTag: (/^<(\w+)\s*\/?>(?:<\/\1>|)$/),

		html: /<|&#?\w+;/,

		htmlTagName: /<([\w:]+)/,

		noInnerHtml: /<(?:script|style|link)/i,

		xhtmlTag: /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,

		scriptType: /^$|\/(?:java|ecma)script/i,

		checkableType: (/^(?:checkbox|radio)$/i),

		isSimple: /^.[^:#\[\.,]*$/,

		checked: /checked\s*(?:[^=]|=\s*.checked.)/i,

		cleanScript: /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

		keyEvent: /^key/,

		mouseEvent: /^(?:mouse|pointer|contextmenu)|click/,

		focusMorph: /^(?:focusinfocus|focusoutblur)$/,

		typeNamespace: /^([^.]*)(?:\.(.+)|)$/,

		notWhite: (/\S+/g),

		ignoreProperties: /^([A-Z]|returnValue$|layer[XY]$)/,

		selectorGroup: /(([\w#:.~>+()\s\-]+|\*|\[.*?\])+)\s*(,|$)/g,

		multiDash: /([A-Z])/g,

		brace: /(?:\{[\s\S]*\}|\[[\s\S]*\])$/,

		hashStrip: /^#!*/,

		namedArgument: /:([\w\d]+)/g,

		argumentSplat: /\*([\w\d]+)/g,

		escape: /[\-\[\]{}()+?.,\\\^$|#\s]/g
	});

	//---

	Y.extend(Y.G.regexList, {
		numSplit: new RegExp('^(' + Y.G.regexList.num + ')(.*)$', 'i'),
		numNonPx: new RegExp('^(' + Y.G.regexList.num + ')(?!px)[a-z%]+$', 'i'),
		relNum: new RegExp('^([+-])=(' + Y.G.regexList.num + ')', 'i')
	});

	//---

}());

// FILE: ./Source/Core/RegexList.js

//---