/*globals define*/
define([
    'app'
], function (app) {

    'use strict';

    app.directive('disableSideMenu', [
        '$ionicSideMenuDelegate',
        function ($ionicSideMenuDelegate) {
            return {
                restrict: 'A',
                link: function (scope, element) {
                    element.on('touchstart', function () {
                        scope.$apply(function () {
                            $ionicSideMenuDelegate.canDragContent(false);
                        });
                    });

                    element.on('touchend touchcancel', function () {
                        scope.$apply(function () {
                            $ionicSideMenuDelegate.canDragContent(true);
                        });
                    });
                }
            };
        }
    ]);
});