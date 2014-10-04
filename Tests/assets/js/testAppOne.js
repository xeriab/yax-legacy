/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {

	'use strict';

	var Wrapper = Y.DOM('body');
	var TestOneImage = Y.DOM('#TestOneImage');
	var ButtonOne = Y.DOM('#ButtonOne');

	TestOneImage.attr('src', 'http://0.0.0.0:8000/Media/yax_js_logo_01-o.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

	TestOneImage.Tooltip({
		Content: 'Testing Tooltips!',
		Gravity: 'west',
		Theme: 'dark',
		Animation: 'flipIn'
	});


	Y.LOG('');
	Y.LOG(Y);

});