/*globals define*/
define([
    'app'
], function (app) {

    'use strict';
    app.directive('loadingIndicator', [
        function () {
            return function ($scope, $element, attr) {

                // if no loading key is connected
                if (!attr.loading) {
                    return;
                }

                $element.addClass('ng-hide');

                $element.after('<div class="loading-spinner"><div class="spinner"></div></div>');
                var $loadingIndicator = $element.next();

                $scope.$watch(function () {
                    return $scope[attr.loading];
                }, function (newValue) {
                    if (newValue !== undefined) {
                        if (newValue) {
                            $element.addClass('ng-hide');
                            $loadingIndicator.removeClass('ng-hide');
                        } else {
                            $loadingIndicator.addClass('fade-out');
                            $element.removeClass('ng-hide');
                        }
                    }
                });

            };
        }
    ]);
});
