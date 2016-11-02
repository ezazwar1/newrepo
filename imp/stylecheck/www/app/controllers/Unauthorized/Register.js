/*global define*/
define([
    'app',
    'services/user',
    'services/browse',
    'services/page',
    'factories/storage',
    'factories/popup',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('RegisterCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        'userService',
        'browseService',
        'StorageFactory',
        'LoadingFactory',
        function ($scope, $rootScope, $window, userService, browseService, StorageFactory, loadingFactory) {
            var platform;

            $scope.register = {
                form: {}
            };

            if ($window.cordova) {
                $window.plugins.uniqueDeviceID.get(function (id) {
                    $scope.auth.uuid = id;
                }, function (error) {
                    console.log('uuid error:', error);
                });
                if (ionic.Platform.isAndroid()) {
                    platform = 'android';
                } else if (ionic.Platform.isIOS()) {
                    platform = 'ios';
                }
            }

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.auth = {
                    firstName: '',
                    lastName: '',
                    email: '',
                    password: '',
                    language: $window.navigator.language.substr(0, 2),
                    repeatPassword: '',
                    platform: platform || 'test'
                };
                $scope.termsAccepted = false;
            });

            $scope.registration = function () {
                loadingFactory().then(function (loadingOverlay) {
                    userService.register($scope.auth).then(function (user) {
                        userService.login({password: $scope.auth.password, login: user.email, platform: $scope.auth.platform}).then(function (userAuth) {
                            StorageFactory.add({
                                'logged_in': true,
                                'tokenType': userAuth.tokenType,
                                'accessToken': userAuth.accessToken,
                                'refreshToken': userAuth.refreshToken,
                                'userId': userAuth.id
                            });
                            $rootScope.resetHistory();
                            browseService.go('base.editProfileFirst', {userId: userAuth.id, first: 'first'}).then(loadingOverlay.hide, loadingOverlay.hide);
                        }, loadingOverlay.hide);
                    }, loadingOverlay.hide);
                });
            };


            $scope.comparePasswords = function () {
                if ($scope.auth.password && $scope.auth.repeatPassword) {
                    if ($scope.auth.password !== $scope.auth.repeatPassword) {
                        $scope.register.form.$invalid = true;
                    } else if ($scope.auth.email && $scope.termsAccepted) {
                        $scope.register.form.$invalid = false;
                    }
                }
            };

        }
    ]);
});
