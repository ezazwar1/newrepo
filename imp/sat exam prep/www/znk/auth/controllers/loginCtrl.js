'use strict';

(function () {

    angular.module('znk.sat').controller('LoginCtrl', ['$scope', '$state', '$timeout', 'AuthSrv', 'NetworkSrv', 'ErrorHandlerSrv', 'ExerciseUtilsSrv', '$rootScope', 'OfflineContentSrv', 'KeyboardSrv', 'HintSrv', '$q', LoginCtrl]);

    function LoginCtrl($scope, $state, $timeout, AuthSrv, NetworkSrv, ErrorHandlerSrv, ExerciseUtilsSrv, $rootScope, OfflineContentSrv, KeyboardSrv, HintSrv, $q) {
            var _this = this;
            _this._validationMessages = {
                noUserOrEmail: 'Please enter your email',
                noValidEmail: 'Please enter a valid email address',
                noPassword: 'Please fill your password'
            };

            _this._validateUserInput = function _validateUserInput() {//@todo(igor) angular validators should be used instead

                if (!$scope.loginData.userNameOrEmail) {
                    ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noUserOrEmail);
                    return false;
                }
                if ($scope.loginData.userNameOrEmail.indexOf('@') > -1) {
                    $scope.loginData.email = $scope.loginData.userNameOrEmail;

                    if (!_this._isEmailValid($scope.loginData.email)) {
                        ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noValidEmail);
                        return false;
                    }
                }
                else {
                    $scope.loginData.userName = $scope.loginData.userNameOrEmail;

                    if (!$scope.loginData.userName) {
                        ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noUserOrEmail);
                        return false;
                    }
                }

                if (!$scope.loginData.password) {
                    ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noPassword);
                    return false;
                }

                return true;
            };

            _this._isEmailValid = function _isEmailValid(email) {
                if (!email) {
                    return false;
                }
                var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
                return re.test(email);
            };

            _this._startLoader = function _startLoader() {
                $scope.startLoader = true;
                $scope.fillLoader = undefined;
            };

            _this._endLoader = function _endLoader() {
                $scope.startLoader = false;
                $scope.fillLoader = false;
            };

            $scope.loginData = {
                userName: '',
                email: '',
                password: '',
                userNameOrEmail:'',
                useRefreshTokens: true
            };

            $scope.isOffline = NetworkSrv.isDeviceOffline();

            $scope.onClickDone = function () {
                $scope.lockLoginBtn = true;
                login().finally(function(){
                    $scope.lockLoginBtn = false;
                });
            };

            function login() {
                if ($scope.isOffline) {
                    ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                    return $q.when();
                }
                else {

                    if (!_this._validateUserInput()) {
                        return $q.when();
                    }

                    _this._startLoader();

                    return AuthSrv.login($scope.loginData).then(function () {
                                return OfflineContentSrv.checkForNewContent({silent: true}).then(function () {
                                        KeyboardSrv.hideKeyboard();
                                        $state.go('app.home');
                                });
                            },
                            function (err) {
                                return $timeout(function () {
                                    _this._endLoader();

                                    if ($scope.isOffline) {
                                        ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                                        return;
                                    }
                                    else {
                                        $scope.error = ErrorHandlerSrv.handleError(err);
                                        ErrorHandlerSrv.displayErrorMsg($scope.error.message);
                                    }
                                }, 100);
                        });
                }
            }

            $scope.navigate = function navigate(stateName) {
                if ($scope.isOffline) {
                    ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                }
                else {
                    $state.go(stateName);
                }
            };

            $scope.$on('connectionChanged', function (event, isOffline) {

                if (!$scope.$$phase) {
                    $scope.$apply(function () {
                        $scope.isOffline = isOffline;
                    });
                }
                else {
                    $scope.isOffline = isOffline;
                }
            });
        }
})();
