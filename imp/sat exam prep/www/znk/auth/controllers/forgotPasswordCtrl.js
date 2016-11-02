'use strict';

(function () {

    angular.module('znk.sat').controller('ForgotPasswordCtrl', ['$scope', '$state', '$timeout', 'AuthSrv', 'NetworkSrv', 'ErrorHandlerSrv', ForgotPasswordCtrl]);

    function ForgotPasswordCtrl($scope, $state, $timeout, AuthSrv, NetworkSrv, ErrorHandlerSrv) {

        var _this = this;
        _this._validationMessages = {
            noValidEmail: 'Please enter a valid email address'
        };

        _this._validateUserInput = function _validateUserInput() {

            if (!$scope.forgotPasswordData.email) {
                ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noValidEmail);
                return false;
            }

            if ($scope.forgotPasswordData.email.indexOf('@') > -1) {

                if (!_this._isEmailValid($scope.forgotPasswordData.email)) {
                    ErrorHandlerSrv.displayErrorMsg(_this._validationMessages.noValidEmail);
                    return false;
                }
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

        $scope.forgotPasswordData = {
            email: ''
        };

        $scope.isOffline = NetworkSrv.isDeviceOffline();

        $scope.onClickDone = function () {

            if ($scope.isOffline) {
                ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                return;
            }
            else {

                if (!_this._validateUserInput()) {
                    return;
                }

                _this._startLoader();

                AuthSrv.forgotPassword($scope.forgotPasswordData).then(function (response) {

                    $timeout(function() {

                        $state.go('app.home' );
                    },100);
                    },
                function (err) {

                    $timeout(function() {
                        _this._endLoader();

                        if ( $scope.isOffline ) {
                            ErrorHandlerSrv.displayErrorMsg(ErrorHandlerSrv.messages.noInternetConnection);
                            return;
                        }
                        else {
                            $scope.error = ErrorHandlerSrv.handleError ( err );
                            ErrorHandlerSrv.displayErrorMsg($scope.error.message);
                        }
                    },100);
                });
            }
        };

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
