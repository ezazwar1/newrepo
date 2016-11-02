/*globals define, Image*/
define([
    'app'
], function (app) {

    'use strict';

    app.directive('imageonload', function () {
        return {
            restrict: 'A',

            link: function (scope, element, attr) {
                scope.$watch(function () {
                    return attr.imageSrc;
                }, function () {
                    // if the image is used as background image
                    if (attr.imageSrc) {
                        var image = new Image();
                        image.src = attr.imageSrc;
                        image.onload = function () {
                            element.removeClass('ng-hide');
                        };
                    // if we use an image tag
                    } else {
                        element.on('load', function () {
                           element.removeClass('ng-hide');
                        });
                    }
                });
            }
        };
    });
});