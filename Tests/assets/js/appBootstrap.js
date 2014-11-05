/**
 *
 */

//---

/*global Y, YAX */


//---

Y.DOM(document).ready(function () {

    'use strict';

	var Wrapper = Y.DOM('body');
	var ButtonOne = Y.DOM('#ButtonOne');
	var TestOneImage = Y.DOM('#TestOneImage');

	TestOneImage.attr('src', '../Media/yax_js_logo_01.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

	TestOneImage.Tooltip({
		// dynamic: true,
		title: 'Tooltip #1',
		placement: 'east',
		theme: 'Dark',
		animation: 'flipIn'
	});

	ButtonOne.tooltip();




	//---

});

//---



//---