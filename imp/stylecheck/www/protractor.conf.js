exports.config = {
    chromeDriver: './node_modules/protractor/selenium/chromedriver',
    seleniumAddress: 'http://localhost:4444/wd/hub',
    baseUrl: 'http://192.168.56.101/stylecheck/app',
    multiCapabilities: [{
        browserName: 'chrome',
        'chromeOptions': {
            'args': ['--disable-web-security']
        }
    },
    {
        'browserName': 'phantomjs',
        'version': '',
        'platform': 'ANY',
        'phantomjs.binary.path': './node_modules/phantomjs/bin/phantomjs',
        //'phantomjs.binary.path': './node_modules/phantomjs/lib/phantom/phantomjs.exe',
        'phantomjs.ghostdriver.cli.args': ['--loglevel=DEBUG']
    }],
    allScriptsTimeout: 20000,
    getPageTimeout: 20000,
    onPrepare: function () {
        browser.driver.manage().window().maximize();
        require('jasmine-spec-reporter');
        // add jasmine spec reporter
        jasmine.getEnv().addReporter(new jasmine.SpecReporter({displayStacktrace: false}));
    }
};
