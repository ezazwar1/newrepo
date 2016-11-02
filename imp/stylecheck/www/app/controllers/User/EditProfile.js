/*global define, StatusBar*/
define([
    'app',
    'ngImgCrop',
    'services/user',
    'services/browse',
    'services/image',
    'factories/popup'
], function (app) {

    'use strict';

    app.controller('EditProfileCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        '$ionicActionSheet',
        'userService',
        'browseService',
        'imageService',
        'PopupFactory',
        'LoadingFactory',
        function ($scope, $rootScope, $window, $ionicActionSheet, userService, browseService, imageService, popupFactory, loadingFactory) {
            var stateParams,
                avatarCopy;

            $scope.form = {
                userData: {}
            };

            $scope.$on('$ionicView.beforeEnter', function () {
                stateParams = browseService.params();
                //$scope.form.userData = {};
                $scope.valid = {
                    name: true
                };
                $scope.userData = userService.tempUser || {};
                $scope.temp = {
                    username: userService.tempUser ? userService.tempUser.tempUsername : ''
                };
                $scope.croppedImage = '';
                $scope.cropAreaHeight = $rootScope.screen.height - $rootScope.screen.header - $rootScope.screen.footer - 52;
                if (!userService.tempUser) {
                    $scope.userData.username = userService.user.username;
                    $scope.userData.gender = userService.user.gender || 'female';
                    $scope.userData.age = userService.user.age || 22;
                    $scope.userData.location = userService.user.location;
                    $scope.userData.info = userService.user.info;
                    $scope.userData.firstName = userService.user.firstName;
                }
                avatarCopy = angular.copy(userService.user.avatar);
                $scope.userData.avatar = avatarCopy;
                $scope.avatar = imageService.getPath(avatarCopy, 600);

                if (stateParams.first) {
                    $rootScope.first = true;
                }
            });

            function photoSuccess(image) {
                if (ionic.Platform.isIOS()) {
                    StatusBar.hide();
                }
                loadingFactory().then(function (loadingOverlay) {
                    userService.tempImage = image;
                    userService.tempUser = $scope.userData;
                    userService.tempUser.tempUsername = $scope.temp.username;
                    if (stateParams.first) {
                        browseService.go('base.editImageFirst', {first: 'true'}).then(loadingOverlay.hide, loadingOverlay.hide);
                    } else {
                        browseService.go('base.editImage').then(loadingOverlay.hide, loadingOverlay.hide);
                    }
                });
            }

            function photoFail(message) {
                StatusBar.hide();
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
                    targetWidth: 1920,
                    targetHeight: 1080,
                    correctOrientation: true,
                    destinationType: $window.navigator.camera.DestinationType.FILE_URI,
                    sourceType: $window.navigator.camera.PictureSourceType.PHOTOLIBRARY,
                    mediaType: $window.navigator.camera.MediaType.Picture
                });
            }

            function captureImage() {
                $window.navigator.camera.getPicture(photoSuccess, photoFail, {
                    quality: 50,
                    targetWidth: 1920,
                    targetHeight: 1080,
                    correctOrientation: true,
                    destinationType: $window.navigator.camera.DestinationType.FILE_URI,
                    sourceType: $window.navigator.camera.PictureSourceType.CAMERA,
                    mediaType: $window.navigator.camera.MediaType.Picture
                });
            }

            $scope.showActionSheet = function () {
                $ionicActionSheet.show({
                    titleText: $rootScope.dict.profileImage,
                    buttons: [
                        { text: $rootScope.dict.takePicture},
                        { text: $rootScope.dict.choosePicture}
                    ],
                    cancelText: $rootScope.dict.cancel,
                    cancel: angular.noop,
                    buttonClicked: function (index) {
                        if (!$window.cordova) {
                            userService.tempUser = $scope.userData;
                            userService.tempUser.tempUsername = $scope.temp.username;
                            if (stateParams.first) {
                                browseService.go('base.editImageFirst', {first: 'first'});
                            } else {
                                browseService.go('base.editImage');
                            }
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

            $scope.save = function () {
                var save = function () {
                    loadingFactory().then(function (loadingOverlay) {
                        $scope.userData.age = parseInt($scope.userData.age, 10);
                        if ($rootScope.first) {
                            $scope.userData.username = $scope.temp.username;
                            userService.setAccount($scope.userData).then(function () {
                                $rootScope.resetHistory();
                                browseService.go('base.brandsFirst', {first: 'first'}).then(function () {
                                    delete userService.tempUser;
                                    loadingOverlay.hide();
                                }, loadingOverlay.hide);
                            }, function () {
                                $scope.userData.username = '';
                                loadingOverlay.hide();
                            });
                        } else {
                            if (!$scope.userData.username && $scope.temp.username) {
                                $scope.userData.username = $scope.temp.username;
                            }
                            userService.setAccount($scope.userData).then(function () {
                                browseService.go('base.profile.overview', {userId: stateParams.userId}).then(loadingOverlay.hide, loadingOverlay.hide);
                                delete userService.tempUser;
                            }, function () {
                                loadingOverlay.hide();
                            });
                        }
                    });
                };

                if ($rootScope.first && !$scope.avatar) {
                    popupFactory({
                        title: $rootScope.dict.profileImage,
                        template: $rootScope.dict.saveWithoutImage,
                        buttons: [
                            {
                                text: $rootScope.dict.upload,
                                type: 'button-outline button-assertive',
                                onTap: function () {
                                    $scope.showActionSheet();
                                }
                            },
                            {
                                text: $rootScope.dict.later,
                                type: 'button-outline button-dark',
                                onTap: function () {
                                    save();
                                }
                            }
                        ]
                    });
                } else {
                    save();
                }
            };

            $scope.checkUserName = function () {
                if ($scope.temp.username && $scope.temp.username.length > 3) {
                    loadingFactory().then(function (loadingOverlay) {
                        userService.check({username: $scope.temp.username}).then(function (exists) {
                            loadingOverlay.hide();
                            if (exists.exists) {
                                popupFactory({
                                    title: $rootScope.dict.errors.errorTitle,
                                    template: $rootScope.dict.errors.username_exists,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button-outline button-assertive'
                                        }
                                    ]
                                });
                                $scope.valid.name = false;
                            } else if ($scope.userData && $scope.userData.gender) {
                                $scope.valid.name = true;
                            }
                        }, loadingOverlay.hide);
                    });
                }
            };
        }
    ]);
});
