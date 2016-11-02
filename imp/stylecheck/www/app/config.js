/*global define, StatusBar, navigator, ionic, window, angular*/
define([
    'app',
    'settings'
], function (app, settings) {
    'use strict';

    // get default dict (browser language if supported or default)
    var browserLanguage = window.navigator.language.toLowerCase().substring(0,  2);
    if (settings.languages.indexOf(browserLanguage) === -1) {
        browserLanguage = settings.languages[0];
    }
    require(['dicts/' + browserLanguage], function (dict) {
        // init app
        return app.run([
            '$rootScope',
            '$window',
            '$ionicPlatform',
            function ($rootScope, $window, $ionicPlatform) {
                // put dictionary on rootScope
                $rootScope.dict = dict;
                // add analytics for mobile tracking
                $ionicPlatform.ready(function () {
                    if ($window.cordova && $window.plugins && $window.plugins.gaPlugin && settings.gaID) {
                        $window.plugins.gaPlugin.init(function () {
                            $rootScope.gaConnected = true;
                        }, function () {
                            $rootScope.gaConnected = false;
                        }, settings.gaID, 10);
                    }
                });
            }
        ]);
    });
});
