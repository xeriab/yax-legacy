/**
 * YAX UserAgent Detector [DOM/NODE]
 */

/*jslint indent: 4 */
/*jslint white: true */
/*jshint eqeqeq: false */
/*jshint strict: false */
/*global Y, YAX */

(function () {

	//---

	'use strict';

	var retina, matches, msPointer, pointer,
		_ie = Y.win.hasOwnProperty('ActiveX'),
		ie3d = _ie && (Y.doc.documentElement.style.hasOwnProperty('transition')),
		webkit3d = (Y.win.hasOwnProperty('WebKitCSSMatrix')) && (new Y.win.WebKitCSSMatrix().hasOwnProperty('m11')),
		gecko3d = Y.doc.documentElement.style.hasOwnProperty('MozPerspective'),
		opera3d = Y.doc.documentElement.style.hasOwnProperty('OTransition');

	retina = (Y.hasOwn.call(Y.win, 'devicePixelRatio') && Y.callProperty(Y.win, 'devicePixelRatio') > 1);

	if (!retina && Y.hasOwn.call(Y.win, 'matchMedia')) {
		matches = Y.callProperty(Y.win, 'matchMedia');
		retina = (Y.isSet(matches) && Y.callProperty(matches, 'matches'));
	}

	msPointer = (Y.hasOwn.call(navigator, 'msPointerEnabled') &&
		Y.hasOwn.call(navigator, 'msMaxTouchPoints') &&
		!Y.hasOwn.call(Y.win, 'PointerEvent'));

	pointer = (Y.hasOwn.call(Y.win, 'PointerEvent') &&
		Y.hasOwn.call(navigator, 'pointerEnabled') &&
		!Y.hasOwn.call(navigator, 'maxTouchPoints')) || msPointer;

	//---

	Y.UA = Y.Class.extend({
		_class_name: 'UA',

		initialise: function () {
			this.UserAgent = Y.win.navigator.userAgent;
			this.OS = {};
			this.Browser = {};
			this.Features = {};
			this.Type = {};

			this.detect();
		},

		/**
		 * Detect Suite
		 *
		 * Tests the client against a variety of modern browser features.
		 * These tests are primarily from Mark Pilgrim's "Dive Into HTML5" section
		 * "The All-In-One Almost-Alphabetical No-Bullshit Guide to Detecting Everything."
		 *
		 * You can find "Dive Into HTML5" here: http://www.diveintohtml5.net/
		 *
		 * "Dive Into HTML5" is protected by (CC BY 3.0):
		 * http://creativecommons.org/licenses/by/3.0/
		 */
		testInput: function (type) {
			var temp = Y.doc.createElement('input');

			temp.setAttribute('type', type);

			return temp.type !== 'text';
		},

		detect: function () {
			/*jshint -W004 */
			var testInput = this.testInput,
				OS = this.OS,
				Browser = this.Browser,
				ua = this.UserAgent,
				features = this.Features,
				type = this.Type,
				webkit = ua.match(/Web[kK]it[\/]{0,1}([\d.]+)/),
				gecko = ua.match(/Gecko[\/]{0,1}([\d.]+)/),
				android = ua.match(/(Android);?[\s\/]+([\d.]+)?/),
				ipad = ua.match(/(iPad).*OS\s([\d_]+)/),
				ipod = ua.match(/(iPod)(.*OS\s([\d_]+))?/),
				iphone = !ipad && ua.match(/(iPhone\sOS)\s([\d_]+)/),
				webos = ua.match(/(webOS|hpwOS)[\s\/]([\d.]+)/),
				touchpad = webos && ua.match(/TouchPad/),
				kindle = ua.match(/Kindle\/([\d.]+)/),
				silk = ua.match(/Silk\/([\d._]+)/),
				blackberry = ua.match(/(BlackBerry).*Version\/([\d.]+)/),
				bb10 = ua.match(/(BB10).*Version\/([\d.]+)/),
				rimtabletos = ua.match(/(RIM\sTablet\sOS)\s([\d.]+)/),
				playbook = ua.match(/PlayBook/),
				chrome = ua.match(/Chrome\/([\d.]+)/) || ua.match(/CriOS\/([\d.]+)/),
				firefox = ua.match(/Firefox\/([\d.]+)/),
				ie = ua.match(/MSIE ([\d.]+)/),
				safari = webkit && ua.match(/Mobile\//) && !chrome,
				webview = ua.match(/(iPhone|iPod|iPad).*AppleWebKit(?!.*Safari)/) && !chrome,
				ie = ua.match(/MSIE\s([\d.]+)/),
				osNames = [
					'Linux',
					'Windows',
					'MacOS',
					'UNIX',
					'Android',
					'iOS',
					'Unknown'
				];



			if (Y.isSet(webkit)) {
				Browser.Webkit = true;
				Browser.Version = webkit[1];
			}

			if (Y.isSet(gecko)) {
				Browser.Gecko = true;
				Browser.Version = gecko[1];
			}

			if (android) {
				OS.Android = true;
				OS.Version = android[2];
			}

			if (iphone && !ipod) {
				OS.iOS = OS.iPhone = true;
				OS.Version = iphone[2].replace(/_/g, '.');
			}

			if (ipad) {
				OS.iOS = OS.iPad = true;
				OS.Version = ipad[2].replace(/_/g, '.');
			}

			if (ipod) {
				OS.iOS = OS.iPod = true;
				OS.Version = ipod[3] ? ipod[3].replace(/_/g, '.') : null;
			}

			if (webos) {
				OS.webOS = true;
				OS.Version = webos[2];
			}

			if (touchpad) {
				OS.Touchpad = true;
			}

			if (blackberry) {
				OS.Blackberry = true;
				OS.Version = blackberry[2];
			}

			if (bb10) {
				OS.BB10 = true;
				OS.Version = bb10[2];
			}

			if (rimtabletos) {
				OS.Rimtabletos = true;
				OS.Version = rimtabletos[2];
			}

			if (playbook) {
				Browser.Playbook = true;
			}

			if (kindle) {
				OS.Kindle = true;
				OS.Version = kindle[1];
			}

			if (silk) {
				Browser.Silk = true;
				Browser.Version = silk[1];
			}

			if (!silk && OS.Android && ua.match(/Kindle Fire/)) {
				Browser.Silk = true;
			}

			if (chrome) {
				Browser.Chrome = true;
				Browser.Name = 'Chrome';
				Browser.Version = chrome[1];
			}

			if (firefox) {
				Browser.Firefox = true;
				Browser.Name = 'Firefox';
				Browser.Version = firefox[1];
			}

			if (ie) {
				Browser.IE = true;
				Browser.Name = 'Microsoft Internet Explorer';
				Browser.Version = ie[1];
			}

			if (safari && (ua.match(/Safari/) || Y.isSet(OS.iOS))) {
				Browser.Safari = true;
				Browser.Name = 'Apple Safari';
			}

			if (webview) {
				Browser.WebView = true;
			}

			// OS.Tablet = !!(ipad || playbook || (android && !ua.match(/Mobile/)) || (firefox && ua.match(/Tablet/)) || (ie && !ua.match(/Phone/) && ua.match(/Touch/)));
			// OS.Phone = !!(!OS.Tablet && !OS.iPod && (android || iphone || webos || blackberry || bb10 || (chrome && ua.match(/Android/)) || (chrome && ua.match(/CriOS\/([\d.]+)/)) || (firefox && ua.match(/Mobile/)) || (ie && ua.match(/Touch/))));
			// OS.Desktop = !!Browser.IE || Browser.Firefox || Browser.Safari || Browser.Chrome;
			// OS.Platform = navigator.platform;

			Browser.Language = navigator.language;
			Browser.Vendor = Y.callProperty(navigator, 'vendor');

			Y.extend(OS, {
				Name: navigator.appVersion.indexOf('Linux') !== -1 ? osNames[0] : osNames[6] ||
					navigator.appVersion.indexOf('Mac') !== -1 ? osNames[2] : osNames[6] ||
					navigator.appVersion.indexOf('X11') !== -1 ? osNames[3] : osNames[6] ||
					navigator.appVersion.indexOf('Win') !== -1 ? osNames[1] : osNames[6]
				// Linux: Y.isSet(navigator.platform.match(/Linux/)),
				// Windows: Y.isSet(navigator.platform.match(/Windows/)),
				// Android: Y.isSet(navigator.platform.match(/Android/)),
				// iOS: Y.isSet(navigator.platform.match(/iOS/)),
				// Architcture: navigator.platform.split(' ')[1]
			});

			//

			/** @namespace Y.win.YAX_DISABLE_3D */
			Y.extend(features, {
				// Elements
				Audio: Y.isSet(document.createElement('audio').canPlayType),
				Canvas: Y.isSet(document.createElement('canvas').getContext),
				Command: document.createElement('command').hasOwnProperty('type'),
				Time: document.createElement('time').hasOwnProperty('valueAsDate'),
				Video: Y.isSet(document.createElement('video').canPlayType),

				// Features and Attributes
				Offline: navigator.hasOwnProperty('onLine') && navigator.onLine,
				ApplicationCache: Y.isSet(Y.callProperty(window, 'applicationCache')),
				ContentEditable: document.createElement('span').hasOwnProperty('isContentEditable'),
				DragDrop: document.createElement('span').hasOwnProperty('draggable'),
				Geolocation: Y.isSet(navigator.geolocation),
				History: (Y.isSet(window.history) && Y.isSet(window.history.pushState)),
				WebSockets: Y.isSet(window.WebSocket),
				WebWorkers: Y.isSet(window.Worker),
				Retina: retina,
				Pointer: Y.isUndefined(pointer) ? false : pointer,
				MicrosoftPointer: Y.isUndefined(msPointer) ? false : msPointer,

				// Forms
				Autofocus: document.createElement('input').hasOwnProperty('autofocus'),
				InputPlaceholder: document.createElement('input').hasOwnProperty('placeholder'),
				TextareaPlaceholder: document.createElement('textarea').hasOwnProperty('placeholder'),
				InputTypeEmail: testInput('email'),
				InputTypeNumber: testInput('number'),
				InputTypeSearch: testInput('search'),
				InputTypeTel: testInput('tel'),
				InputTypeUrl: testInput('url'),

				// Storage
				IndexDB: Y.isSet(Y.callProperty(window, 'indexedDB')),
				LocalStorage: (window.window.hasOwnProperty('localStorage') && window.localStorage !== null),
				WebSQL: Y.isSet(window.openDatabase),

				// Touch and orientation capabilities.
				Orientation: window.window.hasOwnProperty('orientation'),
				Touch: document.hasOwnProperty('ontouchend'),
				ScrollTop: ((window.pageXOffset) || (document.documentElement.hasOwnProperty('scrollTop'))) && (!OS.webOS),

				// Propietary features
				// Standalone: ((window.navigator.hasOwnProperty('standalone')) && (window.navigator.standalone))
				Standalone: Y.isSet(Y.callProperty(navigator, 'standalone')),

				Any3D: !Y.win.YAX_DISABLE_3D && (ie3d || webkit3d || gecko3d || opera3d),

				Cookies: navigator.cookieEnabled

			});

			// Return (boolean) of likely client device classifications.
			Y.extend(type, {
				Mobile: (screen.width < 768),
				Tablet: (screen.width >= 768 && features.Orientation),
				Desktop: (screen.width >= 800 && !features.Orientation)
			});
		}
	});

	//---

	Y.UserAgent = new Y.UA();

	delete Y.UA;

	//---

}());

// FILE: ./Source/Modules/UserAgentDetector.js

//---