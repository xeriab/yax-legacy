/*global Y, YAX */

// Y.DOM(document).ready(function () {

Y.DOM(function () {
	var Wrapper = Y.DOM('body');
	var ButtonOne = Y.DOM('#ButtonOne');
	var TestOneImage = Y.DOM('#TestOneImage');
	var Jumbotron = Y.DOM('.jumbotron');

	// Wrapper.AutoFix();
	// Wrapper.ManualFix();

	Wrapper.AutoFix();
	// Wrapper.ManualFix();
	// Y.DOM('.container').AutoFix();
	Y.DOM('.container').ManualFix();

	ButtonOne.Tooltip({
		dynamic: true
	});

	TestOneImage.attr('src', '../Media/yax_js_logo_01.svg');

	TestOneImage.width(115);

	TestOneImage.css({
		marginTop: -13
	});

	TestOneImage.Tooltip({
		// dynamic: true,
		gap: 6,
		title: 'Tooltip #1',
		// placement: 'north',
		placement: 'east',
		// placement: 'south',
		// placement: 'west',
		// placement: 'center',
		// placement: 'legacy',
		// theme: 'light',
		// theme: 'dark',
		animation: 'flipIn',
		// animation: 'fadeIn',
		size: 'small'
	});

	TestOneImage.addClass('yax-unselectable');
	TestOneImage.parent().addClass('yax-unselectable');

	TestOneImage.addClass('yax-undraggable');
	TestOneImage.parent().addClass('yax-undraggable');

	TestOneImage.parent().draggable(false);
	TestOneImage.draggable(false);

	// Wrapper.WaitForMe();

	// Wrapper.WaitForMe({effect: 'bounce'});
	Wrapper.WaitForMe({effect: 'rotateplane'});
	// Wrapper.WaitForMe({effect: 'stretch'});
	// Wrapper.WaitForMe({effect: 'orbit'});
	// Wrapper.WaitForMe({effect: 'roundBounce'});
	// Wrapper.WaitForMe({effect: 'win8'});
	// Wrapper.WaitForMe({effect: 'win8_linear'});
	// Wrapper.WaitForMe({effect: 'ios'});
	// Wrapper.WaitForMe({effect: 'facebook'});
	// Wrapper.WaitForMe({effect: 'rotation'});

	// Wrapper.WaitForMe({effect: 'rotateplane', content: '<div class="TextContent">Loading</div>'});

	// Y.DOM('#ani1').WaitForMe({effect: 'bounce', color: 'red'});
	// Y.DOM('#ani2').WaitForMe({effect: 'rotateplane', color: 'green'});

	var closeWaitForMe = function closeWaitForMe () {
		Wrapper.WaitForMe('close');
	};

	Wrapper.oneTime(3000, 'closeWaitForMe', closeWaitForMe);

	// Y.LOG(Wrapper);

	// Y.config.setGlobal('Test', 'null');
	// Y.config.setGlobal('Test.One', 'One');
	// Y.config.restore('Test');
	// Y.config.restore('Test.One');
	// Y.config.set('Test', true);
	// Y.config.set('Test.One', 1);
	// Y.config.set('extension', 'Test');
	// Y.config.set('extension', 'Test.One');
	// Y.LOG(Y.config.getAll('Test', true));
	// Y.LOG(Y.config.getAll());
	// Y.LOG(Y.config);

	// Y.LOG(Y.config.getAll('yax.plugins.tooltip', false, true));

	// Y.LOG(Y.config.getAll('yax.plugins', false, false));

	// Y.LOG(Y.config.get('plugins.tooltip'));

	// var compiledTemplate = Y.template('Hello <%= text %>');
	// Y.LOG(compiledTemplate({text: 'World!'}));

	// var url1 = 'http://0.0.0.0:1988/package.json';

	/*Y.DOM.JSON(url1, function (data) {
		Y.LOG(data);
	});*/

	/*Y.DOM.Ajax({
		type: 'GET',

		url: url1,

		data: null,

		dataType: 'json',

		timeout: 300,

		// cache: true,

		// global: true,

		// crossDomain: false,

		contentType: 'text/plain',

		xhrFields: {
			withCredentials: false
		},

		success: function (data) {
			Y.LOG(data);
		},

		beforeSend: function () {
			Wrapper.WaitForMe();
			// Y.LOG('AJAX BEFORE SEND: ', arguments);
		},

		complete: function () {
			Wrapper.WaitForMe('close');
			// Y.LOG('AJAX COMPLETE: ', arguments);
			// Y.LOG('AJAX COMPLETED');
		}
	});*/

	/*Y.DOM(document).ajaxStart(function () {
		Wrapper.WaitForMe();
	});

	Y.DOM(document).ajaxComplete(function () {
		Wrapper.WaitForMe('close');
	});

	Y.DOM(document).ajaxSuccess(function () {
		Wrapper.WaitForMe('close');
	});

	var log = Y.bind(console.log, console);

	Y.delay(log, 1000, 'logged later');

	Y.defer(function () {
		alert('deferred');
	});

	var throttled = Y.throttle(closeWaitForMe, 100);

	Y.DOM(window).scroll(throttled);

	Y.LOG(Y.object(['moe', 'larry', 'curly'], [30, 40, 50]));

	Y.LOG(Y.map([1, 2, 3], function(num) {
		return num * 3;
	}));*/


	//---

	/*ButtonOne.tooltip({
		title: 'Teeest :D'
	});*/

	// ButtonOne.focus();

	//---

	// Y.LOG(Y.DOM.Support);
	// Y.LOG(Y.DOM.event.special);
	// Y.LOG(Y.DOM.event.global);
	// Y.LOG(ButtonOne);
	// Y.LOG(Y.DOM.support.focusinBubbles);


	/*ButtonOne.focusin(function (e) {
		Y.LOG(e);
	});*/

	/*ButtonOne.hover(function (e) {
		Y.LOG(e);
	});*/

	//Y.LOG(Y.DOM.data_priv);
	//Y.LOG(Y.DOM.data_user);
	//Y.LOG(TestOneImage);
	//Y.LOG(ButtonOne);

	//Y.LOG(new Y.Parser('JSON').encode(Y.config.getAll()));

	// ButtonOne.trigger('click');

	/*var Obj1 = {
		Test: 'Heey'
	};

	Y.extend(Obj1, Y.Mixin.Events);

	Obj1.on('Show', function (e) {
		Y.LOG(e);
	});

	Obj1.fire('Show');

	Y.LOG(Obj1);*/

	// Y.LOG(ButtonOne.data('tooltip'));

	// ButtonOne.attr('data-i18n', 'Test');

	//Y.LOG(Y.DOM.Support);
	//Y.LOG(Y.DOM.event.special);

	// ButtonOne.addClass('yaxFadeIn');

	/*ButtonOne.onPress(function (e) {
		Y.LOG(e);
	});*/


	// Y.LOG(ButtonOne);

	/*Jumbotron.append('<div class="a">A</div>' +
		'<div class="b">B<div class="c">C</div></div>' +
		'<div class="d">D</div><div class="e">E</div>' +
		'<div class="f">F</div>'
	);

	Jumbotron.append('<button onclick="javascript: Y.DOM(\'.a\')' +
		'.eventLoggerStart(\'click\');">Y.DOM(\'.a\')' +
		'.eventLoggerStart(\'click\');</button>'
	);

	Jumbotron.append('<button onclick="javascript: Y.DOM(\'.b\')' +
		'.eventLoggerStart(\'mouseover\', \'green\');">Y.DOM(\'.b\')' +
		'.eventLoggerStart(\'mouseover\', \'green\');</button>'
	);

	Jumbotron.append('<button onclick="javascript: Y.DOM(\'.a\')' +
		'.eventLoggerStart(\'click\');">Y.DOM(\'.a\')' +
		'.eventLoggerStart(\'click\');</button>'
	);

	var $a = Y.DOM('.a');
	var $b = Y.DOM('.b');
	var $c = Y.DOM('.c');
	var $d = Y.DOM('.d');
	var $e = Y.DOM('.e');
	var $f = Y.DOM('.f');*/

	// var LocalStorageCache = new Y.Store('localStorageCache');

	var lsStore = new Y.Store('localStorage');

	Y.LOG(lsStore);



	// Y.DOM('.tooltip1').jBox('Tooltip');

	// Y.LOG(ButtonOne.YaBox());

	// Y.LOG(LocalStorageCache.t());

	//---

});
