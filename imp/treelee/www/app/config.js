/*global define, StatusBar, navigator, ionic*/
define([
    'app',
    'i18n!nls/defaultDict'
], function (app, dict) {
    'use strict';
    return app.run([
        '$rootScope',
        function ($rootScope) {
            // put dictionary on rootScope
            $rootScope.dict = dict;
        }
    ]);
});
