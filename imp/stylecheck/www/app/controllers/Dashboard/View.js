/*global define, Image, StatusBar*/
define([
    'app',
    'services/browse',
    'services/style',
    'factories/popup',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('DashboardCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        '$ionicActionSheet',
        '$window',
        'browseService',
        'styleService',
        'PopupFactory',
        'LoadingFactory',
        function ($scope, $rootScope, $timeout, $ionicActionSheet, $window, browseService, styleService, popupFactory, loadingFactory) {
            var targetWidth = 1080,
                targetHeight = 1920;

            if (ionic.Platform.isIOS()) {
                $scope.$on('$ionicView.enter', function () {
                    $scope.$emit('appLoaded');
                });
            }

            function photoSuccess(newImage) {
                if (ionic.Platform.isIOS()) {
                    StatusBar.hide();
                }

                loadingFactory().then(function (loadingOverlay) {
                    $timeout(function () {
                        $window.resolveLocalFileSystemURL(newImage, function (fileEntry) {
                            fileEntry.file(function (fileObj) {
                                var image = new Image();

                                image.onload = function () {
                                    if (fileObj.size < 5242880) {
                                        styleService.newStyle.image = {
                                            path: fileObj.localURL + '?' + Date.now(),
                                            originalPath: fileObj.localURL,
                                            width: image.width,
                                            height: image.height,
                                            variants: [],
                                            temp: true
                                        };

                                        $rootScope.resetHistory();
                                        browseService.go('base.createStyle.chooseCategory').then(loadingOverlay.hide);
                                    } else {
                                        loadingOverlay.hide();
                                        $scope.loadingImage = false;
                                        return popupFactory({
                                            title: $rootScope.dict.errors.errorTitle,
                                            template: $rootScope.dict.errors.fileSizeError,
                                            okType: 'button-outline button-assertive'
                                        }, 'alert');
                                    }
                                };

                                image.src = fileObj.localURL;
                            });
                        });
                    });
                });
            }

            function photoFail(message) {
                if (ionic.Platform.isIOS()) {
                    StatusBar.hide();
                }
                if (message !== 'Camera cancelled.' && message !== 'Selection cancelled.' && message !== 'no image selected' && message !== 'has no access to assets') {
                    return popupFactory({
                        title: '<b>' + $rootScope.dict.errors.errorTitle + '</b>',
                        template: $rootScope.dict.errors.photoFail,
                        okType: 'button-outline button-assertive'
                    }, 'alert');
                }
            }

            function uploadImage() {
                $window.navigator.camera.getPicture(photoSuccess, photoFail, {
                    quality: 50,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    correctOrientation: true,
                    destinationType: $window.navigator.camera.DestinationType.FILE_URI,
                    sourceType: $window.navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: $window.navigator.camera.MediaType.Picture
                });
            }

            function captureImage() {
                $window.navigator.camera.getPicture(photoSuccess, photoFail, {
                    quality: 50,
                    targetWidth: targetWidth,
                    targetHeight: targetHeight,
                    correctOrientation: true,
                    destinationType: $window.navigator.camera.DestinationType.FILE_URI,
                    sourceType: $window.navigator.camera.PictureSourceType.CAMERA,
                    mediaType: $window.navigator.camera.MediaType.Picture
                });
            }

            $scope.showActionSheet = function () {
                $ionicActionSheet.show({
                    titleText: $rootScope.dict.record,
                    buttons: [
                        { text: $rootScope.dict.takePicture},
                        { text: $rootScope.dict.choosePicture}
                    ],
                    cancelText: $rootScope.dict.cancel,
                    cancel: angular.noop,
                    buttonClicked: function (index) {
                        if (!$window.cordova) {
                            styleService.newStyle.image = {
                                path: 'resources/images/test.jpg'
                            };
                            $rootScope.resetHistory();
                            browseService.go('base.createStyle.chooseCategory');
                            return true;
                        }
                        if (index) {
                            uploadImage();
                        } else {
                            captureImage();
                        }
                        return true;
                    }
                });
            };

            // everytime when view entered
            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.showIcon = false;
                $rootScope.resetHistory(true);
                $scope.$emit('messageCount');
            });
        }
    ]);
});
