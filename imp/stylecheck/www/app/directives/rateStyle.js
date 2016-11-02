/*globals define, Image*/
define([
    'app',
    'directives/imageOnLoad',
    'directives/styleImage'
], function (app) {

    'use strict';

    app.directive('rateStyle', [
        '$timeout',
        '$window',
        function ($timeout, $window) {
            return {
                templateUrl: 'app/templates/partials/rateStyle.html',
                replace: true,
                link: function ($scope, element) {
                    var touchContainer,
                        containerRec;

                    if (!$scope.style.rating) {
                        touchContainer = angular.element(element.children()[1])[0];
                        containerRec = touchContainer.getBoundingClientRect();

                        $window.ionic.EventController.on('touchmove', function (event) {
                            event.preventDefault();

                            $timeout(function () {
                                var left = event.changedTouches[0].pageX - containerRec.left,
                                    top = event.changedTouches[0].pageY - containerRec.top,
                                    rate = 0;

                                if (left >= 0 && top >= 0 && left <= containerRec.width && top <= containerRec.height) {

                                    if (top >= (containerRec.height / 2) + 30) { // bottom
                                        if (left >= containerRec.width / 2) { // right side
                                            rate = 4;
                                        } else {
                                            rate = 1;
                                        }

                                    } else if (top <= (containerRec.height / 2) - 30) { // top
                                        if (left >= containerRec.width / 2) { // right side
                                            rate = 3;
                                        } else {
                                            rate = 2;
                                        }
                                    }
                                }
                                $timeout(function () {
                                    $scope.rate = rate;
                                });
                            });

                        }, touchContainer);
                    } else {
                        touchContainer = angular.element(element.children()[2])[0];
                        containerRec = touchContainer.getBoundingClientRect();
                    }

                    function touchstart() {
                        $timeout(function () {
                            $scope.showRating = true;
                        });
                    }

                    function touchend() {
                        $timeout(function () {
                            $scope.$emit('rated', $scope.rate);
                            $scope.showRating = false;
                            $scope.rate = 0;
                        }, 600);
                    }

                    function off() {
                        $window.ionic.EventController.off('touchstart', touchstart, touchContainer);
                        $window.ionic.EventController.off('touchend', touchend, touchContainer);
                        $window.ionic.EventController.off('touchcancel', touchend, touchContainer);
                    }

                    function on() {
                        $window.ionic.EventController.on('touchstart', touchstart, touchContainer);
                        $window.ionic.EventController.on('touchend', touchend, touchContainer);
                        $window.ionic.EventController.on('touchcancel', touchend, touchContainer);
                    }

                    on();

                    $scope.$on('successfullyRated', function () {
                        off();
                        touchContainer = angular.element(element.children()[2])[0];
                        containerRec = touchContainer.getBoundingClientRect();
                        on();
                    });
                }
            };
        }
    ]);
});
