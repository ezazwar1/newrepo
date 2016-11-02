/*global define*/
define([
    'app',
    'settings',
    'services/user',
    'factories/popup',
    'factories/modal'
], function (app, settings) {

    'use strict';

    app.controller('AccountSettingsCtrl', [
        '$scope',
        '$rootScope',
        '$timeout',
        'userService',
        'PopupFactory',
        'LoadingFactory',
        function ($scope, $rootScope, $timeout, userService, popupFactory, loadingFactory) {
            $scope.form = {};

            $scope.$on('$ionicView.beforeEnter', function () {
                $scope.user = userService.user;
                $scope.oldLanguage = $scope.user.language;

                $scope.form.password = '';
                $scope.form.email = $scope.user.email;
                $scope.form.language = $scope.user.language;

                $scope.password = {
                    'new': '',
                    old: '',
                    confirm: ''
                };
                if ($scope.user.isSocial) {
                    $scope.isSocial = true;
                }
            });

            // open popup to reset password
            $scope.changePassword = function () {
                popupFactory({
                    scope: $scope,
                    title: $rootScope.dict.changePassword,
                    templateUrl: 'app/templates/user/partials/changePassword.html',
                    buttons: [
                        {
                            text: $rootScope.dict.cancel,
                            type: 'button-outline button-dark'
                        },
                        {
                            text: $rootScope.dict.send,
                            type: 'button-outline button-assertive',
                            onTap: function () {
                                if ($scope.password.new && $scope.password.confirm && $scope.password.new === $scope.password.confirm) {
                                    $scope.user.newPassword = $scope.password.new;
                                    loadingFactory().then(function (loadingOverlay) {
                                        userService.setAccount({
                                            _id: $scope.user._id,
                                            password: $scope.password.old,
                                            newPassword: $scope.password.new
                                        }).then(function (user) {
                                            $scope.user = user;
                                            loadingOverlay.hide();
                                        }, loadingOverlay.hide);
                                    });
                                }
                            }
                        }
                    ]
                });
            };

            $scope.changeLanguage = function () {
                var params = {
                    language: $scope.user.language
                };
                loadingFactory().then(function (loadingOverlay) {
                    userService.setAccount(params).then(function (user) {
                        $scope.user = user;
                        $scope.form.password = '';
                        $scope.form.accountSettings.$setPristine();
                        if (settings.languages.indexOf($scope.user.language) !== -1) {
                            var path = 'dicts/' + $scope.user.language;
                            require([path], function (dict) {
                                var oldDict = angular.copy($rootScope.dict);
                                $timeout(function () {
                                    $rootScope.dict = angular.extend(oldDict, dict);
                                    loadingOverlay.hide();
                                }, 0);
                            });
                        } else {
                            loadingOverlay.hide();
                        }
                    }, loadingOverlay.hide);
                });
            };

            $scope.save = function () {
                var params = {};

                if (!$scope.isSocial) {
                    params.password = $scope.form.password;
                    params.email = $scope.form.email;
                }

                loadingFactory().then(function (loadingOverlay) {
                    userService.setAccount(params).then(function (user) {
                        $scope.user = user;
                        $scope.form.password = '';
                        $scope.form.accountSettings.$setPristine();
                        loadingOverlay.hide();
                    }, loadingOverlay.hide);
                });
            };
        }
    ]);
});
