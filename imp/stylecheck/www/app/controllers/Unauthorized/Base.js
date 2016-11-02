/*global define, ionic*/
define([
    'app',
    'factories/storage',
    'services/browse',
    'services/user',
    'services/page',
    'factories/loading',
    'factories/popup',
    'factories/modal'
], function (app) {

    'use strict';

    app.controller('UnauthorizedCtrl', [
        '$q',
        '$scope',
        '$rootScope',
        '$sce',
        '$window',
        '$ionicHistory',
        'StorageFactory',
        'browseService',
        'userService',
        'pageService',
        'LoadingFactory',
        'PopupFactory',
        'ModalFactory',
        function ($q, $scope, $rootScope, $sce, $window, $ionicHistory, StorageFactory, browseService, userService, pageService, loadingFactory, popupFactory, modalFactory) {
            var uuid,
                stateParams;

            $scope.trustAsHTML = $sce.trustAsHtml;

            $scope.form = {
                termsForm: {}
            };

            $rootScope.resetHistory = function () {
                $ionicHistory.clearCache();
                $ionicHistory.nextViewOptions({
                    historyRoot: true,
                    disableAnimate: true,
                    expire: 0
                });
            };

            modalFactory($scope, 'app/templates/modal.html').then(function (modal) {
                $scope.modal = modal;
            });

            $scope.$on('$ionicView.beforeEnter', function (event) {
                $scope.page = [];
                stateParams = browseService.params();

                if (stateParams.type) {
                    pageService.get(stateParams.type, $window.navigator.language.substr(0, 2)).then(function (page) {
                        $scope.page = page;
                    });
                }

                // if unauth state is called -> check in authorized -> redirect to dashbaord
                var storageData = StorageFactory.get(['logged_in']);
                if (browseService.current().noAuth && storageData.logged_in) {
                    $rootScope.resetHistory();
                    return browseService.go('base.dashboard');
                }

                $scope.$emit('appLoaded');
            });

            if ($window.cordova) {
                $window.plugins.uniqueDeviceID.get(function (id) {
                    uuid = id;
                }, function (error) {
                    console.log('uuid error:', error);
                });
            }

            $scope.goTo = function (stateName) {
                browseService.go('unauthorized.' + stateName);
            };

            $scope.back = function () {
                $rootScope.resetHistory();
                $ionicHistory.goBack();
            };

            $scope.prevent = function (event) {
                event.stopPropagation();
            };

            $scope.showModal = function (type) {
                var tasks = [],
                    newPage = false,
                    language = $window.navigator.language.substr(0, 2);

                if ($scope.modal && $scope.modal.isShown()) {
                    tasks.push($scope.modal.hide());
                }
                $q.all(tasks).then(function () {
                    tasks.length = 0;
                    if ((!$scope.page || !$scope.page.length) || ($scope.page && $scope.page[0] && ($scope.page[0].type !== type || $scope.page[0].language !== language))) {
                        $scope.page = [];
                        newPage = true;
                        tasks.push(pageService.get(type, language));
                    }
                    tasks.push($scope.modal.show());
                    $q.all(tasks).then(function (results) {
                        if (newPage) {
                            $scope.page = results[0];
                        }
                    });
                });
            };

            $scope.closeModal = function () {
                $scope.modal.hide();
            };

            var fbLoginSuccess = function (userData) {
                loadingFactory().then(function (loadingOverlay) {
                    userService.facebookLogin({
                        uuid: uuid,
                        token: '1234',
                        platform: ionic.Platform.isIOS() ? 'ios' : 'android',
                        accessToken: userData.authResponse.accessToken,
                        language: $window.navigator.language.substr(0, 2)
                    }, 'facebook').then(function (userAuth) {
                        $rootScope.resetHistory();
                        if (userAuth.user.username) {
                            browseService.go('base.dashboard').then(loadingOverlay.hide, loadingOverlay.hide);
                        } else {
                            browseService.go('base.editProfileFirst', {userId: userService.user._id, first: 'first'}).then(loadingOverlay.hide, loadingOverlay.hide);
                        }
                    }, loadingOverlay.hide);
                });
            };

            var fbLoginError = function (error) {
                console.log(error);
            };

            var fbLoginStatusSuccess = function (response) {
                if (response.status === "connected") {
                    //response: authResponse: { userID, accessToken, session_key, expiresIn, sig }, status
                    //$scope.registerSocial('facebook', response.authResponse.accessToken);
                    loadingFactory().then(function (loadingOverlay) {
                        userService.facebookLogin({
                            uuid: uuid,
                            token: '1234',
                            platform: ionic.Platform.isIOS() ? 'ios' : 'android',
                            accessToken: response.authResponse.accessToken,
                            language: $window.navigator.language.substr(0, 2)
                        }, 'facebook').then(function (userAuth) {
                            $rootScope.resetHistory();
                            if (userAuth.user.username) {
                                browseService.go('base.dashboard').then(loadingOverlay.hide, loadingOverlay.hide);
                            } else {
                                browseService.go('base.editProfileFirst', {userId: userService.user._id, first: 'first'}).then(loadingOverlay.hide, loadingOverlay.hide);
                            }
                        }, loadingOverlay.hide);
                    });
                } else {
                    // response.status === "unknown" || "not_authorized"
                    $window.facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess, fbLoginError);
                }
            };

            var fbLoginStatusError = function () {
                $window.facebookConnectPlugin.login(["public_profile", "email"], fbLoginSuccess, fbLoginError);
            };

            $scope.facebookLoginStatus = function () {
                if ($window.cordova) {
                    $window.facebookConnectPlugin.getLoginStatus(fbLoginStatusSuccess, fbLoginStatusError);
                }
            };

            $scope.facebookLogin = function (state) {
                if (state === 'register') {
                    $scope.popup = popupFactory({
                        title: $rootScope.dict.agree,
                        scope: $scope,
                        template: '<form name="form.termsForm" id="form.termsForm">' +
                                    '<div class="display-flex align-center">' +
                                        '<div class="item item-checkbox uppercase">' +
                                            '<label class="checkbox checkbox-assertive">' +
                                                '<input type="checkbox" ng-model="termsAcceptedSocial" name="termsAcceptedSocial" required>' +
                                            '</label>' +
                                        '</div>' +
                                        '<div class="dark uppercase small">{{dict.confirmTermsAndConditions.part1}} <a class="bold" ng-click="showModal(\'tas\');popup.close();">{{dict.confirmTermsAndConditions.terms}}</a> {{dict.confirmTermsAndConditions.part2}} <a class="bold" ng-click="showModal(\'privacy\');popup.close();">{{dict.confirmTermsAndConditions.dataPrivacyStatement}}</a> {{dict.confirmTermsAndConditions.part3}}</div>' +
                                    '</div>' +
                                    '<div class="footer row margin-top">' +
                                        '<div class="col">' +
                                            '<button class="button button-block button-outline button-dark" ng-click="popup.close()">{{dict.cancel}}</button>' +
                                        '</div>' +
                                        '<div class="col">' +
                                            '<button class="button button-block button-outline button-assertive" ng-disabled="!termsAcceptedSocial" ng-click="popup.close(); facebookLoginStatus()">{{dict.confirm}}</button>' +
                                        '</div>' +
                                    '</div>' +
                                  '</form>'
                    });
                } else {
                    if ($window.cordova) {
                        $window.facebookConnectPlugin.getLoginStatus(fbLoginStatusSuccess, fbLoginStatusError);
                    }
                }
            };
        }
    ]);
});
