/*global define*/
define([
    'angular',
    'angular_ionic',
    'angular_localstorage'
], function (angular) {
    'use strict';

    // the app with its used plugins
    return angular.module('app', [
        'ionic',
        'ui.router',
        'LocalStorageModule'
    ]);
});

