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
	Y.LOG(TestOneImage);
	// Y.LOG(Y.DOM.Function);
	// Y.LOG(Y.DOM);
	// Y.LOG(Y.DOM('<div><span>Test</span></div>').insertBefore('#TestOne'));
	// Y.LOG(ButtonOne);
	// Y.DOM('#TestOne').append('<br/><strong>T</strong>');
	// Y.LOG(Y.DOM('body'));
	// Y.LOG(jQuery('body'));
	// Y.LOG(Sizzle('#ButtonOne'));
	// Y.LOG(TestOneImage);
	// Y.LOG(TestOneImage1);
	// Y.LOG(Y.DOM('.nav-tabs'));
	// Y.LOG(Y.DOM('.nav-tabs').find('.active:last a'));
	// Y.LOG(jQuery('.nav-tabs').find('.active:last a'));
	// Y.LOG(Y.DOM('#ButtonOne'));
	// Y.LOG(Y.DOM.find('.active:last'));
	// Y.LOG(Y.DOM('li:last a'));
	// Y.LOG(document.querySelectorAll('li:last a'));
	// Y.LOG(Y.DOM.prototype);


	// Y.LOG(Y.DOM.event);
	// Y.LOG(Y.Lang.Keys(Y.DOM.event));

});