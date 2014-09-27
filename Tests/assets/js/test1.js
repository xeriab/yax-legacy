/*jslint white: true */
/*global Y, YAX, $, Self */

Y.DOM(document).ready(function () {
	'use strict';

	var ButtonOne = Y.DOM('#ButtonOne');
	var TestOneImage = Y.DOM('#TestOneImage');
	var Wrapper = Y.DOM('body');

	TestOneImage.attr('src', 'http://0.0.0.0:8000/Media/yax_js_logo_01-o.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
		//marginLeft: -9,
		//maxWidth: 100
	});

	TestOneImage.Tooltip({
		Content: 'Testing Tooltips!',
		Gravity: 'west',
		Theme: 'dark',
		Animation: 'flipIn'
	});

//	Wrapper.WaitForMe({
//		Effect: 'orbit'
//	});

	Y.LOG('');
	Y.LOG(Y);
});