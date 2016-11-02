/*globals define, Image*/
define([
    'app',
    'services/image'
], function (app) {

    'use strict';

    app.directive('styleImage', [
        '$window',
        'imageService',
        function ($window, imageService) {
            return {
                link: function ($scope, element, attr) {
                    $scope.styleImage = $scope.$eval(attr.styleImage);

                    if (!$window.cordova && !$scope.styleImage.isPreview) {
                        if ($scope.styleImage && $scope.styleImage.path && $scope.styleImage.width) {
                            $scope.styleImage.path = imageService.getPath($scope.styleImage, 1200);
                        } else {
                            /*$scope.styleImage = {
                                path: 'resources/images/test.jpg',
                                width: 1424,
                                height: 2492
                            };*/
                            $scope.styleImage = {
                                path: 'resources/images/preview/preview_1.jpg',
                                width: 1080,
                                height: 1920
                            };
                        }
                    } else {
                        if ($scope.styleImage && !$scope.styleImage.temp && !$scope.styleImage.isPreview) {
                            $scope.styleImage.path = imageService.getPath($scope.styleImage, 1200);
                        }
                    }

                    var containerRec = element.parent()[0].getBoundingClientRect(),
                        containerRatio = containerRec.width / containerRec.height,
                        imageRatio = $scope.styleImage.width / $scope.styleImage.height;

                    $scope.image = {};

                    if (containerRatio < imageRatio) {
                        $scope.image.width = containerRec.width;
                        $scope.image.height = (containerRec.width) * $scope.styleImage.height / $scope.styleImage.width;
                    } else {
                        $scope.image.width = (containerRec.height) * imageRatio;
                        $scope.image.height = containerRec.height;
                    }
                }
            };
        }
    ]);
});
