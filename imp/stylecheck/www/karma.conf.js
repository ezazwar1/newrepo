// Karma configuration
module.exports = function (config) {
    config.set({
        files: [
            {
                pattern: 'lib/**/*.js',
                included: false,
                watched: false
            },
            {
                pattern: 'app/app.js',
                included: false,
                watched: false
            },
            {
                pattern: 'app/dicts/de.js',
                included: false
            },
//            {
//                pattern: 'app/controllers/**/*.js',
//                included: false
//            },
            {
                pattern: 'app/directives/*.js',
                included: false
            },
//            {
//                pattern: 'app/factories/**/*.js',
//                included: false
//            },
            {
                pattern: 'app/services/**/*.js',
                included: false
            },
            {
                pattern: 'app/templates/**/*.html',
                included: false,
                watched: false
            },
            {
                pattern: 'app/spec/unit/**/*.js',
                included: false
            },
            'test-main.js'
        ],
        // level of logging
        // possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG
        logLevel: config.LOG_DEBUG
    });
};
