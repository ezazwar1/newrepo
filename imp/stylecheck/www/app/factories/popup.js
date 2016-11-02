/*global define*/
define([
    'app'
], function (app) {

    'use strict';

    app.factory('PopupFactory', [
        '$ionicPopup',
        function ($ionicPopup) {

            return function (options, type) {

                // load popup
                if (type === 'alert') {
                    return $ionicPopup.alert(options);
                }
                if (type === 'confirm') {
                    return $ionicPopup.confirm(options);
                }
                if (type === 'prompt') {
                    return $ionicPopup.prompt(options);
                }
                return $ionicPopup.show(options);
            };
        }
    ]);
});
