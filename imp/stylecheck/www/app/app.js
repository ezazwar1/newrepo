/*global define*/
define([
    'ionic',
    'angular_localstorage',
    'ngImgCrop',
    'ngSlider'
], function () {
    'use strict';

    // the app with its used plugins
    var app = angular.module('app', [
        'ionic',
        'ui.router',
        'LocalStorageModule',
        'ngImgCrop',
        'ngSlider'
    ]);

    return app;
});

