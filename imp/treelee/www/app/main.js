/*global require, window, document, history, navigator, ionic*/
require.config({
    baseUrl: 'app',
    paths: {
        'nls': 'dicts',
        'angular': '../lib/angularjs/angular.min',
        'angular_route': '../lib/angularjs/extras/angular-route.min',
        'angular_animate': '../lib/angularjs/extras/angular-animate.min',
        'angular_sanitize': '../lib/angularjs/extras/angular-sanitize.min',
        'angular_uirouter': '../lib/angularjs/extras/angular-ui-router.min',
        'angular_localstorage': '../lib/angularjs/extras/angular-local-storage.min',
        'angular_ionic': '../lib/ionic/ionic-angular.min' // necessary angular extension to combine ionic framework with angularjs
    },
    shim: {
        'angular' : { 'exports' : 'angular' },
        'angular_animate': { deps: ['angular'] },
        'angular_uirouter': { deps: ['angular'] },
        'angular_route': { deps: ['angular'] },
        'angular_sanitize': { deps: ['angular'] },
        'angular_localstorage': {deps: ['angular']},
        'ionic': { deps: ['angular'] },
        'angular_ionic': ['angular_sanitize', 'angular_animate', 'angular_route', 'angular_uirouter']
    },
    waitSeconds: 0,
    priority: [
        'angular',
        'angular_ionic'
    ],
    callback: function () {
        'use strict';
        require([
            'angular',
            'routes',
            'config'
        ], function (angular) {
            // init app
            angular.bootstrap(document, ['app']);
        });
    }
});



