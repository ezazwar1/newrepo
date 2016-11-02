/*global require, window, document, history, navigator, ionic*/
var require = {
    baseUrl: 'app',
    paths: {
        'angular_localstorage': '../lib/angularjs/extras/angular-local-storage.min',
        'ngImgCrop': '../lib/angularjs/extras/ng-img-crop',
        'ionic': '../lib/ionic/ionic.bundle.min', // necessary angular extension to combine ionic framework with angularjs,
        'moment': '../lib/moment/moment',
        'ngSlider': '../lib/ng-slider/ng-slider.min'
    },
    shim: {
        'app': {deps: ['ionic']},
        'routes': {deps: ['app']},
        'config': {deps: ['app']}
    },
    waitSeconds: 0,
    priority: [
        'ionic',
        'app',
        'routes',
        'config',
        'angular_localstorage'
    ]
};



