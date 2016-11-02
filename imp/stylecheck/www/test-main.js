(function (window, require) {
    var allTestFiles = [];
    var TEST_REGEXP = /(spec|test)\/unit\/.*\.js$/i;

    var pathToModule = function(path) {
        return path.replace(/^\/base\/app\//, '').replace(/\.js$/, '');
    };

    Object.keys(window.__karma__.files).forEach(function(file) {
        console.log(file);
        if (TEST_REGEXP.test(file)) {
            // Normalize paths to RequireJS module names.
            allTestFiles.push(pathToModule(file));
        }
    });

    console.log('Tests found: ', allTestFiles);

    require.config({
        // Karma serves files under /base, which is the basePath from your config file
        baseUrl: '/base/app',

        // dynamically load all test files
        paths: {
            'ionic': '../lib/ionic/ionic.bundle.min', // necessary angular extension to combine ionic framework with angularjs,
            'angular_localstorage': '../lib/angularjs/extras/angular-local-storage.min',
            'ngImgCrop': '../lib/angularjs/extras/ng-img-crop',
            'ngSlider': '../lib/ng-slider/ng-slider.min',
            'angularMocks': '../lib/angularjs/extras/angular-mocks',
            'moment': '../lib/moment/moment'
        },
        shim: {
            'angular_localstorage': {deps: ['ionic']},
            'ngImgCrop': {deps: ['ionic']},
            'ngSlider': {deps: ['ionic']},
            'angularMocks': {deps: ['ionic'], 'exports': 'angular.mock'},
            'templates/styles/create/tagOverview.html': {deps: ['ionic']},
            'app': {deps: ['ionic']},
            'settings': {deps: ['app']},
            'config': {deps: ['settings']}
        },
        deps: allTestFiles,
        callback: window.__karma__.start
    });
}(window, require));
