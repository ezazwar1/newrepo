(function (angular) {
    'use strict';

    angular.module('znk.sat').factory('KeyboardSrv', ['$window', function ($window) {

            var KeyboardSrv = {};

            KeyboardSrv.hideKeyboard = function hideKeyboard(){
                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard ){
                    if ($window.cordova.plugins.Keyboard.isVisible){
                        $window.cordova.plugins.Keyboard.close();
                    }
                }
            };

            KeyboardSrv.isVisible = function isVisible(){
                if ($window.cordova && $window.cordova.plugins && $window.cordova.plugins.Keyboard ){
                    return $window.cordova.plugins.Keyboard.isVisible;
                }
                else{
                    return undefined;
                }

            };

            return KeyboardSrv;
        }
    ]);
})(angular);
