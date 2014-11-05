/**
 * YAX.JS building, testing and linting scripts.
 *
 * To use, install Node, then run the following commands in the project root:
 *
 * npm install -g jake
 * npm install
 *
 * To check the code for errors and build YAX.JS from source, run "jake".
 * To run the tests, run "jake test".
 *
 * For a custom build, open build/build.html in the browser and follow the instructions.
 */

var build = require('./Build/build.js');

function hint(msg, paths) {
	return function () {
		console.log(msg);
		jake.exec('node node_modules/jshint/bin/jshint -c ' + paths, {
			printStdout: true
		}, function () {
			console.log('\tCheck passed.\n');
			complete();
		});
	};
}

desc('Check YAX.JS source for errors with JSHint');

task('lint', {
	async: true
}, hint('Checking for JS errors...', 'Build/hint_resource.js Source'));

desc('Combine and compress YAX.JS source files');

task('build', {
	async: true
}, function (compsBase32, buildName) {
	build.build(complete, compsBase32, buildName);
});

desc('Run PhantomJS tests');

task('test', ['lint', 'lintspec'], {
	async: true
}, function () {
	build.test(complete);
});

task('default', ['test', 'build']);

jake.addListener('complete', function () {
	process.exit();
});
