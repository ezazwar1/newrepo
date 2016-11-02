/*global define*/
define([
    'app',
    'ngImgCrop',
    'services/user',
    'services/image',
    'services/browse',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('EditImageCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        'userService',
        'imageService',
        'browseService',
        'LoadingFactory',
        function ($scope, $rootScope, $timeout, userService, imageService, browseService, loadingFactory) {
            var avatarCopy;

            $scope.$on('$ionicView.beforeEnter', function () {
                // resulting base64 string
                $scope.image = {};
                $scope.image.cropped = '';
                $scope.cropAreaHeight = $rootScope.screen.height - $rootScope.screen.header - $rootScope.screen.footer - 52;

                avatarCopy = angular.copy(userService.tempImage);

                $scope.image.original = avatarCopy;
            });

            $scope.doUpload = function () {
                loadingFactory().then(function (loadingOverlay) {
                    $timeout(function () {
                        userService.uploadImage({avatar: $scope.image.cropped}).then(function () {
                            if (browseService.params().first) {
                                browseService.go('base.editProfileFirst', {userId: userService.user._id, first: 'first'}).then(loadingOverlay.hide, loadingOverlay.hide);
                            } else {
                                browseService.go('base.editProfile', {userId: userService.user._id}).then(loadingOverlay.hide, loadingOverlay.hide);
                            }
                        }, loadingOverlay.hide);
                    });
                });
            };
        }
    ]);
});
