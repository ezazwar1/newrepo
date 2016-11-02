/*globals define, Image*/
define([
    'app',
    'services/image',
    'directives/styleImage',
    'services/browse',
    'services/user'
], function (app) {

    'use strict';

    app.directive('addTag', [
        '$window',
        '$timeout',
        'browseService',
        'userService',
        function ($window, $timeout, browseService, userService) {
            return {
                scope: {
                    'editing': '=',
                    'style': '=tagStyle',
                    'show': '=',
                    'existingStyle': '=?'
                },
                templateUrl: 'app/templates/partials/addTag.html',
                replace: true,
                link: function ($scope, element) {

                    var watcher = $scope.$watch(function () {
                        return $scope.show;
                    }, function (show) {
                        if (!show) {
                            return;
                        }
                        watcher();

                        if (!$window.cordova && (!$scope.style.image || !$scope.style.image.width)) {
                            $scope.tagimage = {
                                path: 'resources/images/test.jpg',
                                width: 1424,
                                height: 2492
                            };
                        } else {
                            $scope.tagimage = $scope.style.image;
                        }

                        var imageContainer = angular.element(element.children()[0]),
                            tagSize = 24,
                            tagOffset = tagSize / 2;

                        // add new one
                        function addTag(x, y) {
                            var firstTag,
                                newLength,
                                currentTag = $scope.style.tags[$scope.style.tags.length - 1];

                            if ($scope.style.activeTag === undefined || !currentTag || currentTag._id) {
                                newLength = $scope.style.tags.push({
                                    'x': x,
                                    'y': y,
                                    'gender': userService.user.gender || 'female'
                                });
                                $scope.style.activeTag = newLength - 1;
                                firstTag = true;
                            } else {
                                var tag = $scope.style.tags[$scope.style.activeTag];
                                tag.x = x;
                                tag.y = y;
                                firstTag = false;
                            }

                            if (firstTag) {
                                $timeout(function () {
                                    if (!$scope.existingStyle) {
                                        browseService.go('base.createStyle.tags.tagOverview');
                                    } else {
                                        browseService.go('base.editStyle.tags.tagOverview');
                                    }
                                }, 300);
                            }
                        }

                        // set new position
                        function placeTag(x, y) {
                            var imageRec = imageContainer[0].getBoundingClientRect(),
                                factor = $scope.tagimage.width / imageRec.width,
                                tag = $scope.style.tags[$scope.style.activeTag];

                            if (tag && tag._id && $scope.editing) {
                                tag.x = (x - imageRec.left) * factor;
                                tag.y = (y - imageRec.top) * factor;
                            } else if ($scope.editing) {
                                addTag((x - imageRec.left) * factor, (y - imageRec.top) * factor);
                            }
                        }

                        // getTop value
                        function getTop(y, isTag) {
                            var imageRec = imageContainer[0].getBoundingClientRect(),
                                factor = $scope.tagimage.width / imageRec.width,
                                offset = true;

                            if (isTag) {
                                y = y / factor;
                                if ((y - tagOffset) < 0) {
                                    offset = false;
                                }
                                return offset ? y - tagOffset : y;
                            }

                            if ((y - imageRec.top - tagOffset) < 0) {
                                offset = false;
                            }
                            return y - imageRec.top - (offset ? tagOffset : 0);
                        }
                        // getLeft value
                        function getLeft(x, isTag) {
                            var imageRec = imageContainer[0].getBoundingClientRect(),
                                factor = $scope.tagimage.width / imageRec.width,
                                offset = true;

                            if (isTag) {
                                x = x / factor;
                                if ((x - tagOffset) < 0) {
                                    offset = false;
                                }
                                return offset ? x - tagOffset : x;
                            }

                            if ((x - imageRec.left - tagOffset) < 0) {
                                offset = false;
                            }
                            return x - imageRec.left - (offset ? tagOffset : 0);
                        }

                        $scope.getTop = function (y) {
                            return getTop(y, true) + 'px';
                        };

                        $scope.getLeft = function (x) {
                            return getLeft(x, true) + 'px';
                        };

                        $scope.placeTag = function (event) {
                            placeTag(event.gesture.touches[0].clientX, event.gesture.touches[0].clientY);
                        };

                        $scope.chooseTag = function ($event, index) {
                            $event.preventDefault();
                            $event.stopPropagation();
                            $event.stopImmediatePropagation();
                            $scope.$emit('tagChanged', index);
                        };
                    });
                }
            };
        }
    ]);
});
