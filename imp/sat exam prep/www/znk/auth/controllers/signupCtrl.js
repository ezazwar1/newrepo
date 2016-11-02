'use strict';

(function () {

    angular.module('znk.sat').controller('SignupCtrl', ['$scope', '$state', '$timeout', 'AuthSrv', 'NetworkSrv', 'ErrorHandlerSrv', 'ExerciseUtilsSrv', 'OfflineContentSrv', '$rootScope', 'KeyboardSrv', 'HintSrv', '$q',  SignupCtrl]);

    function SignupCtrl($scope, $state, $timeout, AuthSrv, NetworkSrv, ErrorHandlerSrv, ExerciseUtilsSrv, OfflineContentSrv, $rootScope, KeyboardSrv, HintSrv, $q) {

        var _this = this;
        _this._validationMessages = {
            noNickName: 'Please enter your Nickname',
            noValidEmail: 'Please enter a valid email address',
            noPassword: 'Please fill your password',
            passwordWithSpace: 'Password cannot contain spaces',
            passwordLength: 'Password length must be at least 6 characters',
            userExists:'User already exists. If you create account with the same email on other Zinkerz app, login to ZinkerzTOEFL with the same credentials. Otherwise, sign up with a different email address.'
        };

        _this._validateUserInput = function _validateUserInput() {//@todo(igor) angular validators should be used instead

            if (!$scope.registration.nickname) {
                ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noNickName);
                return false;
            }

            if (!$scope.registration.email) {
                ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noValidEmail);
                return false;
            } else {
                if (!_this._isEmailValid($scope.registration.email)) {
                    ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noValidEmail);
                    return false;
                }
            }

            if (!$scope.registration.password) {
                ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noPassword);
                return false;
            }
            else {
                if ($scope.registration.password.indexOf(' ') > -1) {
                    ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.passwordWithSpace);
                    return false;
                }
            }

            if ($scope.registration.password.length < 6) {
                ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.passwordLength);
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

        $scope.savedSuccessfully = false;

        $scope.isOffline = NetworkSrv.isDeviceOffline();

        $scope.registration = {
            email: "",
            password: "",
            nickname: ""
        };



        var NAVIGATING_TO_HOME = 'NAV_TO_HOME';
        $scope.onClickDone = function onClickDone() {
            $scope.lockSignUpBtn = true;
            signUp().then(function(result){
                if(result !== NAVIGATING_TO_HOME){
                    $scope.lockSignUpBtn = false;
                }
            },function(){
                $scope.lockSignUpBtn = false;
            });
        };

        function signUp(){
            if ($scope.isOffline) {
                ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                return $q.when();
            }
            else {

                if (!_this._validateUserInput()) {
                    return $q.when();
                }

                _this._startLoader();

                return AuthSrv.saveRegistration($scope.registration).then(
                        function (response) {
                            $scope.fillLoader = true;
                            $scope.savedSuccessfully = true;

                         return AuthSrv.login({
                                email: $scope.registration.email,
                                password: $scope.registration.password,
                                useRefreshTokens: true
                            }).then(function (response) {
                                     KeyboardSrv.hideKeyboard();
                                     $state.go('app.home');
                                     return NAVIGATING_TO_HOME;
                                },
                                function (err) {
                                    return $timeout(function(){
                                            _this._endLoader();
                                            $state.go('login');
                                        },100);
                                });
                        },
                        function (err) {
                            $scope.fillLoader = true;
                            return $timeout(function(){
                                    _this._endLoader();
                                    if ($scope.isOffline) {
                                        ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                                        return;
                                    }
                                    else {
                                        if(err.code === 'EMAIL_TAKEN'){
                                            ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.userExists);
                                        }
                                        else{
                                            $scope.error = ErrorHandlerSrv.handleError(err);
                                            ErrorHandlerSrv.displayErrorMsg($scope.error.message);
                                        }
                                    }
                                },100);
                        });
            }
        }

        $scope.navigate = function navigate(stateName) {
            $state.go(stateName);
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
