/**
 * YAX Video Background [DOM/NODE][PLUGIN]
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

	Y.config.set('VideoBackground.mp4', null);
	Y.config.set('VideoBackground.ogv', null);
	Y.config.set('VideoBackground.webm', null);
	Y.config.set('VideoBackground.poster', null);
	Y.config.set('VideoBackground.autoplay', true);
	Y.config.set('VideoBackground.loop', true);
	Y.config.set('VideoBackground.scale', false);
	Y.config.set('VideoBackground.position', 'absolute');
	Y.config.set('VideoBackground.opacity', 0.1);
	Y.config.set('VideoBackground.textReplacement', false);
	Y.config.set('VideoBackground.zIndex', 0);
	Y.config.set('VideoBackground.height', 0);
	Y.config.set('VideoBackground.width', 0);
	Y.config.set('VideoBackground.fullscreen', false);
	Y.config.set('VideoBackground.imageFallback', true);

	var pluginOptions = Y.config.getAll('VideoBackground', false, true);

	Y.DOM.Function.VideoBackground = function (selector, options) {
		if (Y.isUndefined(options)) {
			options = {};
		}

		if (Y.isObject(selector)) {
			options = Y.extend({}, pluginOptions, selector);
		} else if (!selector) {
			options = pluginOptions;
		} else {
			return Y.DOM(selector).VideoBackground(options);
		}

		var container = Y.DOM(this);

		// Check if elements available otherwise it will cause issues
		if (!container.length) {
			return;
		}

		// Container to be at least relative
		if (container.css('position') === 'static' || !container.css('position')) {
			container.css('position', 'relative');
		}

		// We need a width
		if (options.width === 0) {
			options.width = container.width();
		}

		// We need a height
		if (options.height === 0) {
			options.height = container.height();
		}

		// Get the wrapper
		var wrap = Y.DOM.Function.VideoBackground.wrapper();

		wrap.height(options.height).width(options.width);

		// If is a text replacement
		if (options.textReplacement) {
			// Force sizes
			options.scale = true;

			// Set sizes and forcing text out
			container.width(options.width).height(options.height).css('text-indent', '-9999px');
		} else {
			// Set the wrapper above the video
			wrap.css('z-index', options.zIndex + 1);
		}

		// Move the contents into the wrapper
		wrap.html(container.clone(true));

		// Get the video
		var video = Y.DOM.Function.VideoBackground.video(options);

		// If we are forcing width/height
		if (options.scale) {
			// Overlay wrapper
			wrap.height(options.height).width(options.width);

			// Video
			video.height(options.height).width(options.width);
		}

		// Add it all to the container
		container.html(wrap);
		container.append(video);

		return video.find('video')[0];
	};

	//---

	// Get the overlay wrapper
	Y.DOM.Function.VideoBackground.wrapper = function () {
		var $wrapper = Y.DOM('<div/>');

		$wrapper.addClass('yax-videobackground-wrapper')
			.css('position', 'absolute')
			.css('top', 0)
			.css('left', 0);

		return $wrapper;
	};

	//---

	// Set to fullscreen
	Y.DOM.Function.VideoBackground.setFullscreen = function ($el) {
		var windowWidth = Y.DOM(window).width();
		var windowHeight = Y.DOM(window).height();

		$el.css('min-height', 0).css('min-width', 0);

		$el.parent().width(windowWidth).height(windowHeight);

		// If by width
		var shift = 0;

		if (windowWidth / windowHeight > $el.aspectRatio) {
			$el.width(windowWidth).height('auto');

			// Shift the element up
			var height = $el.height();

			shift = (height - windowHeight) / 2;

			if (shift < 0) {
				shift = 0;
			}

			$el.css("top", -shift);

		} else {
			$el.width('auto').height(windowHeight);

			// Shift the element left
			var width = $el.width();

			shift = (width - windowWidth) / 2;

			if (shift < 0) {
				shift = 0;
			}

			$el.css("left", -shift);

			// This is a hack mainly due to the iphone
			if (shift === 0) {
				var t = setTimeout(function () {
					Y.DOM.Function.VideoBackground.setFullscreen($el);
				}, 500);

				// t();
			}
		}

		Y.DOM('body > .yax-videobackground-wrapper').width(windowWidth).height(windowHeight);

	};

	//---

	// Get the formatted video element
	Y.DOM.Function.VideoBackground.video = function (options) {
		Y.DOM('html, body').scrollTop(-1);

		// Video container
		var $div = Y.DOM('<div/>');

		$div.addClass('VideoBackground')
			.css('position', options.position)
			.css('z-index', options.zIndex)
			.css('top', 0)
			.css('left', 0)
			.css('height', options.height)
			.css('width', options.width)
			.css('opacity', options.opacity)
			.css('overflow', 'hidden');

		// Video element
		var $video = Y.DOM('<video/>');

		$video.css('position', 'absolute')
			.css('z-index', options.zIndex)
			.attr('poster', options.poster)
			.css('top', 0)
			.css('left', 0)
			.css('min-width', '100%')
			.css('min-height', '100%');

		if (options.autoplay) {
			$video.attr('autoplay', options.autoplay);
		}

		// If fullscreen
		if (options.fullscreen) {
			$video.bind('canplay', function () {
				// Set the aspect ratio
				$video.aspectRatio = $video.width() / $video.height();

				Y.DOM.Function.VideoBackground.setFullscreen($video);
			});

			// Listen out for screenresize
			var resizeTimeout;

			Y.DOM(window).resize(function () {
				clearTimeout(resizeTimeout);

				resizeTimeout = setTimeout(function () {
					Y.DOM.Function.VideoBackground.setFullscreen($video);
				}, 100);
			});

			Y.DOM.Function.VideoBackground.setFullscreen($video);
		}


		// Video standard element
		var _video = $video[0];

		var loops_left;

		// If meant to loop
		if (options.loop) {
			loops_left = options.loop;

			// Cannot use the loop attribute as firefox doesnt support it
			$video.bind('ended', function () {
				// If we have some loops to throw
				if (loops_left) {
					// Replay that bad boy
					_video.play();
				}

				// If not forever
				if (loops_left !== true) {
					// One less loop
					loops_left--;
				}
			});
		}

		// When can play, play
		$video.bind('canplay', function () {
			if (options.autoplay) {
				// Replay that bad boy
				_video.play();
			}
		});

		// If supports video
		if (Y.DOM.Function.VideoBackground.supportsVideo()) {

			// Supports webm
			if (Y.DOM.Function.VideoBackground.supportType('webm')) {
				// Play webm
				$video.attr('src', options.webm);
			}
			// Supports mp4
			else if (Y.DOM.Function.VideoBackground.supportType('mp4')) {
				// Play mp4
				$video.attr('src', options.mp4);
			}
			// Throw ogv at it then
			else {
				// Play ogv
				$video.attr('src', options.ogv);
			}

		}

		// Image for those that dont support the video
		var $img = Y.DOM('<img/>');

		$img.attr('src', options.poster)
			.css('position', 'absolute')
			.css('z-index', options.zIndex)
			.css('top', 0)
			.css('left', 0)
			.css('min-width', '100%')
			.css('min-height', '100%');

		// Add the image to the video
		// If suuports video
		if (Y.DOM.Function.VideoBackground.supportsVideo()) {
			// Add the video to the wrapper
			$div.html($video);
		}
		// Nope - whoa old skool
		else {
			// add the image instead
			$div.html($img);
		}

		// If text replacement
		if (options.textReplacement) {
			// Force the heights and widths
			$div.css('min-height', 1).css('min-width', 1);
			$video.css('min-height', 1).css('min-width', 1);
			$img.css('min-height', 1).css('min-width', 1);

			$div.height(options.height).width(options.width);
			$video.height(options.height).width(options.width);
			$img.height(options.height).width(options.width);
		}

		if (Y.DOM.Function.VideoBackground.supportsVideo()) {
			_video.play();
		}

		return $div;
	};

	//---

	// Check if suuports video
	Y.DOM.Function.VideoBackground.supportsVideo = function () {
		return (document.createElement('video').canPlayType);
	};

	//---

	// Check which type is supported
	Y.DOM.Function.VideoBackground.supportType = function (str) {
		// If not at all supported
		if (!Y.DOM.Function.VideoBackground.supportsVideo()) {
			return false;
		}

		// Create video
		var video = document.createElement('video');

		// Check which?
		switch (str) {
			case 'webm':
				return (video.canPlayType('video/webm; codecs="vp8, vorbis"'));

			case 'mp4':
				return (video.canPlayType('video/mp4; codecs="avc1.42E01E, mp4a.40.2"'));

			case 'ogv':
				return (video.canPlayType('video/ogg; codecs="theora, vorbis"'));
		} // END switch

		// Nope!
		return false;
	};

	//---

}());

// FILE: ./Source/Plugins/VideoBackground/VideoBackground.js

//---
