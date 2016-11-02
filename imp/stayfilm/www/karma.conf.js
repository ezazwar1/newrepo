// Karma configuration
// Generated on Wed Feb 26 2014 17:55:52 GMT-0300 (BRT)

module.exports = function (config) {
	config.set({
		// base path, that will be used to resolve files and exclude
		basePath: '',
		// frameworks to use
		frameworks: ['jasmine'],
		// list of files / patterns to load in the browser
		files: [
			'bower/angular/angular.js',
			'bower/angular-mocks/angular-mocks.js',
			'bower/ionic/release/js/ionic.js',
			'bower/angular/angular.js',
			'bower/angular-animate/angular-animate.js',
			'bower/angular-route/angular-route.js',
			'bower/angular-touch/angular-touch.js',
			'bower/angular-sanitize/angular-sanitize.js',
			'bower/angular-ui-router/release/angular-ui-router.js',
			'bower/ionic/release/js/ionic-angular.js',
			'bower/lodash/dist/lodash.js',
			'bower/restangular/dist/restangular.js',
			'app.js',
			'services/AuthServ.js',
			'services/Utils.js',
			'services/SessionServ.js',
			'services/UserServ.js',
			'services/GalleryServ.js',
			'**/*.spec.js'
		],
		// list of files to exclude
		exclude: [
		],
		// test results reporter to use
		// possible values: 'dots', 'progress', 'junit', 'growl', 'coverage'
		reporters: ['progress'],
		// web server port
		port: 9876,
		// enable / disable colors in the output (reporters and logs)
		colors: true,
		// level of logging
		// possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
		logLevel: config.LOG_INFO,
		// enable / disable watching file and executing tests whenever any file changes
		autoWatch: true,
		// Start these browsers, currently available:
		// - Chrome
		// - ChromeCanary
		// - Firefox
		// - Opera (has to be installed with `npm install karma-opera-launcher`)
		// - Safari (only Mac; has to be installed with `npm install karma-safari-launcher`)
		// - PhantomJS
		// - IE (only Windows; has to be installed with `npm install karma-ie-launcher`)
		browsers: ['Chrome'],
		// If browser does not capture in given timeout [ms], kill it
		captureTimeout: 60000,
		// Continuous Integration mode
		// if true, it capture browsers, run tests and exit
		singleRun: false
	});
};
