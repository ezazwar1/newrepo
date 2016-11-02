/*global define, ionic*/
define([
    'app',
    'services/browse',
    'services/user',
    'factories/popup',
    'factories/storage',
    'factories/loading'
], function (app) {

    'use strict';

    app.controller('LoginCtrl', [
        '$scope',
        '$rootScope',
        '$window',
        'browseService',
        'userService',
        'PopupFactory',
        'StorageFactory',
        'LoadingFactory',
        function ($scope, $rootScope, $window, browseService, userService, popupFactory, storageFactory, loadingFactory) {
            var platform;

            $scope.login = {
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
                    login: '',
                    password: '',
                    platform: platform || 'test'
                };

                $scope.forgot = {
                    mail: ''
                };
            });

            $scope.login = function () {
                loadingFactory().then(function (loadingOverlay) {
                    userService.login($scope.auth).then(function (auth) {
                        storageFactory.add({
                            'logged_in': true,
                            'tokenType': auth.tokenType,
                            'accessToken': auth.accessToken,
                            'refreshToken': auth.refreshToken,
                            'userId': auth.id
                        });
                        userService.account().then(function (user) {
                            $rootScope.resetHistory();
                            if (!user.username) {
                                return browseService.go('base.editProfileFirst', {
                                    first: true,
                                    userId: user._id
                                }).then(loadingOverlay.hide, loadingOverlay.hide);
                            }
                            browseService.go('base.dashboard').then(loadingOverlay.hide, loadingOverlay.hide);
                            if (user.isTempPassword) {
                                popupFactory({
                                    title: $rootScope.dict.hint,
                                    template: $rootScope.dict.changeTempPassword,
                                    buttons: [
                                        {
                                            text: $rootScope.dict.ok,
                                            type: 'button-outline button-assertive'
                                        }
                                    ]
                                });
                            }
                        }, loadingOverlay.hide);
                    }, loadingOverlay.hide);
                });
            };

            $scope.sendPassword = function () {
                userService.sendPassword({email: $scope.forgot.mail}).then(function () {
                    popupFactory({
                        title: $rootScope.dict.passwordChanged,
                        template: $rootScope.dict.passwordChangeSuccess,
                        buttons: [
                            {
                                text: $rootScope.dict.ok,
                                type: 'button-outline button-assertive'
                            }
                        ]
                    });
                },
                function (response) {
                    if (response.status === 404 && response.data.error) {
                        popupFactory({
                            title: '<b>' + $rootScope.dict.errors.errorTitle + '</b>',
                            template: $rootScope.dict.errors[response.data.error],
                            buttons: [
                                {
                                    text: $rootScope.dict.ok,
                                    type: 'button-outline button-assertive'
                                }
                            ]
                        });
                    }
                });
            };

            // open popup to reset password
            $scope.resetPassword = function () {
                $scope.popup = popupFactory({
                    scope: $scope,
                    title: $rootScope.dict.forgotPassword,
                    template: '<label class="item item-input"><input type="email" ng-model="forgot.mail" placeholder="{{dict.email}}"></label><p class="small">' + $rootScope.dict.forgotPasswordInfo + '</p>' +
                               '<div class="footer row margin-top">' +
                                    '<div class="col">' +
                                        '<button class="button button-block button-outline button-dark" ng-click="popup.close()">{{dict.cancel}}</button>' +
                                    '</div>' +
                                    '<div class="col">' +
                                        '<button class="button button-block button-outline button-assertive" ng-disabled="!forgot.mail" ng-click="popup.close(); sendPassword()">{{dict.send}}</button>' +
                                    '</div>' +
                               '</div>'
                });
            };
        }
    ]);
});
