// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

// noinspection JSUnresolvedFunction
process.env.CHROME_BIN = require('puppeteer').executablePath();

module.exports = function (config) {
	config.set({
		basePath: '',
		frameworks: ['jasmine', '@angular-devkit/build-angular'],
		plugins: [
			require('karma-jasmine'),
			require('karma-chrome-launcher'),
			require('karma-jasmine-html-reporter'),
			require('karma-coverage-istanbul-reporter'),
			require('karma-junit-reporter'),
			require('@angular-devkit/build-angular/plugins/karma')
		],
		client: {
			clearContext: false // leave Jasmine Spec Runner output visible in browser
		},
		coverageIstanbulReporter: {
			dir: require('path').join(__dirname, '../reports/coverage'),
			reports: ['html', 'lcovonly'],
			fixWebpackSourcePaths: true
		},
		reporters: ['progress', 'junit'],
		junitReporter: {
			outputDir: '../reports/junit',
			outputFile: 'report.xml',
			useBrowserName: false,
		},
		port: 9876,
		colors: true,
		logLevel: config.LOG_INFO,
		autoWatch: true,
		browsers: ['ChromeHeadless'],
		singleRun: true
	});
};
