var fs = require('fs');
var jshint = require('jshint');
var UglifyJS = require('uglify-js');
var zlib = require('zlib');

Dependencies = require('./dependencies.js').Dependencies;

function getFiles(compsBase32) {
	var memo = {};
	var comps;

	if (compsBase32) {
		comps = parseInt(compsBase32, 32).toString(2).split('');
		console.log('Managing dependencies...');
	}

	function addFiles(srcs) {
		for (var j = 0, len = srcs.length; j < len; j++) {
			memo[srcs[j]] = true;
		}
	}

	for (var i in Dependencies) {
		if (comps) {
			if (parseInt(comps.pop(), 2) === 1) {
				console.log(' * ' + i);
				addFiles(Dependencies[i].src);
			} else {
				console.log('   ' + i);
			}
		} else {
			addFiles(Dependencies[i].src);
		}
	}

	console.log('');

	var files = [];

	for (var src in memo) {
		files.push('Source/' + src);
	}

	return files;
}

exports.getFiles = getFiles;

function getSizeDelta(newContent, oldContent, fixCRLF) {
	if (!oldContent) {
		return ' (new)';
	}

	if (newContent === oldContent) {
		return ' (unchanged)';
	}

	if (fixCRLF) {
		newContent = newContent.replace(/\r\n?/g, '\n');
		oldContent = oldContent.replace(/\r\n?/g, '\n');
	}

	var delta = newContent.length - oldContent.length;

	return delta === 0 ? '' : ' (' + (delta > 0 ? '+' : '') + delta + ' bytes)';
}

function loadSilently(path) {
	try {
		return fs.readFileSync(path, 'utf8');
	} catch (e) {
		return null;
	}
}

function combineFiles(files) {
	var content = '';

	for (var i = 0, len = files.length; i < len; i++) {
		content += fs.readFileSync(files[i], 'utf8') + '\n\n\t';
	}

	return content;
}

function bytesToKB(bytes) {
	return (bytes / 1024).toFixed(2) + ' KB';
}

exports.build = function (callback, compsBase32, buildName) {
	var files = getFiles(compsBase32);

	console.log('Concatenating and compressing ' + files.length + ' files...');

	var copy = fs.readFileSync('Source/Copyright.js', 'utf8');

	var intro = '\n\n(function () {\n\n';

	var outro = '\n}());\n\n// END\n';

	var newSrc = copy + intro + combineFiles(files) + outro;

//	var newSrc = copy + combineFiles(files);

//	var newSrc = combineFiles(files);

	// var pathPart = 'Dist/yax' + (buildName ? '_' + buildName : '');
	var pathPart = 'Dist/yax' + (buildName ? '.' + buildName : '');

	//var srcPath = pathPart + '_src.js';
	var srcPath = pathPart + '.src.js';

	var oldSrc = loadSilently(srcPath);

	var srcDelta = getSizeDelta(newSrc, oldSrc, true);

	console.log('\tUncompressed: ' + bytesToKB(newSrc.length) + srcDelta);

	if (newSrc !== oldSrc) {
		fs.writeFileSync(srcPath, newSrc);
		console.log('\tSaved to ' + srcPath);
	}

	var path = pathPart + '.js';

	var oldCompressed = loadSilently(path);

//	var newCompressed = copy + UglifyJS.minify(newSrc, {
	var newCompressed = UglifyJS.minify(newSrc, {
		warnings: true,
		fromString: true
	}).code;

	var delta = getSizeDelta(newCompressed, oldCompressed);

	console.log('\tCompressed: ' + bytesToKB(newCompressed.length) + delta);

	var newGzipped;
	var gzippedDelta = '';

	function done() {
		if (newCompressed !== oldCompressed) {
			fs.writeFileSync(path, newCompressed);
			console.log('\tSaved to ' + path);
		}

		console.log('\tGzipped: ' + bytesToKB(newGzipped.length) + gzippedDelta);

		callback();
	}

	zlib.gzip(newCompressed, function (err, gzipped) {
		if (err) {
			return;
		}

		newGzipped = gzipped;

		if (oldCompressed && (oldCompressed !== newCompressed)) {
			zlib.gzip(oldCompressed, function (err, oldGzipped) {
				if (err) {
					return;
				}

				gzippedDelta = getSizeDelta(gzipped, oldGzipped);

				done();
			});
		} else {
			done();
		}
	});
};
